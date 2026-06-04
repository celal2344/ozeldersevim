import Link from "next/link";
import {
  ArrowRightIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  GraduationCapIcon,
  MapPinIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
  StarIcon,
  VideoIcon,
} from "lucide-react";

import type { TeacherProfile } from "@/features/teachers/types";
import {
  teacherDeliveryLabel,
  teacherInitials,
  teacherPriceLabel,
  teacherProfileStats,
  teacherRatingLabel,
  teacherRequestHref,
} from "@/features/teachers/utils";
import { FavoriteButton } from "@/features/favorites/favorite-button";

export function TeacherProfileView({ teacher }: { teacher: TeacherProfile }) {
  return (
    <main>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#0a0f1e] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_80%_20%,rgba(251,115,22,0.2),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div className="flex flex-col gap-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Link href="/ogretmen-bul" className="hover:text-brand-orange transition-colors">Öğretmenler</Link>
              <span>/</span>
              <span className="text-white/70">{teacher.fullName}</span>
            </div>

            {/* Profile header */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              {/* Avatar */}
              <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange to-orange-700 text-3xl font-extrabold text-white shadow-2xl shadow-orange-900/40 ring-4 ring-white/10">
                {teacherInitials(teacher.fullName)}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  {teacher.isVerified && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                      <CheckCircle2Icon className="size-3.5" aria-hidden="true" />
                      Doğrulanmış Öğretmen
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
                    {teacherDeliveryLabel(teacher.deliveryMode)}
                  </span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{teacher.fullName}</h1>
                <p className="text-lg text-white/60">{teacher.headline}</p>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-white/55">{teacher.shortBio}</p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: MapPinIcon, text: `${teacher.city} / ${teacher.district}` },
                { icon: StarIcon, text: teacherRatingLabel(teacher) },
                { icon: GraduationCapIcon, text: `${teacher.experienceYears} yıl deneyim` },
                { icon: VideoIcon, text: teacherDeliveryLabel(teacher.deliveryMode) },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/70 backdrop-blur">
                  <Icon className="size-4 text-brand-orange" aria-hidden="true" />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Card */}
          <div className="self-start rounded-2xl border border-white/10 bg-white/8 p-6 backdrop-blur shadow-2xl shadow-black/30">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Saatlik Ücret</p>
            <p className="mt-1 text-4xl font-extrabold text-brand-orange">{teacherPriceLabel(teacher)}</p>
            <p className="mt-2 text-xs text-white/40">Öğretmen kabul edince iletişim bilgilerin paylaşılır.</p>
            <div className="mt-5 flex flex-col gap-3">
              <a
                href={teacherRequestHref(teacher)}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-orange text-sm font-bold text-white shadow-lg shadow-orange-900/30 transition-all hover:bg-orange-400 hover:scale-[1.01]"
              >
                Ders Talep Et <ArrowRightIcon className="size-4" aria-hidden="true" />
              </a>
              <FavoriteButton teacherSlug={teacher.slug} />
            </div>
            <div className="mt-5 space-y-2 border-t border-white/10 pt-5">
              {[
                { icon: ShieldCheckIcon, text: "Platform içi ödeme yok" },
                { icon: MessageCircleIcon, text: "Online ders için kendi araçlarını kullan" },
              ].map(({ icon: Icon, text }) => (
                <p key={text} className="flex items-center gap-2 text-xs text-white/40">
                  <Icon className="size-3.5 text-brand-orange/60 shrink-0" aria-hidden="true" />
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#f8f9fe] to-transparent" />
      </section>

      {/* ── CONTENT ── */}
      <section
        className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8"
        style={{ background: "linear-gradient(180deg,#f8f9fe 0%,#f3f5ff 100%)" }}
      >
        <div className="flex flex-col gap-5">
          {/* About */}
          <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-brand-navy">
              <span className="h-5 w-1 rounded-full bg-brand-orange" />
              Öğretmen Hakkında
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">{teacher.longBio}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Eğitim", value: teacher.education },
                { label: "Ders Türü", value: teacherDeliveryLabel(teacher.deliveryMode) },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-muted-foreground">{label}</p>
                  <p className="mt-1 font-semibold text-brand-navy">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Lessons */}
          <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-brand-navy">
              <span className="h-5 w-1 rounded-full bg-violet-500" />
              Verdiği Dersler
            </h2>
            <div className="flex flex-wrap gap-2">
              {teacher.lessons.map((lesson) => (
                <span
                  key={lesson}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy px-4 py-2 text-sm font-medium text-white"
                >
                  <BookOpenIcon className="size-3.5" aria-hidden="true" />
                  {lesson}
                </span>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-brand-navy">
              <span className="h-5 w-1 rounded-full bg-amber-400" />
              Yorumlar
            </h2>
            {teacher.reviews.length > 0 ? (
              <div className="flex flex-col gap-4">
                {teacher.reviews.map((review) => (
                  <div key={review.id} className="rounded-xl bg-slate-50 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
                          {review.studentName.slice(0, 2).toUpperCase()}
                        </div>
                        <p className="font-semibold text-brand-navy">{review.studentName}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <StarIcon
                            key={s}
                            className={`size-3.5 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-none text-slate-300"}`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
                <StarIcon className="size-8 text-slate-300" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">Henüz yorum yok.</p>
                <p className="text-xs text-muted-foreground/70">Yorumlar ders talebi kabul edildikten sonra yazılabilir.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5">
          {/* Stats */}
          <div className="overflow-hidden rounded-2xl bg-[#0a0f1e] shadow-xl shadow-black/20">
            <div className="border-b border-white/8 px-6 py-4">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Profil Özeti</p>
            </div>
            <div className="divide-y divide-white/8">
              {teacherProfileStats(teacher).map((stat) => (
                <div key={stat.label} className="flex items-center justify-between px-6 py-4">
                  <p className="text-xs text-white/45">{stat.label}</p>
                  <p className="text-sm font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact rule */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-brand-navy">
              <span className="h-4 w-1 rounded-full bg-emerald-500" />
              İletişim Kuralı
            </h3>
            <p className="text-xs leading-5 text-muted-foreground">
              Öğrenci iletişim bilgileri yalnızca öğretmen ders talebini kabul ettikten sonra paylaşılır.
            </p>
            <p className="mt-3 flex items-center gap-2 text-xs font-medium text-brand-navy">
              <MessageCircleIcon className="size-3.5 text-brand-orange" aria-hidden="true" />
              Kabul edildikten sonra doğrudan iletişime geçebilirsiniz.
            </p>
          </div>

          {/* CTA repeat */}
          <a
            href={teacherRequestHref(teacher)}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-brand-orange text-sm font-bold text-white shadow-lg shadow-orange-200 transition-all hover:bg-orange-400 hover:scale-[1.01]"
          >
            Ders Talep Et <ArrowRightIcon className="size-4" aria-hidden="true" />
          </a>
        </aside>
      </section>
    </main>
  );
}
