import { deliveryPreferenceOptions } from "@/features/requests/constants";
import type { CompleteLessonRequestPayload, LessonRequestFormValues } from "@/features/requests/types";
import type { TeacherProfile } from "@/features/teachers/types";

export function defaultDeliveryModeForTeacher(teacher: TeacherProfile): "online" | "face_to_face" {
  return teacher.deliveryMode === "face_to_face" ? "face_to_face" : "online";
}

export function deliveryModeAllowedForTeacher(
  teacher: TeacherProfile,
  deliveryMode: "online" | "face_to_face"
) {
  return teacher.deliveryMode === "both" || teacher.deliveryMode === deliveryMode;
}

export function deliveryOptionsForTeacher(teacher: TeacherProfile) {
  return deliveryPreferenceOptions.filter((option) =>
    deliveryModeAllowedForTeacher(teacher, option.value)
  );
}

export function lessonSlugFromName(lessonName: string) {
  return lessonName
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replaceAll("/", "")
    .replaceAll(" ", "-")
    .replaceAll("--", "-")
    .trim();
}

export function locationSlugFromTeacher(teacher: TeacherProfile) {
  return `${lessonSlugFromName(teacher.city)}-${lessonSlugFromName(teacher.district)}`;
}

export function formValuesToCompletePayload(values: LessonRequestFormValues): CompleteLessonRequestPayload {
  return {
    teacherSlug: values.teacherSlug,
    lessonSlug: values.lessonSlug,
    locationSlug: values.locationSlug,
    deliveryMode: values.deliveryMode,
    studentLevel: values.studentLevel,
    goal: values.goal,
    budgetMin: values.budgetMin,
    budgetMax: values.budgetMax,
    studentName: values.studentName,
    email: values.email,
    phone: values.phone,
    contactPreference: values.contactPreference,
    termsAccepted: values.termsAccepted,
    privacyAccepted: values.privacyAccepted,
    password: values.password,
  };
}

export function apiErrorMessage(payload: unknown) {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  return "Ders talebi gönderilemedi. Lütfen tekrar dene.";
}

export function optionalNumber(value: string | undefined) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
