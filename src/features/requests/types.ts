import type { z } from "zod";

import type { lessonRequestFormSchema, submitLessonRequestSchema } from "@/features/requests/constants";

export type LessonRequestFormValues = z.infer<typeof lessonRequestFormSchema>;

export type SubmitLessonRequestPayload = z.infer<typeof submitLessonRequestSchema>;

export type SubmitLessonRequestResponse = {
  requestId: string;
  studentProfileId: string;
  status: "submitted";
};

export type LessonRequestStatus = "submitted" | "accepted" | "rejected" | "expired" | "cancelled";

export type TeacherLessonRequest = {
  id: string;
  status: LessonRequestStatus;
  delivery_mode: "online" | "face_to_face" | "both";
  student_level: string | null;
  goal: string | null;
  budget_min: number | null;
  budget_max: number | null;
  created_at: string;
  accepted_at: string | null;
  rejected_at: string | null;
  student_profile_id: string;
  lesson_categories: { name: string } | null;
  lesson_request_contacts: { student_name: string; email: string; phone: string } | null;
};

export type StudentLessonRequest = {
  id: string;
  status: LessonRequestStatus;
  delivery_mode: "online" | "face_to_face" | "both";
  student_level: string | null;
  goal: string | null;
  created_at: string;
  accepted_at: string | null;
  rejected_at: string | null;
  lesson_categories: { name: string } | null;
  reviews: { id: string }[] | null;
};
