import { getCurrentAccount } from "@/features/auth/service";
import type { AuthAccount } from "@/features/auth/types";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";
import type { SubmitReviewPayload, SubmitReviewResponse, TeacherReview } from "@/features/reviews/types";
import { trackEvent } from "@/features/analytics/track";

export class ReviewError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

export async function getTeacherReviews(): Promise<TeacherReview[]> {
  const account = await getCurrentAccount();
  if (!account || account.role !== "teacher") return [];

  const supabase = await createSupabaseServerClient();

  const { data: teacherProfile, error: profileError } = await supabase
    .from("teacher_profiles")
    .select("id")
    .eq("profile_id", account.id)
    .maybeSingle();

  if (profileError) throw new Error(profileError.message);
  if (!teacherProfile) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id, rating, comment, status, created_at, lesson_requests!lesson_request_id(lesson_categories!lesson_category_id(name))"
    )
    .eq("teacher_profile_id", teacherProfile.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []) as unknown as TeacherReview[];
}

function assertStudent(account: AuthAccount | null) {
  if (!account) {
    throw new ReviewError("Yorum yazmak için giriş yapmalısın.", 401);
  }

  if (account.role !== "student") {
    throw new ReviewError("Yorum yalnızca öğrenci hesapları tarafından yazılabilir.", 403);
  }

  return account;
}

export async function submitStudentReview(input: SubmitReviewPayload): Promise<SubmitReviewResponse> {
  const account = assertStudent(await getCurrentAccount());
  const supabase = await createSupabaseServerClient();

  const { data: lessonRequest, error: fetchError } = await supabase
    .from("lesson_requests")
    .select("id, status, teacher_profile_id, student_profile_id")
    .eq("id", input.lessonRequestId)
    .eq("student_profile_id", account.id)
    .maybeSingle();

  if (fetchError) {
    throw new ReviewError(fetchError.message, 500);
  }

  if (!lessonRequest) {
    throw new ReviewError("Ders talebi bulunamadı.", 404);
  }

  if (lessonRequest.status !== "accepted") {
    throw new ReviewError("Yorum yalnızca kabul edilmiş taleplere yazılabilir.", 409);
  }

  const { data: review, error: insertError } = await supabase
    .from("reviews")
    .insert({
      lesson_request_id: input.lessonRequestId,
      student_profile_id: account.id,
      teacher_profile_id: lessonRequest.teacher_profile_id,
      rating: input.rating,
      comment: input.comment ?? null,
    })
    .select("id, rating, status")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      throw new ReviewError("Bu talep için zaten bir yorum yazılmış.", 409);
    }

    throw new ReviewError(insertError.message, 500);
  }

  await trackEvent(supabase, "review_submitted", {
    rating: input.rating,
    lessonRequestId: input.lessonRequestId,
  }, account.id);

  return { reviewId: review.id, rating: review.rating, status: review.status };
}
