import Link from "next/link";
import {
  AtomIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
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
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";

const popularLessons = [
  { name: "Matematik", count: "1.200+ öğretmen", icon: BookOpenIcon, tone: "orange" },
  { name: "Fizik", count: "780+ öğretmen", icon: AtomIcon, tone: "navy" },
  { name: "Kimya", count: "620+ öğretmen", icon: FlaskConicalIcon, tone: "orange" },
  { name: "İngilizce", count: "1.500+ öğretmen", icon: LanguagesIcon, tone: "navy" },
  { name: "Yazılım", count: "850+ öğretmen", icon: Code2Icon, tone: "orange" },
  { name: "TYT / AYT", count: "1.100+ öğretmen", icon: GraduationCapIcon, tone: "navy" },
];

const stats = [
  { label: "Mutlu Öğrenci", value: "10.000+", icon: UsersIcon },
  { label: "Uzman Öğretmen", value: "1.500+", icon: GraduationCapIcon },
  { label: "Tamamlanan Ders", value: "25.000+", icon: MonitorPlayIcon },
  { label: "Öğrenci Memnuniyeti", value: "4.9/5", icon: StarIcon },
];

const featuredTeachers = [
  ["Mehmet Yılmaz", "Matematik Öğretmeni", "₺450 / saat", "4.9"],
  ["Ayşe Demir", "İngilizce Öğretmeni", "₺400 / saat", "4.8"],
  ["Emre Kaya", "Fizik Öğretmeni", "₺500 / saat", "4.9"],
  ["Zeynep Acar", "Yazılım Öğretmeni", "₺550 / saat", "4.9"],
];

export default function HomePage() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(251,115,22,0.32),transparent_31%),radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.08),transparent_24%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/25 to-transparent" />
        <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap gap-5 text-sm text-white/78">
              <span className="inline-flex items-center gap-2">
                <MonitorPlayIcon aria-hidden="true" className="text-brand-orange" />
                Canlı Ders
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheckIcon aria-hidden="true" className="text-brand-orange" />
                Güvenli İletişim
              </span>
              <span className="inline-flex items-center gap-2">
                <GraduationCapIcon aria-hidden="true" className="text-brand-orange" />
                Uzman Öğretmenler
              </span>
            </div>
            <div className="flex flex-col gap-5">
              <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-balance sm:text-6xl">
                Türkiye&apos;nin Yeni Nesil{" "}
                <span className="text-brand-orange">Online Özel Ders</span>{" "}
                Platformu
              </h1>
              <p className="max-w-xl text-lg leading-8 text-white/78">
                Uzman öğretmenlerle birebir online veya yüz yüze ders al,
                hedeflerine daha kolay ulaş.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-11 bg-brand-orange px-7 text-white shadow-lg shadow-orange-950/25 hover:bg-brand-orange/90"
                nativeButton={false}
                render={<Link href="/ogretmen-bul" />}
              >
                Ders Bul
                <ChevronRightIcon data-icon="inline-end" aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 border-white/35 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white"
                nativeButton={false}
                render={<Link href="/kayit" />}
              >
                <UsersIcon data-icon="inline-start" aria-hidden="true" />
                Öğretmen Ol
              </Button>
            </div>
            <div className="grid gap-5 text-sm text-white/80 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Esnek Ders Saatleri", CalendarDaysIcon],
                ["Birebir İletişim", UsersIcon],
                ["Güvenli Altyapı", ShieldCheckIcon],
                ["Konumlu Arama", SearchIcon],
              ].map(([label, Icon]) => (
                <span key={label as string} className="inline-flex items-center gap-2">
                  <Icon aria-hidden="true" className="text-brand-orange" />
                  {label as string}
                </span>
              ))}
            </div>
          </div>

          <div className="relative min-h-[430px]">
            <div className="absolute right-4 top-0 w-[78%] rounded-[2rem] border border-white/12 bg-white/8 p-4 shadow-2xl backdrop-blur md:right-0">
              <div className="rounded-[1.4rem] border border-white/10 bg-brand-navy-muted p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/55">Bugünkü Ders</p>
                    <p className="text-2xl font-semibold">Matematik</p>
                  </div>
                  <span className="rounded-lg bg-brand-orange px-3 py-2 text-sm font-semibold">
                    19:00
                  </span>
                </div>
                <div className="mt-6 grid gap-3">
                  <div className="rounded-lg border border-white/10 bg-white/10 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/65">Öğretmen</span>
                      <span className="font-medium">Ayşe Demir</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white/10">
                      <div className="h-2 w-3/4 rounded-full bg-brand-orange" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-white/10 bg-white/10 p-4">
                      <StarIcon aria-hidden="true" className="text-brand-orange" />
                      <p className="mt-3 text-2xl font-semibold">4.9</p>
                      <p className="text-xs text-white/55">Puan</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/10 p-4">
                      <UsersIcon aria-hidden="true" className="text-brand-orange" />
                      <p className="mt-3 text-2xl font-semibold">12K+</p>
                      <p className="text-xs text-white/55">Öğrenci</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute left-0 top-24 w-64 rounded-2xl bg-white p-4 text-brand-navy shadow-2xl">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-brand-orange text-white">
                  <MonitorPlayIcon aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Canlı Ders</p>
                  <p className="text-xs text-muted-foreground">Matematik · 10:00 - 11:30</p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-6 left-10 w-56 rounded-2xl border border-white/15 bg-brand-navy-muted p-4 text-white shadow-2xl">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-white/10">
                  <Clock3Icon aria-hidden="true" className="text-brand-orange" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Bir Sonraki Ders</p>
                  <p className="text-xs text-white/55">Fizik · 14:00 - 15:30</p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 right-6 flex size-24 items-center justify-center rounded-full bg-brand-orange text-white shadow-2xl shadow-orange-950/25">
              <GraduationCapIcon aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-12 px-4 sm:px-6 lg:px-8">
        <form
          action="/ogretmen-bul"
          className="mx-auto grid max-w-6xl gap-4 rounded-2xl bg-white p-5 shadow-2xl shadow-slate-950/15 ring-1 ring-slate-200 md:grid-cols-[1fr_1fr_1fr_auto]"
        >
          <label className="flex flex-col gap-2 text-sm font-medium text-brand-navy">
            Ders Seçin
            <select name="lesson" className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-muted-foreground">
              <option value="">Ders seçiniz</option>
              <option value="matematik">Matematik</option>
              <option value="fizik">Fizik</option>
              <option value="ingilizce">İngilizce</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-brand-navy">
            Seviye
            <select name="q" className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-muted-foreground">
              <option value="">Seviye seçiniz</option>
              <option value="lgs">LGS</option>
              <option value="tyt">TYT / AYT</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-brand-navy">
            Ders Türü
            <select name="deliveryMode" className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-muted-foreground">
              <option value="all">Tümü</option>
              <option value="online">Online</option>
              <option value="face_to_face">Yüz yüze</option>
            </select>
          </label>
          <Button className="self-end bg-brand-orange text-white hover:bg-brand-orange/90">
            <SearchIcon data-icon="inline-start" aria-hidden="true" />
            Öğretmen Ara
          </Button>
        </form>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-brand-navy">
                Popüler Dersler
              </h2>
              <div className="mt-3 h-1 w-16 rounded-full bg-brand-orange" />
            </div>
            <Link href="/ogretmen-bul" className="text-sm font-medium text-brand-navy hover:text-brand-orange">
              Tüm dersleri gör
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {popularLessons.map(({ name, count, icon: Icon, tone }) => (
              <Link
                key={name}
                href={`/ogretmen-bul?lesson=${encodeURIComponent(name.toLocaleLowerCase("tr-TR"))}`}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                <span
                  className={
                    tone === "orange"
                      ? "flex size-14 items-center justify-center rounded-xl bg-brand-orange text-white"
                      : "flex size-14 items-center justify-center rounded-xl bg-brand-navy text-white"
                  }
                >
                  <Icon aria-hidden="true" />
                </span>
                <span className="mt-4 block font-semibold text-brand-navy">{name}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 rounded-2xl bg-brand-navy p-7 text-white md:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-4">
              <Icon aria-hidden="true" className="text-brand-orange" />
              <div>
                <p className="text-3xl font-bold text-brand-orange">{value}</p>
                <p className="text-sm text-white/70">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-brand-navy">
                Öne Çıkan Öğretmenler
              </h2>
              <p className="mt-2 text-muted-foreground">
                Referans tasarımdaki koyu kart yapısı HTML/CSS ile yeniden kuruldu.
              </p>
            </div>
            <Link href="/ogretmen-bul" className="hidden text-sm font-medium text-brand-navy hover:text-brand-orange sm:block">
              Tüm öğretmenleri gör
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featuredTeachers.map(([name, title, price, rating]) => (
              <div key={name} className="rounded-2xl bg-brand-navy p-5 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex size-14 items-center justify-center rounded-full bg-white/10 font-semibold">
                    {name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-white/58">{title}</p>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-sm text-brand-orange">
                    <StarIcon aria-hidden="true" />
                    {rating}
                  </span>
                  <span className="font-semibold">{price}</span>
                </div>
                <Button
                  variant="outline"
                  className="mt-5 w-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  nativeButton={false}
                  render={<Link href="/ogretmen-bul" />}
                >
                  Profili Gör
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-navy px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">
          {[
            ["Esnek Ders Saatleri", "Dilediğin zaman planla", Clock3Icon],
            ["Birebir İletişim", "Öğretmeninle net akış", UsersIcon],
            ["Güvenli Altyapı", "Kontrollü başvuru süreci", ShieldCheckIcon],
            ["Raporlama Sistemi", "Gelişimi takip et", CheckCircle2Icon],
          ].map(([title, text, Icon]) => (
            <div key={title as string} className="flex items-center gap-3">
              <Icon aria-hidden="true" className="text-brand-orange" />
              <div>
                <p className="font-semibold">{title as string}</p>
                <p className="text-sm text-white/58">{text as string}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
