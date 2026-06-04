"use client";

import Link from "next/link";
import { ArrowRightIcon, ClockIcon, TagIcon } from "lucide-react";
import { useState } from "react";

import { blogCategories, blogPosts } from "@/features/blog/constants";

const categoryColors: Record<string, string> = {
  "Öğrenci Rehberi": "from-brand-orange to-orange-400",
  "Sınav Hazırlık": "from-violet-500 to-purple-600",
  "Yabancı Dil": "from-blue-500 to-cyan-600",
  "Online Eğitim": "from-emerald-500 to-teal-600",
};

function colorFor(cat: string) {
  return categoryColors[cat] ?? "from-slate-500 to-slate-600";
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const filtered = activeCategory ? blogPosts.filter((p) => p.category === activeCategory) : blogPosts;

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0f1e] px-4 py-20 text-white sm:px-6">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(251,115,22,0.2),transparent)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Blog</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Eğitim Rehberleri</h1>
          <p className="mt-4 text-white/55">Özel ders, sınav hazırlığı ve yabancı dil öğrenimi hakkında pratik içerikler.</p>
        </div>
      </section>

      {/* İçerik */}
      <section className="px-4 py-12 sm:px-6" style={{ background: "linear-gradient(180deg, #f8f9fe 0%, #f0f4ff 100%)" }}>
        <div className="mx-auto max-w-6xl">
          {/* Kategori filtresi */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${activeCategory === null ? "bg-brand-navy text-white shadow-md" : "bg-white text-muted-foreground hover:bg-slate-50 border border-slate-200"}`}
            >
              Tümü
            </button>
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${activeCategory === cat ? `bg-gradient-to-r ${colorFor(cat)} text-white shadow-md` : "bg-white text-muted-foreground hover:bg-slate-50 border border-slate-200"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Kartlar */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/60">
                  {/* Renkli üst şerit */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${colorFor(post.category)}`} />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-lg bg-gradient-to-r ${colorFor(post.category)} px-2.5 py-1 text-xs font-semibold text-white`}>
                        <TagIcon className="size-3" aria-hidden="true" />
                        {post.category}
                      </span>
                    </div>
                    <h2 className="flex-1 text-sm font-bold leading-snug text-brand-navy transition-colors group-hover:text-brand-orange">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">{post.summary}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ClockIcon className="size-3.5" aria-hidden="true" />
                        {post.readingMinutes} dk okuma
                      </div>
                      <span className="flex items-center gap-1 text-xs font-medium text-brand-orange opacity-0 transition-opacity group-hover:opacity-100">
                        Oku <ArrowRightIcon className="size-3" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
