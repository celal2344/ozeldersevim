import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  Clock3Icon,
  GraduationCapIcon,
  SearchIcon,
  ShieldCheckIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

export type HeroFeature = {
  label: string;
  icon: LucideIcon;
};

export type PlatformBenefit = {
  title: string;
  text: string;
  icon: LucideIcon;
};

export type HeroSignal = {
  text: string;
  icon: LucideIcon;
};

export type HomepageStep = {
  num: string;
  title: string;
  text: string;
  color: string;
};

export const heroFeatures: HeroFeature[] = [
  { label: "Esnek Ders Saatleri", icon: CalendarDaysIcon },
  { label: "Birebir Destek", icon: UsersIcon },
  { label: "Güvenli Altyapı", icon: ShieldCheckIcon },
  { label: "Konuma Göre Arama", icon: SearchIcon },
];

export const platformBenefits: PlatformBenefit[] = [
  { title: "Esnek Ders Saatleri", text: "Dilediğin zaman planla", icon: Clock3Icon },
  { title: "Doğrudan İletişim", text: "Öğretmeninle birebir çalış", icon: UsersIcon },
  { title: "Güvenli Platform", text: "İletişim bilgilerin korumalı", icon: ShieldCheckIcon },
  { title: "İlan Yayınlama", text: "Öğretmenler testten sonra ilan açar", icon: GraduationCapIcon },
  { title: "Kolay Takip", text: "Taleplerinizi panelden izleyin", icon: CheckCircle2Icon },
];

export const homepageHeroSignals: HeroSignal[] = [
  { icon: ArrowRightIcon, text: "Ücretsiz kayıt" },
  { icon: ShieldCheckIcon, text: "Güvenli iletişim" },
  { icon: GraduationCapIcon, text: "Öğretmenlik testi" },
  { icon: CheckCircle2Icon, text: "Doğrulanmış akış" },
];

export const homepageSteps: HomepageStep[] = [
  {
    num: "01",
    title: "Öğretmen Bul",
    text: "Ders, konum ve puana göre filtrele. Profilini incele.",
    color: "from-brand-orange to-orange-500",
  },
  {
    num: "02",
    title: "Talep Gönder",
    text: "Ücretsiz kayıt ol, öğretmene ders talebi gönder.",
    color: "from-violet-600 to-purple-600",
  },
  {
    num: "03",
    title: "Derse Başla",
    text: "Öğretmen kabul edince seni arar. Programı birlikte planlayın.",
    color: "from-emerald-500 to-teal-600",
  },
];

export const homepageTeacherCardGradients = [
  "from-violet-500 to-purple-700",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
];
