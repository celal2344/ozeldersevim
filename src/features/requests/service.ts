import { getCurrentAccount } from "@/features/auth/service";
import type { AuthAccount } from "@/features/auth/types";
import type { StudentLessonRequest, TeacherLessonRequest } from "@/features/requests/types";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

export class LessonRequestError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

function assertRole(account: AuthAccount | null, role: "student" | "teacher") {
  if (!account) {
    throw new LessonRequestError("Giriş yapmalısın.", 401);
  }

  if (account.role !== role) {
    throw new LessonRequestError(
      role === "teacher"
        ? "Bu işlem yalnızca öğretmen hesapları tarafından yapılabilir."
        : "Bu işlem yalnızca öğrenci hesapları tarafından yapılabilir.",
      403
    );
  }

  return account;
}

export async function getTeacherLessonRequests(): Promise<TeacherLessonRequest[]> {
  const account = assertRole(await getCurrentAccount(), "teacher");
  const supabase = await createSupabaseServerClient();

  const { data: teacherProfile, error: teacherProfileError } = await supabase
    .from("teacher_profiles")
    .select("id")
    .eq("profile_id", account.id)
    .maybeSingle();

  if (teacherProfileError) throw new Error(teacherProfileError.message);
  if (!teacherProfile) return [];

  const { data, error } = await supabase
    .from("lesson_requests")
    .select(
      "id, status, delivery_mode, student_level, goal, budget_min, budget_max, created_at, accepted_at, rejected_at, student_profile_id, lesson_categories!lesson_category_id(name), lesson_request_contacts(student_name, email, phone)"
    )
    .eq("teacher_profile_id", teacherProfile.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return ((data ?? []) as unknown as TeacherLessonRequest[]).map((request) => ({
    ...request,
    lesson_request_contacts: request.status === "accepted" ? request.lesson_request_contacts : null,
  }));
}

export async function getStudentLessonRequests(): Promise<StudentLessonRequest[]> {
  const account = assertRole(await getCurrentAccount(), "student");
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("lesson_requests")
    .select(
      "id, status, delivery_mode, student_level, goal, created_at, accepted_at, rejected_at, lesson_categories!lesson_category_id(name), reviews(id)"
    )
    .eq("student_profile_id", account.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []) as unknown as StudentLessonRequest[];
}

export async function updateTeacherLessonRequestStatus(
  requestId: string,
  status: "accepted" | "rejected"
) {
  const account = assertRole(await getCurrentAccount(), "teacher");
  const supabase = await createSupabaseServerClient();

  const { data: teacherProfile, error: teacherProfileError } = await supabase
    .from("teacher_profiles")
    .select("id")
    .eq("profile_id", account.id)
    .maybeSingle();

  if (teacherProfileError) {
    throw new LessonRequestError(teacherProfileError.message, 500);
  }

  if (!teacherProfile) {
    throw new LessonRequestError("Öğretmen profili bulunamadı.", 404);
  }

  const { data: lessonRequest, error: fetchError } = await supabase
    .from("lesson_requests")
    .select("id, status")
    .eq("id", requestId)
    .eq("teacher_profile_id", teacherProfile.id)
    .maybeSingle();

  if (fetchError) {
    throw new LessonRequestError(fetchError.message, 500);
  }

  if (!lessonRequest) {
    throw new LessonRequestError("Ders talebi bulunamadı.", 404);
  }

  if (lessonRequest.status !== "submitted") {
    throw new LessonRequestError("Yalnızca bekleyen talepler güncellenebilir.", 409);
  }

  const timestampColumn = status === "accepted" ? "accepted_at" : "rejected_at";
  const { error: updateError } = await supabase
    .from("lesson_requests")
    .update({ status, [timestampColumn]: new Date().toISOString() })
    .eq("id", requestId)
    .eq("teacher_profile_id", teacherProfile.id);

  if (updateError) {
    throw new LessonRequestError(updateError.message, 500);
  }

  return { id: requestId, status };
}
