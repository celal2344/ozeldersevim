import { getCurrentAccount } from "@/features/auth/service";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";
import type { TeacherReview } from "@/features/reviews/types";

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
