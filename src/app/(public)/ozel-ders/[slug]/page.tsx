import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, BookOpenIcon, GraduationCapIcon, MapPinIcon, SearchIcon, StarIcon, UsersIcon } from "lucide-react";

import { homepageTeacherCardGradients } from "@/features/homepage/constants";
import { teacherDeliveryLabels } from "@/features/search/constants";
import { searchTeachers } from "@/features/search/search-service";
import { initialsFromTeacherName, reviewLabel } from "@/features/search/utils";
import { getLessonPage } from "@/features/seo/lesson-pages";
import { absoluteUrl } from "@/features/seo/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLessonPage(slug);
  if (!lesson) return { title: "Sayfa Bulunamadı" };
  return {
    title: lesson.title,
    description: lesson.description,
    keywords: lesson.keywords,
    alternates: { canonical: `/ozel-ders/${slug}` },
    openGraph: { title: `${lesson.title} | Özel Ders Evim`, description: lesson.description, url: absoluteUrl(`/ozel-ders/${slug}`) },
  };
}

export default async function LessonLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const lesson = getLessonPage(slug);
  if (!lesson) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Özel Ders", item: absoluteUrl("/ogretmen-bul") },
      { "@type": "ListItem", position: 3, name: lesson.name, item: absoluteUrl(`/ozel-ders/${slug}`) },
    ],
  };
  const { data: teachers } = await searchTeachers({ lesson: lesson.name.toLocaleLowerCase("tr-TR"), pageSize: 4 });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden bg-[#0a0f1e] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(251,115,22,0.22),transparent)]" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-sm text-white/80 backdrop-blur">
            <BookOpenIcon className="size-3.5 text-brand-orange" aria-hidden="true" />
            {lesson.name} Özel Ders
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {lesson.title}{" "}
            <span className="bg-gradient-to-r from-brand-orange to-orange-300 bg-clip-text text-transparent">Öğretmeni Bul</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-7 text-white/60">{lesson.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={`/ogretmen-bul?lesson=${slug}`}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-orange px-6 text-sm font-bold text-white shadow-lg shadow-orange-900/30 transition-all hover:scale-[1.02] hover:bg-orange-400"
            >
              <SearchIcon className="size-4" aria-hidden="true" />
              Tüm Öğretmenleri Gör
            </Link>
            <Link
              href="/kayit"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-6 text-sm font-bold text-white backdrop-blur transition-all hover:bg-white/15"
            >
              Ücretsiz Kayıt Ol
            </Link>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#f8f9fe] to-transparent" />
      </section>

      {teachers.length > 0 ? (
        <section className="px-4 py-14 sm:px-6" style={{ background: "linear-gradient(180deg,#f8f9fe 0%,#f0f4ff 100%)" }}>
          <div className="mx-auto max-w-5xl">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Öğretmenler</p>
              <h2 className="mt-1 text-2xl font-extrabold text-brand-navy">{lesson.name} Öğretmenleri</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {teachers.map((teacher, index) => (
                <div
                  key={teacher.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
                >
                  <div className="flex items-center gap-4 p-5">
                    <div
                      className={`flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${
                        homepageTeacherCardGradients[index % homepageTeacherCardGradients.length]
                      } text-sm font-extrabold text-white shadow-lg`}
                    >
                      {initialsFromTeacherName(teacher.fullName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-brand-navy transition-colors group-hover:text-brand-orange">{teacher.fullName}</p>
                      <p className="truncate text-xs text-muted-foreground">{teacher.headline}</p>
                      <div className="mt-1 flex items-center gap-1">
                        <StarIcon className="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                        <span className="text-xs font-medium text-muted-foreground">{reviewLabel(teacher)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-extrabold text-brand-orange">₺{teacher.hourlyPrice}</p>
                      <p className="text-xs text-muted-foreground">/saat</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 px-5 pb-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="size-3 text-brand-orange" aria-hidden="true" />
                      {teacher.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <GraduationCapIcon className="size-3 text-brand-orange" aria-hidden="true" />
                      {teacher.experienceYears} yıl
                    </span>
                    <span>{teacherDeliveryLabels[teacher.deliveryMode]}</span>
                    {teacher.activeStudents ? (
                      <span className="flex items-center gap-1">
                        <UsersIcon className="size-3 text-brand-orange" aria-hidden="true" />
                        {teacher.activeStudents} öğrenci
                      </span>
                    ) : null}
                  </div>
                  <div className="flex gap-2 border-t border-slate-100 bg-slate-50/50 p-4">
                    <Link
                      href={`/ders-talebi?teacher=${teacher.slug}`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-orange py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-orange-400"
                    >
                      Hızlı Talep Oluştur
                    </Link>
                    <Link
                      href={`/ogretmen/${teacher.slug}`}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-brand-navy transition-colors hover:bg-slate-50"
                    >
                      Profili Gör
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href={`/ogretmen-bul?lesson=${slug}`}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-navy/20 transition-all hover:scale-[1.02] hover:bg-brand-navy/90"
              >
                Tüm {lesson.name} Öğretmenlerini Gör <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="px-4 py-14 sm:px-6" style={{ background: "linear-gradient(180deg,#f0f4ff 0%,#e8eeff 100%)" }}>
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-white bg-white p-7 shadow-sm">
                <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-brand-navy">
                  <span className="h-5 w-1 rounded-full bg-brand-orange" />
                  {lesson.name} Özel Dersi Neden Önemli?
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{lesson.intro}</p>
              </div>
              <div className="rounded-2xl border border-white bg-white p-7 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-brand-navy">
                  <span className="h-5 w-1 rounded-full bg-violet-500" />
                  Online veya Yüz Yüze
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="font-semibold text-brand-navy">Online Ders</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Türkiye&apos;nin her yerinden öğretmenlerle bağlanın. Kendi ortamınızda ders alın.
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="font-semibold text-brand-navy">Yüz Yüze Ders</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Şehrinizdeki öğretmenlerle daha yüksek etkileşimli dersler alın.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <aside className="flex flex-col gap-5">
              <div className="overflow-hidden rounded-2xl bg-[#0a0f1e] shadow-xl shadow-black/20">
                <div className="border-b border-white/8 px-6 py-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Nasıl Çalışır?</p>
                </div>
                <div className="px-6 py-5">
                  <div className="flex flex-col gap-4">
                    {["Öğretmen profillerini incele.", "Ders talebi gönder.", "Öğretmen kabul edince seni arar.", "Ders programınızı birlikte planlayın."].map(
                      (step, index) => (
                        <div key={step} className="flex items-start gap-3 text-sm text-white/65">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-white">
                            {index + 1}
                          </span>
                          {step}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
              <Link
                href={`/ogretmen-bul?lesson=${slug}`}
                className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-brand-orange text-sm font-bold text-white shadow-lg shadow-orange-200 transition-all hover:scale-[1.01] hover:bg-orange-400"
              >
                <MapPinIcon className="size-4" aria-hidden="true" />
                {lesson.name} Öğretmeni Ara
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
