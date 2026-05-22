import {
  AtomIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  Clock3Icon,
  Code2Icon,
  FlaskConicalIcon,
  GraduationCapIcon,
  LanguagesIcon,
  MonitorPlayIcon,
  SearchIcon,
  ShieldCheckIcon,
  StarIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

export type HomepageLesson = {
  name: string;
  count: string;
  icon: LucideIcon;
  tone: "orange" | "navy";
};

export type HomepageStat = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export type FeaturedTeacherPreview = {
  name: string;
  title: string;
  price: string;
  rating: string;
  slug: string;
};

export type HeroFeature = {
  label: string;
  icon: LucideIcon;
};

export type PlatformBenefit = {
  title: string;
  text: string;
  icon: LucideIcon;
};

export const popularHomepageLessons: HomepageLesson[] = [
  { name: "Matematik", count: "1.200+ öğretmen", icon: BookOpenIcon, tone: "orange" },
  { name: "Fizik", count: "780+ öğretmen", icon: AtomIcon, tone: "navy" },
  { name: "Kimya", count: "620+ öğretmen", icon: FlaskConicalIcon, tone: "orange" },
  { name: "İngilizce", count: "1.500+ öğretmen", icon: LanguagesIcon, tone: "navy" },
  { name: "Yazılım", count: "850+ öğretmen", icon: Code2Icon, tone: "orange" },
  { name: "TYT / AYT", count: "1.100+ öğretmen", icon: GraduationCapIcon, tone: "navy" },
];

export const homepageStats: HomepageStat[] = [
  { label: "Mutlu Öğrenci", value: "10.000+", icon: UsersIcon },
  { label: "Uzman Öğretmen", value: "1.500+", icon: GraduationCapIcon },
  { label: "Tamamlanan Ders", value: "25.000+", icon: MonitorPlayIcon },
  { label: "Öğrenci Memnuniyeti", value: "4.9/5", icon: StarIcon },
];

export const featuredTeacherPreviews: FeaturedTeacherPreview[] = [
  {
    name: "Ayşe Demir",
    title: "Matematik Öğretmeni",
    price: "₺650 / saat",
    rating: "4.9",
    slug: "ayse-demir-matematik-erzurum",
  },
  {
    name: "Mehmet Yılmaz",
    title: "Fizik Öğretmeni",
    price: "₺900 / saat",
    rating: "Yeni",
    slug: "mehmet-yilmaz-fizik-online",
  },
  {
    name: "Zeynep Acar",
    title: "İngilizce Öğretmeni",
    price: "₺450 / saat",
    rating: "4.6",
    slug: "zeynep-acar-ingilizce-erzurum",
  },
  {
    name: "Deniz Kara",
    title: "Yazılım Eğitmeni",
    price: "₺1200 / saat",
    rating: "5.0",
    slug: "deniz-kara-yazilim-ankara",
  },
];

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
  { title: "Raporlama Sistemi", text: "Gelişimi takip et", icon: CheckCircle2Icon },
];
