import { ChevronRightIcon, GraduationCapIcon, MonitorPlayIcon, SearchIcon, ShieldCheckIcon, StarIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

import { heroFeatures, platformBenefits } from "@/features/homepage/constants";
import { getHomepageMarketplaceData } from "@/features/homepage/service";
import { homepageLessonIcon, initialsFromName, lessonSearchHref } from "@/features/homepage/utils";
import { teacherDeliveryLabels } from "@/features/search/constants";
import { reviewLabel } from "@/features/search/utils";
import { Button } from "@/shared/components/ui/button";

export default async function HomePage() {
  const { lessons, teachers } = await getHomepageMarketplaceData();

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
                Online ve yüz yüze
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheckIcon aria-hidden="true" className="text-brand-orange" />
                Kontrollü iletişim
              </span>
              <span className="inline-flex items-center gap-2">
                <GraduationCapIcon aria-hidden="true" className="text-brand-orange" />
                Testten geçmiş ilanlar
              </span>
            </div>
            <div className="flex flex-col gap-5">
              <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-balance sm:text-6xl">
                Türkiye&apos;nin Yeni Nesil <span className="text-brand-orange">Özel Ders</span> Platformu
              </h1>
              <p className="max-w-xl text-lg leading-8 text-white/78">
                Ders, konum ve ders türüne göre öğretmen ara. Beğendiğin öğretmene ders talebi gönder.
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
                render={<Link href="/ogretmen-ol" />}
              >
                <UsersIcon data-icon="inline-start" aria-hidden="true" />
                Öğretmen Ol
              </Button>
            </div>
            <div className="grid gap-5 text-sm text-white/80 sm:grid-cols-2 lg:grid-cols-4">
              {heroFeatures.map(({ label, icon: Icon }) => (
                <span key={label} className="inline-flex items-center gap-2">
                  <Icon aria-hidden="true" className="text-brand-orange" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/12 bg-white/8 p-5 shadow-2xl backdrop-blur">
              <div className="rounded-[1.4rem] border border-white/10 bg-brand-navy-muted p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-white/55">Ders talebi akışı</p>
                    <p className="mt-1 text-2xl font-semibold">Öğretmenini seç, talebini gönder</p>
                  </div>
                  <span className="flex size-12 items-center justify-center rounded-xl bg-brand-orange text-white">
                    <SearchIcon aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-6 grid gap-3">
                  {["Ders ve konum filtrele", "Öğretmen profilini incele", "Talep formunu gönder", "Kabul sonrası iletişim paylaşılır"].map((step, index) => (
                    <div key={step} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 p-4">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-brand-orange text-sm font-semibold text-white">
                        {index + 1}
                      </span>
                      <span className="text-sm text-white/78">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
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
              <option value="">Tüm dersler</option>
              {lessons.map((lesson) => (
                <option key={lesson} value={lesson.toLocaleLowerCase("tr-TR")}>
                  {lesson}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-brand-navy">
            Seviye
            <select name="q" className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-muted-foreground">
              <option value="">Tüm seviyeler</option>
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

      {lessons.length > 0 ? (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-brand-navy">Ders Kategorileri</h2>
                <div className="mt-3 h-1 w-16 rounded-full bg-brand-orange" />
              </div>
              <Link href="/ogretmen-bul" className="text-sm font-medium text-brand-navy hover:text-brand-orange">
                Tüm dersleri gör
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {lessons.map((name, index) => {
                const Icon = homepageLessonIcon(name);

                return (
                  <Link
                    key={name}
                    href={lessonSearchHref(name)}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
                  >
                    <span
                      className={
                        index % 2 === 0
                          ? "flex size-14 items-center justify-center rounded-xl bg-brand-orange text-white"
                          : "flex size-14 items-center justify-center rounded-xl bg-brand-navy text-white"
                      }
                    >
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="mt-4 block font-semibold text-brand-navy">{name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {teachers.length > 0 ? (
        <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-brand-navy">Öne Çıkan Öğretmenler</h2>
                <p className="mt-2 text-muted-foreground">Yayında olan öğretmen ilanlarından alınır.</p>
              </div>
              <Link href="/ogretmen-bul" className="hidden text-sm font-medium text-brand-navy hover:text-brand-orange sm:block">
                Tüm öğretmenleri gör
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="rounded-2xl bg-brand-navy p-5 text-white shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex size-14 items-center justify-center rounded-full bg-white/10 font-semibold">
                      {initialsFromName(teacher.fullName)}
                    </div>
                    <div>
                      <p className="font-semibold">{teacher.fullName}</p>
                      <p className="text-sm text-white/58">{teacher.headline}</p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1 text-sm text-brand-orange">
                      <StarIcon aria-hidden="true" />
                      {reviewLabel(teacher)}
                    </span>
                    <span className="font-semibold">₺{teacher.hourlyPrice}</span>
                  </div>
                  <p className="mt-2 text-xs text-white/55">{teacherDeliveryLabels[teacher.deliveryMode]}</p>
                  <Button
                    variant="outline"
                    className="mt-5 w-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    nativeButton={false}
                    render={<Link href={`/ogretmen/${teacher.slug}`} />}
                  >
                    Profili Gör
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-brand-navy px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-5">
          {platformBenefits.map(({ title, text, icon: Icon }) => (
            <div key={title} className="flex items-center gap-3">
              <Icon aria-hidden="true" className="text-brand-orange" />
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-white/58">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
