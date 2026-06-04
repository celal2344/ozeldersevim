import {
  ClipboardCheckIcon,
  GraduationCapIcon,
  ListChecksIcon,
  MessageSquareTextIcon,
  SettingsIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";

import type { DashboardPageContent, DashboardRoleConfig } from "@/features/dashboard/types";

export const teacherDashboardConfig: DashboardRoleConfig = {
  role: "teacher",
  label: "Öğretmen Paneli",
  homeHref: "/",
  navItems: [
    { href: "/ogretmen/panel", icon: GraduationCapIcon, label: "Genel Bakış", pageId: "teacher-home" },
    { href: "/ogretmen/panel/talepler", icon: ClipboardCheckIcon, label: "Ders Talepleri", pageId: "teacher-requests" },
    { href: "/ogretmen/panel/ilan", icon: ListChecksIcon, label: "İlanım", pageId: "teacher-listing" },
    { href: "/ogretmen/panel/ogrenciler", icon: UserIcon, label: "Öğrenciler", pageId: "teacher-students" },
    { href: "/ogretmen/panel/yorumlar", icon: StarIcon, label: "Yorumlar", pageId: "teacher-reviews" },
    { href: "/ogretmen/panel/profil", icon: MessageSquareTextIcon, label: "Profil", pageId: "teacher-profile" },
    { href: "/ogretmen/panel/ayarlar", icon: SettingsIcon, label: "Ayarlar", pageId: "teacher-settings" },
  ],
};

export const teacherDashboardPages: Record<string, DashboardPageContent> = {
  "teacher-home": {
    id: "teacher-home",
    eyebrow: "Öğretmen Paneli",
    title: "Hoş geldin!",
    description: "Sol menüden ders taleplerini, ilanını, öğrencilerini ve yorumlarını yönetebilirsin.",
    ctaHref: "/ogretmen/panel/talepler",
    ctaLabel: "Ders Taleplerine Git",
  },
  "teacher-requests": {
    id: "teacher-requests",
    eyebrow: "Ders Talepleri",
    title: "Ders Talepleri",
    description: "Öğrencilerden gelen ders taleplerini yönet, kabul et veya reddet.",
  },
  "teacher-listing": {
    id: "teacher-listing",
    eyebrow: "İlanım",
    title: "İlanım",
    description: "Öğretmenlik testini geçtikten sonra ilan oluşturabilir ve yayına alabilirsin.",
    ctaHref: "/ogretmen/panel/profil",
    ctaLabel: "Profil Bilgilerini Düzenle",
  },
  "teacher-students": {
    id: "teacher-students",
    eyebrow: "Öğrenciler",
    title: "Öğrenciler",
    description: "Kabul ettiğin ders taleplerinden oluşan öğrencilerin burada listelenir.",
    ctaHref: "/ogretmen/panel/talepler",
    ctaLabel: "Taleplere Git",
  },
  "teacher-reviews": {
    id: "teacher-reviews",
    eyebrow: "Yorumlar",
    title: "Yorumlar",
    description: "Öğrencilerden gelen yorumları ve puanları buradan görebilirsin.",
  },
  "teacher-profile": {
    id: "teacher-profile",
    eyebrow: "Profil",
    title: "Profilim",
    description: "İlan başlığı, açıklama, fiyat ve ders türü bilgilerini buradan düzenleyebilirsin.",
  },
  "teacher-settings": {
    id: "teacher-settings",
    eyebrow: "Hesap Ayarları",
    title: "Hesap Ayarları",
    description: "Ad, telefon ve hesap bilgilerini buradan düzenleyebilirsin.",
  },
};
