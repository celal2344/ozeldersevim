import {
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

export const heroFeatures: HeroFeature[] = [
  { label: "Esnek Ders Saatleri", icon: CalendarDaysIcon },
  { label: "Birebir İletişim", icon: UsersIcon },
  { label: "Güvenli Altyapı", icon: ShieldCheckIcon },
  { label: "Konumlu Arama", icon: SearchIcon },
];

export const platformBenefits: PlatformBenefit[] = [
  { title: "Esnek Ders Saatleri", text: "Dilediğin zaman planla", icon: Clock3Icon },
  { title: "Birebir İletişim", text: "Öğretmeninle net akış", icon: UsersIcon },
  { title: "Güvenli Altyapı", text: "Kontrollü başvuru süreci", icon: ShieldCheckIcon },
  { title: "İlan Yayınlama", text: "Öğretmenler testten sonra ilan açar", icon: GraduationCapIcon },
  { title: "Takip Edilebilir Akış", text: "Talepler panelden yönetilir", icon: CheckCircle2Icon },
];
