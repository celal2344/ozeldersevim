import Link from "next/link";
import { redirect } from "next/navigation";
import { GraduationCapIcon, ShieldCheckIcon, SparklesIcon, StarIcon, UsersIcon } from "lucide-react";

import { LoginForm } from "@/features/auth/login-form";
import { getCurrentAccount } from "@/features/auth/service";
import { defaultLoginRedirectForRole, safeNextPath } from "@/features/auth/utils";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: "Giriş Yap | ÖzelDersEvim",
  description: "ÖzelDersEvim hesabına giriş yap.",
};

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const next = safeNextPath(Array.isArray(params.next) ? params.next[0] : params.next);
  const account = await getCurrentAccount();
  if (account) redirect(next ?? defaultLoginRedirectForRole(account.role));

  return (
    <div className="flex min-h-screen">
      {/* Sol: koyu panel */}
      <div className="relative hidden lg:flex lg:w-[440px] xl:w-[520px] flex-col justify-between overflow-hidden bg-[#0a0f1e] p-10 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_100%,rgba(251,115,22,0.18),transparent)]" />
        <div className="relative">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand-orange">
              <GraduationCapIcon className="size-5" aria-hidden="true" />
            </span>
            ÖzelDers<span className="text-brand-orange">Evim</span>
          </Link>
          <div className="mt-20">
            <h2 className="text-4xl font-extrabold leading-tight">Tekrar<br />hoş geldin.</h2>
            <p className="mt-4 text-sm text-white/50 leading-relaxed">Hesabına giriş yap, öğretmenlerine ve ders taleplerine devam et.</p>
            <div className="mt-10 flex flex-col gap-4">
              {[
                { icon: UsersIcon, text: "Binlerce uzman öğretmen" },
                { icon: StarIcon, text: "Doğrulanmış yorumlar" },
                { icon: ShieldCheckIcon, text: "Güvenli iletişim" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-white/55">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/8">
                    <Icon className="size-4 text-brand-orange" aria-hidden="true" />
                  </span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="relative text-xs text-white/25">© 2026 ÖzelDersEvim</p>
      </div>

      {/* Sağ: form */}
      <div
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-12 sm:px-8"
        style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #f8f9fe 40%, #fff5f0 100%)" }}
      >
        <div className="pointer-events-none absolute right-12 top-20 size-72 rounded-full bg-brand-orange/8 blur-3xl" />
        <div className="pointer-events-none absolute bottom-20 left-12 size-56 rounded-full bg-violet-500/6 blur-3xl" />

        <div className="relative w-full max-w-sm">
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-orange/25 bg-white px-3 py-1.5 text-xs font-semibold text-brand-orange shadow-sm">
              <SparklesIcon className="size-3" aria-hidden="true" />
              Ücretsiz üyelik
            </div>
            <h1 className="mt-4 text-2xl font-extrabold text-brand-navy">Giriş Yap</h1>
            <p className="mt-1 text-sm text-muted-foreground">Hesabına devam et.</p>
          </div>

          <div className="rounded-2xl border border-white bg-white/95 p-8 shadow-2xl shadow-slate-300/30 backdrop-blur">
            <LoginForm next={next} />
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Hesabın yok mu?{" "}
            <Link href={next ? `/kayit?next=${encodeURIComponent(next)}` : "/kayit"} className="font-semibold text-brand-orange hover:underline">
              Ücretsiz kayıt ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
