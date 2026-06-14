import type { z } from "zod";

import type { createCalendarLessonSchema, updateCalendarLessonSchema } from "@/features/calendar/constants";

export type CalendarLessonStatus = "scheduled" | "completed" | "cancelled" | "no_show";

export type TeacherStudent = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  sourceLessonRequestId: string | null;
};

export type CalendarLesson = {
  id: string;
  lessonRequestId: string | null;
  teacherStudentId: string | null;
  studentName: string;
  studentEmail: string | null;
  studentPhone: string | null;
  lessonName: string;
  deliveryMode: "online" | "face_to_face" | "both";
  status: CalendarLessonStatus;
  scheduledAt: string | null;
  durationMinutes: number;
  priceAmount: number;
  currency: string;
  notes: string | null;
  cancellationReason: string | null;
};

export type UnscheduledLessonRequest = {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  lessonName: string;
  goal: string | null;
  studentLevel: string | null;
  acceptedAt: string | null;
};

export type TeacherCalendarSummary = {
  futureLessonCount: number;
  activeStudentCount: number;
  thisMonthIncome: number;
  futureProjectedIncome: number;
};

export type TeacherCalendarResource = {
  lessons: CalendarLesson[];
  students: TeacherStudent[];
  unscheduledRequests: UnscheduledLessonRequest[];
  summary: TeacherCalendarSummary;
};

export type CreateCalendarLessonInput = z.infer<typeof createCalendarLessonSchema>;

export type UpdateCalendarLessonInput = z.infer<typeof updateCalendarLessonSchema>;
