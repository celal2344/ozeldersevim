import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRightIcon, BookOpenIcon, CheckIcon, GraduationCapIcon, SearchIcon, SparklesIcon, ZapIcon } from "lucide-react";

import { RegisterForm } from "@/features/auth/register-form";
import { getCurrentAccount } from "@/features/auth/service";
import { defaultLoginRedirectForRole, safeNextPath } from "@/features/auth/utils";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: "Kayıt Ol | ÖzelDersEvim",
  description: "Ücretsiz öğrenci veya öğretmen hesabı oluştur.",
};

const teacherBenefits = [
  "Kendi saatini ve ücretini belirle",
  "Binlerce öğrenciye ulaş",
  "Komisyonsuz, bağımsız çalış",
  "Online veya yüz yüze ders ver",
];

const studentBenefits = [
  "Yüzlerce uzman öğretmen",
  "Ücretsiz ders talebi gönder",
  "Online veya yüz yüze seçeneği",
  "Tamamen ücretsiz kayıt",
];

export default async function RegisterPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const next = safeNextPath(Array.isArray(params.next) ? params.next[0] : params.next);
  const roleParam = Array.isArray(params.role) ? params.role[0] : params.role;
  const account = await getCurrentAccount();

  if (account) redirect(next ?? defaultLoginRedirectForRole(account.role));

  const roleHref = (role: string) =>
    next ? `/kayit?role=${role}&next=${encodeURIComponent(next)}` : `/kayit?role=${role}`;

  /* ── FORM MODE (role selected) ── */
  if (roleParam === "teacher" || roleParam === "student") {
    const isTeacher = roleParam === "teacher";
    return (
      <div className="flex min-h-screen">
        {/* Left panel */}
        <div className={`hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col justify-between p-10 text-white ${isTeacher ? "bg-gradient-to-br from-[#0a0f1e] via-[#0f1a35] to-[#1a0a05]" : "bg-gradient-to-br from-[#0a0f1e] via-[#0a1f0e] to-[#051a0a]"}`}>
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="flex size-9 items-center justify-center rounded-xl bg-brand-orange">
                <GraduationCapIcon className="size-5" aria-hidden="true" />
              </span>
              ÖzelDers<span className="text-brand-orange">Evim</span>
            </Link>
            <div className="mt-14">
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${isTeacher ? "bg-orange-500/20 text-orange-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                {isTeacher ? <SparklesIcon className="size-3" /> : <SearchIcon className="size-3" />}
                {isTeacher ? "Öğretmen Hesabı" : "Öğrenci Hesabı"}
              </div>
              <h2 className="mt-4 text-3xl font-bold leading-snug">
                {isTeacher ? "Öğrencilere ulaş, bağımsız çalış." : "Hayalindeki öğretmeni bul."}
              </h2>
              <p className="mt-3 text-sm text-white/55">
                {isTeacher
                  ? "Kendi ilanını oluştur, ders taleplerini yönet, tamamen komisyonsuz kazan."
                  : "Ders, konum ve puana göre öğretmen bul. Ücretsiz ders talebi gönder."}
              </p>
              <ul className="mt-8 flex flex-col gap-3">
                {(isTeacher ? teacherBenefits : studentBenefits).map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm text-white/75">
                    <span className={`flex size-5 shrink-0 items-center justify-center rounded-full ${isTeacher ? "bg-orange-500/30 text-orange-300" : "bg-emerald-500/30 text-emerald-300"}`}>
                      <CheckIcon className="size-3" aria-hidden="true" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-xs text-white/30">© 2026 ÖzelDersEvim</p>
        </div>

        {/* Right: form */}
        <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-4 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-2 flex gap-1 rounded-xl border border-slate-200 bg-white p-1">
              {[{ role: "student", label: "Öğrenci" }, { role: "teacher", label: "Öğretmen" }].map((opt) => (
                <Link
                  key={opt.role}
                  href={roleHref(opt.role)}
                  className={`flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors ${
                    roleParam === opt.role ? "bg-brand-navy text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h1 className="mb-5 text-xl font-bold text-brand-navy">
                {isTeacher ? "Öğretmen Hesabı Oluştur" : "Öğrenci Hesabı Oluştur"}
              </h1>
              <RegisterForm initialRole={roleParam} next={next} />
            </div>
            <p className="mt-5 text-center text-sm text-muted-foreground">
              Hesabın var mı?{" "}
              <Link href={next ? `/giris?next=${encodeURIComponent(next)}` : "/giris"} className="font-medium text-brand-orange hover:underline">
                Giriş yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── HUB MODE (no role selected) ── */
  return (
    <div className="relative overflow-hidden bg-[#0a0f1e] min-h-screen flex flex-col">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(251,115,22,0.18),transparent)]" />

      {/* Header */}
      <header className="relative flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 font-bold text-white">
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand-orange">
            <GraduationCapIcon className="size-5" aria-hidden="true" />
          </span>
          ÖzelDers<span className="text-brand-orange">Evim</span>
        </Link>
        <Link href="/giris" className="text-sm text-white/50 hover:text-white transition-colors">
          Giriş Yap
        </Link>
      </header>

      {/* Content */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-xs text-white/70 backdrop-blur">
          <ZapIcon className="size-3 text-brand-orange" aria-hidden="true" />
          Tamamen ücretsiz — hemen başla
        </div>
        <h1 className="mt-4 max-w-xl text-center text-4xl font-extrabold text-white text-balance sm:text-5xl">
          Nasıl devam etmek istiyorsun?
        </h1>
        <p className="mt-3 text-center text-white/50">Hesap türünü seç ve 1 dakikada başla.</p>

        <div className="mt-12 grid w-full max-w-2xl gap-4 sm:grid-cols-2">
          {/* Teacher card */}
          <Link
            href={roleHref("teacher")}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/6 p-7 backdrop-blur transition-all duration-300 hover:border-brand-orange/40 hover:bg-white/10 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-950/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange to-orange-600 shadow-lg shadow-orange-900/40">
                <GraduationCapIcon className="size-7 text-white" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-white">Öğretmen Ol</h2>
              <p className="mt-2 text-sm text-white/55 leading-relaxed">
                İlanını oluştur, öğrencilere ulaş, bağımsız ve komisyonsuz kazan.
              </p>
              <ul className="mt-5 flex flex-col gap-2">
                {teacherBenefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-xs text-white/60">
                    <span className="size-1.5 shrink-0 rounded-full bg-brand-orange" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-brand-orange group-hover:gap-3 transition-all">
                Öğretmen Hesabı Aç <ArrowRightIcon className="size-4" aria-hidden="true" />
              </div>
            </div>
          </Link>

          {/* Student card */}
          <Link
            href={roleHref("student")}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/6 p-7 backdrop-blur transition-all duration-300 hover:border-emerald-400/40 hover:bg-white/10 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-950/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-900/40">
                <BookOpenIcon className="size-7 text-white" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-white">Öğrenci Ol</h2>
              <p className="mt-2 text-sm text-white/55 leading-relaxed">
                Öğretmen bul, ders talebi gönder, hayalindeki eğitimi al.
              </p>
              <ul className="mt-5 flex flex-col gap-2">
                {studentBenefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-xs text-white/60">
                    <span className="size-1.5 shrink-0 rounded-full bg-emerald-400" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-400 group-hover:gap-3 transition-all">
                Öğrenci Hesabı Aç <ArrowRightIcon className="size-4" aria-hidden="true" />
              </div>
            </div>
          </Link>
        </div>

        <p className="mt-8 text-sm text-white/35">
          Zaten hesabın var mı?{" "}
          <Link href={next ? `/giris?next=${encodeURIComponent(next)}` : "/giris"} className="text-white/60 hover:text-white underline underline-offset-2">
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  );
}
