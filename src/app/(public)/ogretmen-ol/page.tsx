import { ArrowRightIcon, BookOpenIcon, CheckCircle2Icon, GraduationCapIcon, StarIcon, UsersIcon, ZapIcon } from "lucide-react";
import Link from "next/link";

import { teacherOnboardingMetadata } from "@/features/seo/constants";

export { teacherOnboardingMetadata as metadata };

const benefits = [
  { icon: ZapIcon, title: "Hızlı Başlangıç", text: "Hesabını oluştur, ilanını yayınla — dakikalar içinde." },
  { icon: UsersIcon, title: "Binlerce Öğrenci", text: "Türkiye genelinde binlerce öğrenciye ulaş." },
  { icon: StarIcon, title: "Kendi Fiyatın", text: "Saatlik ücretini ve çalışma saatlerini sen belirle." },
  { icon: BookOpenIcon, title: "Komisyonsuz", text: "Platform hiçbir komisyon almaz. Kazancın tamamen senin." },
];

export default function TeacherOnboardingHoldingPage() {
  return (
    <main className="bg-[#0a0f1e]">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_10%,rgba(251,115,22,0.2),transparent)]" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-xs font-semibold text-brand-orange backdrop-blur">
              <GraduationCapIcon className="size-3.5" aria-hidden="true" />
              Öğretmen Ol
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.06] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Öğrencilere ulaş,{" "}
              <span className="bg-gradient-to-r from-brand-orange to-orange-300 bg-clip-text text-transparent">
                bağımsız kazan.
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/55">
              Hesabını oluştur, uygunluk testini geç, ilanını yayınla. Komisyonsuz, kendi saatinde, kendi fiyatınla çalış.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/kayit?role=teacher"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-orange px-6 text-sm font-bold text-white shadow-lg shadow-orange-900/30 transition-all hover:bg-orange-400 hover:scale-[1.02]"
              >
                Öğretmen Hesabı Aç <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/giris"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-6 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/15"
              >
                Giriş Yap
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/6 p-5 backdrop-blur shadow-2xl shadow-black/20">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">3 Adımda Başla</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { icon: CheckCircle2Icon, label: "Hesap", sub: "Testten bağımsız" },
                  { icon: ZapIcon, label: "Test", sub: "İlan aşamasında" },
                  { icon: StarIcon, label: "Yayında", sub: "İlan oluşturma" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="rounded-xl bg-white/8 p-4 text-center">
                    <Icon className="mx-auto size-6 text-brand-orange" aria-hidden="true" />
                    <p className="mt-3 text-lg font-bold text-white">{label}</p>
                    <p className="text-xs text-white/45">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 p-5 backdrop-blur text-sm leading-6 text-white/55">
              Hesabını oluşturduktan sonra öğretmen paneline yönlendirileceksin. İlan oluşturma adımında kısa bir uygunluk testi seni bekleyecek.
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(251,115,22,0.08),transparent)]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-10 text-center text-sm font-bold uppercase tracking-widest text-white/30">Neden ÖzelDersEvim?</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-white/8 bg-white/5 p-6 backdrop-blur transition-all hover:border-white/15 hover:bg-white/8">
                <div className="flex size-11 items-center justify-center rounded-xl bg-brand-orange/15">
                  <Icon className="size-5 text-brand-orange" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-bold text-white">{title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-white/45">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/kayit?role=teacher"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-orange px-8 text-sm font-bold text-white shadow-lg shadow-orange-900/30 transition-all hover:bg-orange-400 hover:scale-[1.02]"
            >
              Hemen Başla <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
