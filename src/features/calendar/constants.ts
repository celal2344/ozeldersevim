import { z } from "zod";

export const lessonStatusLabels = {
  scheduled: "Planlandı",
  completed: "Tamamlandı",
  cancelled: "İptal edildi",
  no_show: "Gelmedi",
} as const;

export const calendarLessonStatusOptions = [
  { value: "scheduled", label: lessonStatusLabels.scheduled },
  { value: "completed", label: lessonStatusLabels.completed },
  { value: "cancelled", label: lessonStatusLabels.cancelled },
  { value: "no_show", label: lessonStatusLabels.no_show },
] as const;

export const lessonDurationOptions = [
  { value: "30", label: "30 dakika" },
  { value: "45", label: "45 dakika" },
  { value: "60", label: "60 dakika" },
  { value: "90", label: "90 dakika" },
  { value: "120", label: "120 dakika" },
] as const;

const optionalNullableText = z.string().max(240).optional().nullable();

export const createCalendarLessonSchema = z.object({
  teacherStudentId: z.string().uuid().optional().nullable(),
  studentName: z.string().min(2, "Öğrenci adı zorunlu.").max(120).optional(),
  studentEmail: z.string().email("Email geçersiz.").optional().or(z.literal("")),
  studentPhone: z.string().max(30).optional().or(z.literal("")),
  lessonSlug: z.string().min(1, "Ders seçmelisin."),
  scheduledAt: z.string().datetime("Ders tarihi geçersiz."),
  durationMinutes: z.number().int().min(15).max(480).default(60),
  priceAmount: z.number().min(0).default(0),
  deliveryMode: z.enum(["online", "face_to_face", "both"]).default("both"),
  notes: optionalNullableText,
});

export const updateCalendarLessonSchema = z.object({
  scheduledAt: z.string().datetime("Ders tarihi geçersiz.").optional().nullable(),
  durationMinutes: z.number().int().min(15).max(480).optional(),
  priceAmount: z.number().min(0).optional(),
  deliveryMode: z.enum(["online", "face_to_face", "both"]).optional(),
  status: z.enum(["scheduled", "completed", "cancelled", "no_show"]).optional(),
  notes: optionalNullableText,
  cancellationReason: optionalNullableText,
});
