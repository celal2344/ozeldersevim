import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpenIcon, MapPinIcon, SearchIcon, StarIcon, UsersIcon, GraduationCapIcon } from "lucide-react";

import { getLessonPage, lessonPageSlugs } from "@/features/seo/lesson-pages";
import { absoluteUrl } from "@/features/seo/site";
import { searchTeachers } from "@/features/search/search-service";
import { teacherDeliveryLabels } from "@/features/search/constants";
import { initialsFromTeacherName, reviewLabel } from "@/features/search/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return lessonPageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLessonPage(slug);

  if (!lesson) return { title: "Sayfa Bulunamadı" };

  return {
    title: lesson.title,
    description: lesson.description,
    keywords: lesson.keywords,
    alternates: { canonical: `/ozel-ders/${slug}` },
    openGraph: {
      title: `${lesson.title} | Özel Ders Evim`,
      description: lesson.description,
      url: absoluteUrl(`/ozel-ders/${slug}`),
    },
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

  const { data: teachers } = searchTeachers({
    lesson: lesson.name.toLocaleLowerCase("tr-TR"),
    pageSize: 4,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-brand-navy text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <div className="mb-4 flex justify-center">
            <Badge className="bg-brand-orange/20 text-brand-orange text-sm px-3 py-1">
              <BookOpenIcon className="size-3.5 mr-1" aria-hidden="true" />
              {lesson.name} Özel Ders
            </Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {lesson.title} Öğretmeni Bul
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-7 text-white/75">
            {lesson.description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="h-11 bg-brand-orange text-white hover:bg-brand-orange/90"
              nativeButton={false}
              render={<Link href={`/ogretmen-bul?lesson=${slug}`} />}
            >
              <SearchIcon data-icon="inline-start" aria-hidden="true" />
              Tüm Öğretmenleri Gör
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              nativeButton={false}
              render={<Link href="/kayit" />}
            >
              Ücretsiz Kayıt Ol
            </Button>
          </div>
        </div>
      </section>

      {teachers.length > 0 && (
        <section className="bg-white px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-2xl font-bold text-brand-navy">
              {lesson.name} Öğretmenleri
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {teachers.map((teacher) => (
                <Card key={teacher.id} className="overflow-hidden ring-1 ring-slate-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
                        {initialsFromTeacherName(teacher.fullName)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-brand-navy truncate">{teacher.fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">{teacher.headline}</p>
                        <div className="mt-0.5 flex items-center gap-1">
                          <StarIcon className="size-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                          <span className="text-xs text-muted-foreground">{reviewLabel(teacher)}</span>
                        </div>
                      </div>
                      <p className="ml-auto text-base font-bold text-brand-orange shrink-0">
                        ₺{teacher.hourlyPrice}<span className="text-xs font-normal text-muted-foreground">/saat</span>
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3 pt-0">
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
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
                  </CardContent>
                  <CardFooter className="gap-2 border-t bg-slate-50/60 pt-3">
                    <Button
                      size="sm"
                      className="flex-1 bg-brand-orange text-white hover:bg-brand-orange/90"
                      nativeButton={false}
                      render={<Link href={`/ders-talebi?teacher=${teacher.slug}`} />}
                    >
                      Hızlı Talep Oluştur
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      nativeButton={false}
                      render={<Link href={`/ogretmen/${teacher.slug}`} />}
                    >
                      Profili Gör
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                className="border-brand-navy/20 text-brand-navy hover:bg-brand-navy hover:text-white"
                nativeButton={false}
                render={<Link href={`/ogretmen-bul?lesson=${slug}`} />}
              >
                Tüm {lesson.name} Öğretmenlerini Gör
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="bg-slate-50 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{lesson.name} Özel Dersi Neden Önemli?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-muted-foreground">{lesson.intro}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Online veya Yüz Yüze Ders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="font-medium text-brand-navy">Online Ders</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Türkiye'nin her yerinden öğretmenlerle bağlanın. Kendi ortamınızda ders alın.
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="font-medium text-brand-navy">Yüz Yüze Ders</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Şehrinizdeki öğretmenlerle daha yüksek etkileşimli dersler alın.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <aside className="flex flex-col gap-4">
              <Card className="bg-brand-navy text-white">
                <CardHeader>
                  <CardTitle className="text-white">Nasıl Çalışır?</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm text-white/75">
                  {["Öğretmen profillerini incele.", "Ders talebi gönder.", "Öğretmen kabul edince iletişime geç.", "Dersinizi planlayın."].map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-white">{i + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Hemen Başla</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">
                    {lesson.name.toLowerCase()} öğretmenlerini keşfet ve ders talebi gönder.
                  </p>
                  <Button
                    className="bg-brand-orange text-white hover:bg-brand-orange/90"
                    nativeButton={false}
                    render={<Link href={`/ogretmen-bul?lesson=${slug}`} />}
                  >
                    <MapPinIcon data-icon="inline-start" aria-hidden="true" />
                    {lesson.name} Öğretmeni Ara
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
