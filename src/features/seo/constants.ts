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
  "/gizlilik-politikasi",
  "/kullanim-kosullari",
  "/kvkk-aydinlatma-metni",
];
