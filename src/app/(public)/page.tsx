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

const avatarGradients = [
  "from-violet-500 to-purple-700",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
];

export default function HomePage() {
  return (
    <main>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#0a0f1e] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(251,115,22,0.22),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-24 text-center sm:px-6 sm:py-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-sm text-white/80 backdrop-blur">
            <SparklesIcon className="size-3.5 text-brand-orange" aria-hidden="true" />
            Türkiye&apos;nin Özel Ders Platformu
          </div>
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
          <form action="/ogretmen-bul" className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row">
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
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-orange px-6 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition-all hover:bg-orange-400 hover:scale-[1.02] active:scale-[0.98]"
            >
              <SearchIcon className="size-4" aria-hidden="true" />
              Öğretmen Ara
            </button>
          </form>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-white/50">
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
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f8f9fe] to-transparent" />
      </section>

      {/* ── POPULAR LESSONS ── */}
      <section
        className="relative px-4 py-20 sm:px-6 lg:px-8"
        style={{ background: "linear-gradient(180deg, #f8f9fe 0%, #ffffff 100%)" }}
      >
        {/* Subtle radial accent */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_20%_50%,rgba(251,115,22,0.04),transparent)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Dersler</p>
              <h2 className="mt-1 text-3xl font-extrabold text-brand-navy">Popüler Kategoriler</h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-brand-orange to-orange-300" />
            </div>
            <Link href="/ogretmen-bul" className="hidden items-center gap-1 text-sm font-medium text-brand-navy/50 transition-colors hover:text-brand-orange sm:flex">
              Tümünü gör <ArrowRightIcon className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {popularHomepageLessons.map(({ name, count, icon: Icon, tone }) => (
              <Link
                key={name}
                href={lessonSearchHref(name)}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200 hover:border-transparent"
              >
                <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${tone === "orange" ? "bg-gradient-to-br from-orange-50 via-amber-50 to-white" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-white"}`} />
                <div className="relative">
                  <span className={`flex size-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${tone === "orange" ? "bg-gradient-to-br from-brand-orange to-orange-600 text-white shadow-orange-200" : "bg-gradient-to-br from-brand-navy to-blue-800 text-white shadow-blue-200"}`}>
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <p className="mt-3 font-bold text-brand-navy">{name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED TEACHERS ── */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8" style={{ background: "linear-gradient(135deg, #0d1424 0%, #12192f 50%, #0f1e18 100%)" }}>
        {/* Dot pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_80%_50%,rgba(251,115,22,0.12),transparent)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Öğretmenler</p>
              <h2 className="mt-1 text-3xl font-extrabold text-white">Öne Çıkan Öğretmenler</h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-brand-orange to-orange-300" />
            </div>
            <Link href="/ogretmen-bul" className="hidden items-center gap-1 text-sm font-medium text-white/40 transition-colors hover:text-brand-orange sm:flex">
              Tümünü gör <ArrowRightIcon className="size-4" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {featuredTeacherPreviews.map(({ name, title, price, rating, slug }, i) => (
              <Link
                key={name}
                href={`/ogretmen/${slug}`}
                className="group flex flex-col rounded-2xl border border-white/8 bg-white/6 p-5 backdrop-blur transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/30"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} text-sm font-bold text-white shadow-lg`}>
                    {initialsFromName(name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white group-hover:text-brand-orange transition-colors">{name}</p>
                    <p className="truncate text-xs text-white/50">{title}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-400">
                    <StarIcon className="size-3.5 fill-amber-400" aria-hidden="true" />
                    {rating}
                  </span>
                  <span className="text-sm font-bold text-brand-orange">{price}</span>
                </div>
                <div className="mt-3 flex items-center justify-center gap-1 rounded-lg bg-white/8 py-2 text-xs font-medium text-white/70 group-hover:bg-brand-orange group-hover:text-white transition-all">
                  Profili Gör <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        className="relative px-4 py-20 sm:px-6 lg:px-8"
        style={{ background: "linear-gradient(180deg, #ffffff 0%, #f8f9fe 100%)" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_80%_30%,rgba(251,115,22,0.05),transparent)]" />
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Nasıl Çalışır?</p>
            <h2 className="mt-2 text-3xl font-extrabold text-brand-navy">3 adımda derse başla</h2>
            <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-brand-orange to-orange-300" />
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { num: "01", title: "Öğretmen Bul", text: "Ders, konum ve puana göre filtrele. Profilini incele.", color: "from-brand-orange to-orange-500" },
              { num: "02", title: "Talep Gönder", text: "Ücretsiz kayıt ol, öğretmene ders talebi gönder.", color: "from-violet-600 to-purple-600" },
              { num: "03", title: "Derse Başla", text: "Öğretmen kabul edince seni arar. Programı birlikte planlayın.", color: "from-emerald-500 to-teal-600" },
            ].map(({ num, title, text, color }, i) => (
              <div key={num} className="group relative flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200 hover:border-transparent">
                <div className={`flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-2xl font-extrabold text-white shadow-lg`}>
                  {num}
                </div>
                <h3 className="mt-5 text-lg font-bold text-brand-navy">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                {i < 2 && (
                  <div className="absolute -right-4 top-8 hidden size-8 items-center justify-center md:flex">
                    <ArrowRightIcon className="size-5 text-slate-200" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <a
              href="/ogretmen-bul"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-navy px-8 text-sm font-semibold text-white shadow-lg shadow-brand-navy/20 transition-all hover:bg-brand-navy/90 hover:scale-[1.02]"
            >
              Hemen Başla <ArrowRightIcon className="size-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── BLOG ── */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8" style={{ background: "linear-gradient(135deg, #f8f9fe 0%, #f0f4ff 100%)" }}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_10%_80%,rgba(251,115,22,0.05),transparent)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Blog</p>
              <h2 className="mt-1 text-3xl font-extrabold text-brand-navy">Eğitim Rehberleri</h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-brand-orange to-orange-300" />
            </div>
            <Link href="/blog" className="hidden items-center gap-1 text-sm font-medium text-brand-navy/50 transition-colors hover:text-brand-orange sm:flex">
              Tüm yazılar <ArrowRightIcon className="size-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post, i) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200">
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${i === 0 ? "from-brand-orange to-orange-400" : i === 1 ? "from-violet-500 to-purple-500" : "from-emerald-500 to-teal-400"}`} />
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      <TagIcon className="size-3" aria-hidden="true" />
                      {post.category}
                    </span>
                  </div>
                  <h3 className="flex-1 text-sm font-bold leading-snug text-brand-navy group-hover:text-brand-orange transition-colors">
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
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Öğretmenler İçin</p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Binlerce öğrenciye{" "}
            <span className="bg-gradient-to-r from-brand-orange to-orange-300 bg-clip-text text-transparent">
              ulaş.
            </span>
          </h2>
          <p className="mt-4 text-white/55">Komisyonsuz, bağımsız çalış. Kendi saatini ve ücretini belirle.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/kayit?role=teacher" className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-orange px-8 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition-all hover:bg-orange-400 hover:scale-[1.02]">
              Öğretmen Hesabı Aç <ArrowRightIcon className="size-4" />
            </a>
            <a href="/ogretmen-bul" className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-8 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/15">
              Öğretmen Bul
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
