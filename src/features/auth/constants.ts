import { z } from "zod";

export const authRoleOptions = [
  { value: "student", label: "Öğrenci" },
  { value: "teacher", label: "Öğretmen" },
] as const;

export const studentSignupRedirect = "/ogretmen-bul";
export const studentLoginRedirect = "/ogrenci/panel";
export const teacherPanelPath = "/ogretmen/panel";
export const studentPanelPath = "/ogrenci/panel";

export const registerSchema = z.object({
  role: z.enum(["student", "teacher"], {
    error: "Hesap türü seçimi zorunlu.",
  }),
  fullName: z.string().min(2, "Ad soyad zorunlu.").max(120, "Ad soyad çok uzun."),
  email: z.email("Geçerli bir email gir."),
  phone: z.string().min(10, "Telefon zorunlu.").max(30, "Telefon çok uzun."),
  password: z.string().min(8, "Şifre en az 8 karakter olmalı."),
  termsAccepted: z.boolean().refine((value) => value, {
    message: "Kullanım koşullarını kabul etmelisin.",
  }),
  privacyAccepted: z.boolean().refine((value) => value, {
    message: "Gizlilik/KVKK metnini kabul etmelisin.",
  }),
});

export const loginSchema = z.object({
  email: z.email("Geçerli bir email gir."),
  password: z.string().min(1, "Şifre zorunlu."),
});
