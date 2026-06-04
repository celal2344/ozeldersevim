import {
  ArrowRightIcon,
  ClockIcon,
  SparklesIcon,
  StarIcon,
  TagIcon,
} from "lucide-react";
import Link from "next/link";

import { blogPosts } from "@/features/blog/constants";
import {
  homepageHeroSignals,
  homepageSteps,
  homepageTeacherCardGradients,
  heroFeatures,
  platformBenefits,
} from "@/features/homepage/constants";
import { HomepageHeroSearch } from "@/features/homepage/homepage-hero-search";
import { getHomepageMarketplaceData } from "@/features/homepage/service";
import { homepageLessonIcon, initialsFromName } from "@/features/homepage/utils";
import { teacherDeliveryLabels } from "@/features/search/constants";
import { reviewLabel } from "@/features/search/utils";

export default async function HomePage() {
  const { lessons, teachers } = await getHomepageMarketplaceData();

  return (
    <main>
      <section className="relative overflow-hidden bg-[#0a0f1e] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(251,115,22,0.22),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-24 text-center sm:px-6 sm:py-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-sm text-white/80 backdrop-blur">
            <SparklesIcon className="size-3.5 text-brand-orange" aria-hidden="true" />
            Türkiye&apos;nin Özel Ders Platformu
          </div>
          <h1 className="max-w-4xl text-3xl font-extrabold leading-[1.06] tracking-tight text-balance sm:text-5xl lg:text-7xl">
            Hayalindeki{" "}
            <span className="bg-gradient-to-r from-brand-orange to-orange-300 bg-clip-text text-transparent">
              öğretmeni
            </span>{" "}
            bul, hemen başla.
          </h1>
          <p className="max-w-2xl text-lg leading-7 text-white/65">
            Matematik&apos;ten yazılıma, İngilizce&apos;den TYT/AYT&apos;ye alanında uzman öğretmenlerle
            online veya yüz yüze birebir ders al.
          </p>
          <HomepageHeroSearch lessons={lessons} />
          <div className="flex flex-wrap justify-center gap-4 text-xs text-white/50">
            {homepageHeroSignals.map(({ icon: Icon, text }) => (
              <span key={text} className="inline-flex items-center gap-1.5">
                <Icon className="size-3.5 text-brand-orange" aria-hidden="true" />
                {text}
              </span>
            ))}
          </div>
          <div className="grid gap-4 text-xs text-white/60 sm:grid-cols-2 lg:grid-cols-4">
            {heroFeatures.map(({ label, icon: Icon }) => (
              <span key={label} className="inline-flex items-center justify-center gap-2">
                <Icon className="size-3.5 text-brand-orange" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f8f9fe] to-transparent" />
      </section>

      {lessons.length > 0 ? (
        <section
          className="relative px-4 py-20 sm:px-6 lg:px-8"
          style={{ background: "linear-gradient(180deg, #f8f9fe 0%, #ffffff 100%)" }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_20%_50%,rgba(251,115,22,0.04),transparent)]" />
          <div className="relative mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Dersler</p>
                <h2 className="mt-1 text-3xl font-extrabold text-brand-navy">Popüler Kategoriler</h2>
                <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-brand-orange to-orange-300" />
              </div>
              <Link
                href="/ogretmen-bul"
                className="hidden items-center gap-1 text-sm font-medium text-brand-navy/50 transition-colors hover:text-brand-orange sm:flex"
              >
                Tümünü gör <ArrowRightIcon className="size-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {lessons.map(({ name, slug }, index) => {
                const Icon = homepageLessonIcon(name);
                const tone = index % 2 === 0 ? "orange" : "navy";

                return (
                  <Link
                    key={slug}
                    href={`/ogretmen-bul?lesson=${slug}`}
                    className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-transparent hover:shadow-xl hover:shadow-slate-200"
                  >
                    <div
                      className={
                        tone === "orange"
                          ? "absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          : "absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      }
                    />
                    <div className="relative">
                      <span
                        className={
                          tone === "orange"
                            ? "flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-orange to-orange-600 text-white shadow-orange-200 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                            : "flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-navy to-blue-800 text-white shadow-blue-200 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                        }
                      >
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <p className="mt-3 font-bold text-brand-navy">{name}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {teachers.length > 0 ? (
        <section
          className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
          style={{ background: "linear-gradient(135deg, #0d1424 0%, #12192f 50%, #0f1e18 100%)" }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_80%_50%,rgba(251,115,22,0.12),transparent)]" />
          <div className="relative mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Öğretmenler</p>
                <h2 className="mt-1 text-3xl font-extrabold text-white">Öne Çıkan Öğretmenler</h2>
                <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-brand-orange to-orange-300" />
              </div>
              <Link
                href="/ogretmen-bul"
                className="hidden items-center gap-1 text-sm font-medium text-white/40 transition-colors hover:text-brand-orange sm:flex"
              >
                Tümünü gör <ArrowRightIcon className="size-4" />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {teachers.map((teacher, index) => (
                <Link
                  key={teacher.id}
                  href={`/ogretmen/${teacher.slug}`}
                  className="group flex flex-col rounded-2xl border border-white/8 bg-white/6 p-5 backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:shadow-black/30"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${
                        homepageTeacherCardGradients[index % homepageTeacherCardGradients.length]
                      } text-sm font-bold text-white shadow-lg`}
                    >
                      {initialsFromName(teacher.fullName)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white transition-colors group-hover:text-brand-orange">
                        {teacher.fullName}
                      </p>
                      <p className="truncate text-xs text-white/50">{teacher.headline}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-400">
                      <StarIcon className="size-3.5 fill-amber-400" aria-hidden="true" />
                      {reviewLabel(teacher)}
                    </span>
                    <span className="text-sm font-bold text-brand-orange">₺{teacher.hourlyPrice}</span>
                  </div>
                  <p className="mt-2 text-xs text-white/45">{teacherDeliveryLabels[teacher.deliveryMode]}</p>
                  <div className="mt-3 flex items-center justify-center gap-1 rounded-lg bg-white/8 py-2 text-xs font-medium text-white/70 transition-all group-hover:bg-brand-orange group-hover:text-white">
                    Profili Gör <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

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
            {homepageSteps.map(({ num, title, text, color }, index) => (
              <div
                key={num}
                className="group relative flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-xl hover:shadow-slate-200"
              >
                <div className={`flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-2xl font-extrabold text-white shadow-lg`}>
                  {num}
                </div>
                <h3 className="mt-5 text-lg font-bold text-brand-navy">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                {index < homepageSteps.length - 1 ? (
                  <div className="absolute -right-4 top-8 hidden size-8 items-center justify-center md:flex">
                    <ArrowRightIcon className="size-5 text-slate-200" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/ogretmen-bul"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-navy px-8 text-sm font-semibold text-white shadow-lg shadow-brand-navy/20 transition-all hover:scale-[1.02] hover:bg-brand-navy/90"
            >
              Hemen Başla <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
        style={{ background: "linear-gradient(135deg, #f8f9fe 0%, #f0f4ff 100%)" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_10%_80%,rgba(251,115,22,0.05),transparent)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Blog</p>
              <h2 className="mt-1 text-3xl font-extrabold text-brand-navy">Eğitim Rehberleri</h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-brand-orange to-orange-300" />
            </div>
            <Link
              href="/blog"
              className="hidden items-center gap-1 text-sm font-medium text-brand-navy/50 transition-colors hover:text-brand-orange sm:flex"
            >
              Tüm yazılar <ArrowRightIcon className="size-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post, index) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200">
                  <div
                    className={
                      index === 0
                        ? "absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-orange to-orange-400"
                        : index === 1
                          ? "absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500"
                          : "absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"
                    }
                  />
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      <TagIcon className="size-3" aria-hidden="true" />
                      {post.category}
                    </span>
                  </div>
                  <h3 className="flex-1 text-sm font-bold leading-snug text-brand-navy transition-colors group-hover:text-brand-orange">
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

      <section className="relative overflow-hidden bg-[#0a0f1e] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,rgba(251,115,22,0.25),transparent)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Öğretmenler İçin</p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Öğrencilere{" "}
            <span className="bg-gradient-to-r from-brand-orange to-orange-300 bg-clip-text text-transparent">
              ulaş.
            </span>
          </h2>
          <p className="mt-4 text-white/55">Bağımsız çalış. Kendi saatini ve ücretini belirle.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/kayit?role=teacher"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-orange px-8 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition-all hover:scale-[1.02] hover:bg-orange-400"
            >
              Öğretmen Hesabı Aç <ArrowRightIcon className="size-4" />
            </Link>
            <Link
              href="/ogretmen-bul"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-8 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/15"
            >
              Öğretmen Bul
            </Link>
          </div>
        </div>
      </section>

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
