import Link from "next/link";
import {
  ArrowRightIcon,
  BookOpenIcon,
  ClockIcon,
  GraduationCapIcon,
  SearchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  TagIcon,
  ZapIcon,
} from "lucide-react";

import {
  featuredTeacherPreviews,
  popularHomepageLessons,
} from "@/features/homepage/constants";
import { initialsFromName, lessonSearchHref } from "@/features/homepage/utils";
import { blogPosts } from "@/features/blog/constants";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

const avatarGradients = [
  "from-violet-500 to-purple-700",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
];

export default function HomePage() {
  return (
    <main className="bg-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#0a0f1e] text-white">
        {/* Mesh gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(251,115,22,0.22),transparent)]" />
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-24 text-center sm:px-6 sm:py-32">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-sm text-white/80 backdrop-blur">
            <SparklesIcon className="size-3.5 text-brand-orange" aria-hidden="true" />
            Türkiye&apos;nin Özel Ders Platformu
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.04] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Hayalindeki{" "}
            <span className="bg-gradient-to-r from-brand-orange to-orange-300 bg-clip-text text-transparent">
              öğretmeni
            </span>{" "}
            bul, hemen başla.
          </h1>

          <p className="max-w-2xl text-lg leading-7 text-white/65">
            Matematik&apos;ten yazılıma, İngilizce&apos;den TYT/AYT&apos;ye — alanında uzman öğretmenlerle
            online veya yüz yüze birebir ders al.
          </p>

          {/* Embedded search bar */}
          <form
            action="/ogretmen-bul"
            className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row"
          >
            <select
              name="lesson"
              className="h-12 flex-1 rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white backdrop-blur focus:outline-none focus:ring-2 focus:ring-brand-orange/60 [&>option]:bg-[#0a0f1e]"
            >
              <option value="">Ders seç</option>
              <option value="matematik">Matematik</option>
              <option value="fizik">Fizik</option>
              <option value="kimya">Kimya</option>
              <option value="ingilizce">İngilizce</option>
              <option value="turkce">Türkçe</option>
              <option value="yazilim">Yazılım</option>
              <option value="lgs">LGS</option>
              <option value="tyt-ayt">TYT / AYT</option>
            </select>
            <button
              type="submit"
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-orange px-6 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition-all hover:bg-orange-400 hover:shadow-orange-900/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              <SearchIcon className="size-4" aria-hidden="true" />
              Öğretmen Ara
            </button>
          </form>

          {/* Trust pills */}
          <div className="flex flex-wrap justify-center gap-3 text-xs text-white/55">
            {[
              { icon: ZapIcon, text: "Ücretsiz kayıt" },
              { icon: ShieldCheckIcon, text: "Güvenli iletişim" },
              { icon: GraduationCapIcon, text: "Uzman öğretmenler" },
              { icon: StarIcon, text: "Doğrulanmış yorumlar" },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="inline-flex items-center gap-1.5">
                <Icon className="size-3.5 text-brand-orange" aria-hidden="true" />
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ── POPULAR LESSONS ── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-orange">Dersler</p>
              <h2 className="mt-1 text-3xl font-bold text-brand-navy">Popüler Kategoriler</h2>
            </div>
            <Link href="/ogretmen-bul" className="hidden items-center gap-1 text-sm font-medium text-brand-navy/60 hover:text-brand-orange transition-colors sm:flex">
              Tümünü gör <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {popularHomepageLessons.map(({ name, count, icon: Icon, tone }, i) => (
              <Link
                key={name}
                href={lessonSearchHref(name)}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/80 hover:border-transparent"
              >
                <div
                  className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                    tone === "orange"
                      ? "bg-gradient-to-br from-orange-50 to-amber-50"
                      : "bg-gradient-to-br from-blue-50 to-indigo-50"
                  }`}
                />
                <div className="relative">
                  <span
                    className={`flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                      tone === "orange"
                        ? "bg-gradient-to-br from-brand-orange to-orange-600 text-white shadow-lg shadow-orange-200"
                        : "bg-gradient-to-br from-brand-navy to-blue-700 text-white shadow-lg shadow-blue-200"
                    }`}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <p className="mt-3 font-semibold text-brand-navy">{name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED TEACHERS ── */}
      <section className="bg-slate-50/80 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-orange">Öğretmenler</p>
              <h2 className="mt-1 text-3xl font-bold text-brand-navy">Öne Çıkan Öğretmenler</h2>
            </div>
            <Link href="/ogretmen-bul" className="hidden items-center gap-1 text-sm font-medium text-brand-navy/60 hover:text-brand-orange transition-colors sm:flex">
              Tümünü gör <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {featuredTeacherPreviews.map(({ name, title, price, rating, slug }, i) => (
              <Link
                key={name}
                href={`/ogretmen/${slug}`}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 hover:border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} text-sm font-bold text-white shadow-md`}
                  >
                    {initialsFromName(name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-brand-navy group-hover:text-brand-orange transition-colors">
                      {name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{title}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-500">
                    <StarIcon className="size-3.5 fill-amber-400" aria-hidden="true" />
                    {rating}
                  </span>
                  <span className="text-sm font-bold text-brand-orange">{price}</span>
                </div>
                <div className="mt-3 flex items-center justify-center gap-1 rounded-lg bg-slate-50 py-2 text-xs font-medium text-brand-navy group-hover:bg-brand-orange group-hover:text-white transition-colors">
                  Profili Gör
                  <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-orange">Nasıl Çalışır?</p>
            <h2 className="mt-2 text-3xl font-bold text-brand-navy">3 adımda derse başla</h2>
          </div>
          <div className="relative grid gap-8 md:grid-cols-3">
            {/* connector line (desktop only) */}
            <div className="absolute top-8 left-1/6 right-1/6 hidden h-px bg-gradient-to-r from-transparent via-brand-orange/30 to-transparent md:block" />
            {[
              { num: "01", title: "Öğretmen Bul", text: "Ders, konum ve puana göre filtrele. Profilini incele." },
              { num: "02", title: "Talep Gönder", text: "Ücretsiz kayıt ol, öğretmene ders talebi gönder." },
              { num: "03", title: "Derse Başla", text: "Öğretmen kabul edince seni arar. Programı birlikte kurun." },
            ].map(({ num, title, text }) => (
              <div key={num} className="flex flex-col items-center text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-navy to-blue-800 text-xl font-extrabold text-white shadow-lg shadow-blue-900/20">
                  {num}
                </div>
                <h3 className="mt-5 text-lg font-bold text-brand-navy">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button
              size="lg"
              className="h-12 bg-brand-orange px-8 text-white shadow-lg shadow-orange-200 hover:bg-orange-400 hover:shadow-orange-300 transition-all hover:scale-[1.02]"
              nativeButton={false}
              render={<Link href="/ogretmen-bul" />}
            >
              Hemen Başla
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── BLOG ── */}
      <section className="border-t border-slate-100 bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-orange">Blog</p>
              <h2 className="mt-1 text-3xl font-bold text-brand-navy">Eğitim Rehberleri</h2>
            </div>
            <Link href="/blog" className="hidden items-center gap-1 text-sm font-medium text-brand-navy/60 hover:text-brand-orange transition-colors sm:flex">
              Tüm yazılar <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/80 hover:border-slate-100">
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange/10 px-2.5 py-1 text-xs font-medium text-brand-orange">
                      <TagIcon className="size-3" aria-hidden="true" />
                      {post.category}
                    </span>
                  </div>
                  <h3 className="flex-1 text-sm font-semibold leading-snug text-brand-navy group-hover:text-brand-orange transition-colors">
                    {post.title}
                  </h3>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <ClockIcon className="size-3.5" aria-hidden="true" />
                    {post.readingMinutes} dk okuma
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative overflow-hidden bg-[#0a0f1e] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,rgba(251,115,22,0.25),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Öğretmen misin?{" "}
            <span className="bg-gradient-to-r from-brand-orange to-orange-300 bg-clip-text text-transparent">
              Binlerce öğrenciye ulaş.
            </span>
          </h2>
          <p className="mt-4 text-white/60">
            Komisyonsuz, bağımsız çalış. Kendi saatini ve ücretini belirle.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="h-12 bg-brand-orange px-8 text-white shadow-lg shadow-orange-900/30 hover:bg-orange-400 transition-all hover:scale-[1.02]"
              nativeButton={false}
              render={<Link href="/kayit?role=teacher" />}
            >
              Öğretmen Hesabı Aç
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-white/20 bg-white/8 px-8 text-white hover:bg-white/15 hover:text-white backdrop-blur"
              nativeButton={false}
              render={<Link href="/ogretmen-bul" />}
            >
              Öğretmen Bul
            </Button>
          </div>
        </div>
      </section>

    </main>
  );
}
