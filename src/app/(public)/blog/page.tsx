import type { Metadata } from "next";
import Link from "next/link";
import { ClockIcon, TagIcon } from "lucide-react";

import { blogCategories, blogPosts } from "@/features/blog/constants";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export const metadata: Metadata = {
  title: "Blog | ÖzelDersEvim",
  description: "Özel ders, sınav hazırlığı ve eğitim hakkında rehber içerikler.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogPage() {
  return (
    <main className="bg-slate-50">
      <section className="bg-brand-navy px-4 py-14 text-white sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold text-brand-orange">Blog</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Eğitim Rehberleri</h1>
          <p className="mt-4 text-white/72">
            Özel ders, sınav hazırlığı ve yabancı dil öğrenimi hakkında pratik içerikler.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge variant="default" className="cursor-pointer bg-brand-navy text-white">
            Tümü
          </Badge>
          {blogCategories.map((cat) => (
            <Badge key={cat} variant="outline" className="cursor-pointer hover:bg-brand-navy hover:text-white">
              {cat}
            </Badge>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs">
                      <TagIcon className="mr-1 size-3" aria-hidden="true" />
                      {post.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-base leading-snug text-brand-navy group-hover:text-brand-orange transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {post.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDate(post.date)}</span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="size-3" aria-hidden="true" />
                      {post.readingMinutes} dk okuma
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
