import { z } from "zod";

export const deliveryModeOptions = [
  { value: "online", label: "Online" },
  { value: "face_to_face", label: "Yüz yüze" },
  { value: "both", label: "Online ve Yüz yüze" },
] as const;

export const lessonCategoryOptions = [
  { value: "matematik", label: "Matematik" },
  { value: "fizik", label: "Fizik" },
  { value: "kimya", label: "Kimya" },
  { value: "ingilizce", label: "İngilizce" },
  { value: "turkce", label: "Türkçe" },
  { value: "yazilim", label: "Yazılım" },
  { value: "lgs", label: "LGS" },
  { value: "tyt-ayt", label: "TYT / AYT" },
] as const;

export const locationOptions = [
  { value: "erzurum-yakutiye", label: "Erzurum / Yakutiye" },
  { value: "erzurum-palandoken", label: "Erzurum / Palandöken" },
  { value: "istanbul-kadikoy", label: "İstanbul / Kadıköy" },
  { value: "ankara-cankaya", label: "Ankara / Çankaya" },
  { value: "izmir-konak", label: "İzmir / Konak" },
] as const;

export const teacherOnboardingSchema = z.object({
  title: z.string().min(5, "Profil başlığı en az 5 karakter olmalı.").max(120),
  bio: z.string().min(20, "Tanıtım yazısı en az 20 karakter olmalı.").max(1000),
  education: z.string().min(5, "Eğitim bilgisi zorunlu.").max(200),
  experienceYears: z
    .string()
    .min(1, "Tecrübe yılı zorunlu.")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, { message: "Geçerli bir sayı gir." }),
  hourlyPrice: z
    .string()
    .min(1, "Saatlik ücret zorunlu.")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, { message: "Geçerli bir ücret gir." }),
  deliveryMode: z.enum(["online", "face_to_face", "both"], {
    error: "Ders türü seçimi zorunlu.",
  }),
  locationSlug: z.string().min(1, "Konum seçimi zorunlu."),
  lessonSlugs: z
    .array(z.string())
    .min(1, "En az bir ders kategorisi seçmelisin."),
  publishNow: z.boolean(),
});

export const teacherOnboardingApiSchema = teacherOnboardingSchema.extend({
  lessonSlugs: z.array(z.string()).min(1),
});
