import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Geçerli bir email gir."),
  password: z.string().min(1, "Şifre zorunlu."),
});

export const studentRegisterSchema = z
  .object({
    fullName: z.string().min(2, "Ad soyad zorunlu."),
    phone: z.string().min(10, "Telefon zorunlu."),
    email: z.email("Geçerli bir email gir."),
    password: z.string().min(8, "Şifre en az 8 karakter olmalı."),
    passwordConfirm: z.string().min(8, "Şifre tekrarını gir."),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Şifreler eşleşmiyor.",
  });

export const teacherRegisterSchema = z
  .object({
    fullName: z.string().min(2, "Ad soyad zorunlu."),
    phone: z.string().min(10, "Telefon zorunlu."),
    email: z.email("Geçerli bir email gir."),
    password: z.string().min(8, "Şifre en az 8 karakter olmalı."),
    passwordConfirm: z.string().min(8, "Şifre tekrarını gir."),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Şifreler eşleşmiyor.",
  });
