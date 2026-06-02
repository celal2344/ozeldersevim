import { createSupabaseServerClient } from "@/shared/db/supabase/server";
import type { TeacherLessonRequest, StudentLessonRequest } from "@/features/requests/types";

export async function getTeacherLessonRequests(): Promise<TeacherLessonRequest[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("lesson_requests")
    .select(
      "id, status, delivery_mode, student_level, goal, budget_min, budget_max, created_at, accepted_at, rejected_at, student_profile_id, lesson_categories!lesson_category_id(name), lesson_request_contacts(student_name, email, phone)"
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []) as unknown as TeacherLessonRequest[];
}

export async function getStudentLessonRequests(): Promise<StudentLessonRequest[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("lesson_requests")
    .select(
      "id, status, delivery_mode, student_level, goal, created_at, accepted_at, rejected_at, lesson_categories!lesson_category_id(name)"
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []) as unknown as StudentLessonRequest[];
}
