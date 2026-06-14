import { z } from "zod";

import { hourOptions, weekdayOptions } from "@/features/availability/constants";
import type { LessonRequestStatus } from "@/features/requests/types";

export const lessonRequestStatusLabels: Record<LessonRequestStatus, string> = {
  submitted: "Bekliyor",
  accepted: "Kabul Edildi",
  rejected: "Reddedildi",
  expired: "Süresi Doldu",
  cancelled: "İptal",
};

export const lessonRequestStatusVariant: Record<LessonRequestStatus, "default" | "secondary" | "destructive" | "outline"> = {
  submitted: "secondary",
  accepted: "default",
  rejected: "destructive",
  expired: "outline",
  cancelled: "outline",
};

export const deliveryModeLabels: Record<"online" | "face_to_face" | "both", string> = {
  online: "Online",
  face_to_face: "Yüz yüze",
  both: "Online / Yüz yüze",
};

export const lessonRequestSteps = [
  { id: "lesson", title: "Ders" },
  { id: "location", title: "Konum" },
  { id: "details", title: "İhtiyaç" },
  { id: "contact", title: "İletişim" },
] as const;

export const studentLevelOptions = [
  { value: "ilkokul", label: "İlkokul" },
  { value: "ortaokul", label: "Ortaokul" },
  { value: "lise", label: "Lise" },
  { value: "universite", label: "Üniversite" },
  { value: "sinav_hazirlik", label: "Sınav hazırlık" },
  { value: "yetiskin", label: "Yetişkin" },
] as const;

export const lessonRequestLessonOptions = [
  { value: "matematik", label: "Matematik" },
  { value: "fizik", label: "Fizik" },
  { value: "kimya", label: "Kimya" },
  { value: "ingilizce", label: "İngilizce" },
  { value: "turkce", label: "Türkçe" },
  { value: "yazilim", label: "Yazılım" },
  { value: "lgs", label: "LGS" },
  { value: "tyt-ayt", label: "TYT / AYT" },
] as const;

export const lessonRequestLocationOptions = [
  { value: "erzurum-yakutiye", label: "Erzurum / Yakutiye" },
  { value: "erzurum-palandoken", label: "Erzurum / Palandöken" },
  { value: "istanbul-kadikoy", label: "İstanbul / Kadıköy" },
  { value: "ankara-cankaya", label: "Ankara / Çankaya" },
  { value: "izmir-konak", label: "İzmir / Konak" },
] as const;

export const contactPreferenceOptions = [
  { value: "phone", label: "Telefon" },
  { value: "both", label: "Telefon ve email" },
] as const;

export const deliveryPreferenceOptions = [
  { value: "online", label: "Online" },
  { value: "face_to_face", label: "Yüz yüze" },
] as const;

export const preferredWeekdayOptions = [{ value: "", label: "Gün tercihi yok" }, ...weekdayOptions] as const;
export const preferredStartHourOptions = [{ value: "", label: "Saat tercihi yok" }, ...hourOptions] as const;

export const lessonRequestFormStepFields = {
  lesson: ["lessonSlug"],
  location: ["locationSlug", "deliveryMode"],
  details: ["studentLevel", "goal", "budgetMin", "budgetMax", "preferredWeekday", "preferredStartHour"],
  contact: ["studentName", "email", "phone", "contactPreference", "termsAccepted", "privacyAccepted"],
} as const;

export const submitLessonRequestSchema = z.object({
  teacherSlug: z.string().min(1, "Öğretmen seçimi zorunlu."),
  lessonSlug: z.string().min(1, "Ders seçimi zorunlu."),
  locationSlug: z.string().min(1, "Konum seçimi zorunlu."),
  deliveryMode: z.enum(["online", "face_to_face"], {
    error: "Ders türü seçimi zorunlu.",
  }),
  studentLevel: z.string().min(1, "Seviye seçimi zorunlu."),
  goal: z.string().min(10, "İhtiyacını en az 10 karakterle açıkla.").max(600, "İhtiyaç açıklaması 600 karakteri geçemez."),
  budgetMin: z.string().optional(),
  budgetMax: z.string().optional(),
  preferredWeekday: z.string().optional().refine((value) => !value || ["1", "2", "3", "4", "5", "6", "7"].includes(value), {
    message: "Gün tercihi geçersiz.",
  }),
  preferredStartHour: z.string().optional().refine((value) => !value || (Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 23), {
    message: "Saat tercihi geçersiz.",
  }),
  studentName: z.string().min(2, "Ad soyad zorunlu."),
  email: z.email("Geçerli bir email gir."),
  phone: z.string().min(10, "Telefon zorunlu."),
  contactPreference: z.enum(["phone", "both"], {
    error: "İletişim tercihi seçimi zorunlu.",
  }),
  termsAccepted: z.boolean().refine((value) => value, {
    message: "Kullanım koşullarını kabul etmelisin.",
  }),
  privacyAccepted: z.boolean().refine((value) => value, {
    message: "Gizlilik/KVKK metnini kabul etmelisin.",
  }),
});

export const lessonRequestFormSchema = submitLessonRequestSchema;
