import { z } from "zod";
import type { TeacherListingInput } from "@/features/teacher-listings/types";

export const teacherListingDeliveryOptions = [
  { value: "both", label: "Online + yüz yüze" },
  { value: "online", label: "Online" },
  { value: "face_to_face", label: "Yüz yüze" },
] as const;

export const teacherListingStatusOptions = [
  { value: "draft", label: "Taslak" },
  { value: "published", label: "Yayında" },
] as const;

export const teacherListingSchema = z.object({
  status: z.enum(["draft", "published"], {
    error: "İlan durumu seçimi zorunlu.",
  }),
  title: z.string().min(3, "Başlık zorunlu.").max(120, "Başlık çok uzun."),
  bio: z.string().min(20, "Açıklama en az 20 karakter olmalı.").max(1200, "Açıklama çok uzun."),
  education: z.string().min(2, "Eğitim bilgisi zorunlu.").max(180, "Eğitim bilgisi çok uzun."),
  experienceYears: z.number().int().min(0, "Deneyim negatif olamaz.").max(60, "Deneyim çok yüksek."),
  hourlyPrice: z.number().min(1, "Saatlik fiyat zorunlu.").max(100000, "Saatlik fiyat çok yüksek."),
  deliveryMode: z.enum(["online", "face_to_face", "both"], {
    error: "Ders türü seçimi zorunlu.",
  }),
  locationSlug: z.string().min(1, "Konum seçimi zorunlu."),
  lessonSlugs: z.array(z.string().min(1)).min(1, "En az bir ders seçmelisin."),
});

export const emptyTeacherListingDefaults: TeacherListingInput = {
  status: "draft",
  title: "",
  bio: "",
  education: "",
  experienceYears: 0,
  hourlyPrice: 0,
  deliveryMode: "both",
  locationSlug: "",
  lessonSlugs: [],
};
