import { HeartIcon, SearchIcon, UserIcon, ClipboardListIcon } from "lucide-react";

import type { DashboardPageContent, DashboardRoleConfig } from "@/features/dashboard/types";

export const studentDashboardConfig: DashboardRoleConfig = {
  role: "student",
  label: "Öğrenci Paneli",
  homeHref: "/",
  navItems: [
    { href: "/ogrenci/panel", icon: SearchIcon, label: "Genel Bakış", pageId: "student-home" },
    { href: "/ogrenci/panel/talepler", icon: ClipboardListIcon, label: "Ders Taleplerim", pageId: "student-requests" },
    { href: "/ogrenci/panel/favoriler", icon: HeartIcon, label: "Favoriler", pageId: "student-favorites" },
    { href: "/ogrenci/panel/profil", icon: UserIcon, label: "Profil", pageId: "student-profile" },
  ],
};

export const studentDashboardPages: Record<string, DashboardPageContent> = {
  "student-home": {
    id: "student-home",
    eyebrow: "Öğrenci Paneli",
    title: "Hoş geldin!",
    description: "Sol menüden ders taleplerini, favori öğretmenlerini ve profil bilgilerini yönetebilirsin.",
    ctaHref: "/ogretmen-bul",
    ctaLabel: "Öğretmen Bul",
  },
  "student-requests": {
    id: "student-requests",
    eyebrow: "Ders Taleplerim",
    title: "Ders Taleplerim",
    description: "Gönderdiğin ders taleplerini ve durumlarını buradan takip edebilirsin.",
  },
  "student-favorites": {
    id: "student-favorites",
    eyebrow: "Favoriler",
    title: "Favoriler",
    description: "Kaydettiğin öğretmenleri buradan takip edebilirsin.",
  },
  "student-profile": {
    id: "student-profile",
    eyebrow: "Profil",
    title: "Profilim",
    description: "Ad, telefon ve hesap bilgilerini buradan düzenleyebilirsin.",
  },
};
