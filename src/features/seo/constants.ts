import type { Metadata } from "next";

export const rootMetadata: Metadata = {
  title: {
    default: "Özel Ders Evim",
    template: "%s | Özel Ders Evim",
  },
  description: "Türkiye için özel ders öğretmeni bulma ve ders talebi platformu.",
};

export const teacherSearchMetadata: Metadata = {
  title: "Öğretmen Bul",
  description: "Ders, şehir, ilçe, ücret ve ders türüne göre özel ders öğretmeni ara.",
};

export const lessonRequestMetadata: Metadata = {
  title: "Ders Talebi",
  description: "Giriş yaparak öğretmene özel ders talebi gönder.",
};

export const teacherOnboardingMetadata: Metadata = {
  title: "Öğretmen Ol",
  description: "Öğretmen hesabı oluştur. Öğretmenlik testi, ilan oluşturma adımında gösterilir.",
};

export const privacyMetadata: Metadata = {
  title: "Gizlilik Politikası",
};

export const termsMetadata: Metadata = {
  title: "Kullanım Koşulları",
};

export const kvkkMetadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
};

export const sitemapStaticRoutes = [
  "/",
  "/ogretmen-bul",
  "/ogretmen-ol",
  "/kayit",
  "/giris",
  "/gizlilik-politikasi",
  "/kullanim-kosullari",
  "/kvkk-aydinlatma-metni",
];
