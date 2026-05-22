import { z } from "zod";

export const lessonRequestSteps = [
  { id: "lesson", title: "Ders" },
  { id: "location", title: "Konum" },
  { id: "details", title: "İhtiyaç" },
  { id: "contact", title: "İletişim" },
  { id: "account", title: "Hesap" },
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

export const lessonRequestFormStepFields = {
  lesson: ["lessonSlug"],
  location: ["locationSlug", "deliveryMode"],
  details: ["studentLevel", "goal", "budgetMin", "budgetMax"],
  contact: ["studentName", "email", "phone", "contactPreference", "termsAccepted", "privacyAccepted"],
  account: ["password", "passwordConfirm"],
} as const;

export const completeLessonRequestSchema = z
  .object({
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
    password: z.string().min(8, "Şifre en az 8 karakter olmalı."),
  });

export const lessonRequestFormSchema = completeLessonRequestSchema
  .extend({
    passwordConfirm: z.string().min(8, "Şifre tekrarını gir."),
  })
  .refine((values) => values.password === values.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Şifreler eşleşmiyor.",
  });
