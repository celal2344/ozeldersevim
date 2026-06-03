import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpenIcon, MapPinIcon, SearchIcon } from "lucide-react";

import { getLessonPage, lessonPageSlugs } from "@/features/seo/lesson-pages";
import { absoluteUrl } from "@/features/seo/site";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

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
    alternates: {
      canonical: `/ozel-ders/${slug}`,
    },
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
              Öğretmen Bul
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

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
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
              <CardContent className="flex flex-col gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="font-medium text-brand-navy">Online Ders</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Türkiye'nin her yerinden öğretmenlerle bağlanın. Kendi ortamınızda, kendi zamanınızda ders alın.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="font-medium text-brand-navy">Yüz Yüze Ders</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Şehrinizdeki öğretmenlerle fiziksel ortamda, daha yüksek etkileşimli dersler alın.
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
                {[
                  "Öğretmen profillerini incele.",
                  "Ders talebi gönder.",
                  "Öğretmen kabul edince iletişime geç.",
                  "Dersinizi planlayın.",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-white">
                      {i + 1}
                    </span>
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
                  Türkiye'nin dört bir yanından {lesson.name.toLowerCase()} öğretmenlerini keşfet.
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
      </section>
    </>
  );
}
