import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ClockIcon, TagIcon } from "lucide-react";

import { blogPosts } from "@/features/blog/constants";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Yazı Bulunamadı" };
  return {
    title: `${post.title} | Özel Ders Evim Blog`,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  return (
    <main className="bg-slate-50">
      <section className="bg-brand-navy px-4 py-12 text-white sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white">
            <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
            Blog
          </Link>
          <Badge variant="secondary" className="mt-4 text-xs">
            <TagIcon className="mr-1 size-3" aria-hidden="true" />
            {post.category}
          </Badge>
          <h1 className="mt-3 text-3xl font-bold leading-snug text-balance sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/60">
            <span>{post.author}</span>
            <span>{formatDate(post.date)}</span>
            <span className="flex items-center gap-1">
              <ClockIcon className="size-3.5" aria-hidden="true" />
              {post.readingMinutes} dk okuma
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-lg font-medium leading-7 text-brand-navy">{post.summary}</p>
          <p className="mt-6 text-sm leading-7 text-muted-foreground">
            Bu rehber, özel ders arayan öğrencilerin doğru öğretmeni seçerken dikkat etmesi gereken temel noktaları
            özetler. Hedefini, seviyeni, ders türünü ve bütçeni netleştirerek öğretmen profillerini daha hızlı
            karşılaştırabilir; uygun bulduğun öğretmene ders talebi gönderebilirsin.
          </p>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Öğretmen seçerken yalnızca fiyatı değil; deneyim yılını, verdiği dersleri, ders türünü, konumunu ve
            varsa önceki öğrenci yorumlarını birlikte değerlendir. Talep kabul edilene kadar iletişim bilgilerinin
            öğretmenle paylaşılmadığını unutma.
          </p>
          <div className="mt-8 rounded-xl border border-brand-orange/20 bg-brand-orange/5 p-5">
            <p className="text-sm font-medium text-brand-navy">
              {post.category} konusunda öğretmen mi arıyorsunuz?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Yayındaki öğretmenleri inceleyin, profilleri karşılaştırın ve ücretsiz ders talebi gönderin.
            </p>
            <Button
              className="mt-4 bg-brand-orange text-white hover:bg-brand-orange/90"
              nativeButton={false}
              render={<Link href="/ogretmen-bul" />}
            >
              Öğretmen Bul
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <p className="mb-4 text-sm font-semibold text-brand-navy">Diğer Yazılar</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {blogPosts
              .filter((p) => p.slug !== slug)
              .slice(0, 4)
              .map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
                >
                  <Badge variant="secondary" className="mb-2 text-xs">{related.category}</Badge>
                  <p className="text-sm font-medium leading-snug text-brand-navy transition-colors group-hover:text-brand-orange">
                    {related.title}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
