import Link from "next/link";
import { redirect } from "next/navigation";
import { GraduationCapIcon, ShieldCheckIcon, StarIcon, UsersIcon } from "lucide-react";

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

const highlights = [
  { icon: UsersIcon, text: "Binlerce uzman öğretmen" },
  { icon: StarIcon, text: "Doğrulanmış yorumlar" },
  { icon: ShieldCheckIcon, text: "Güvenli iletişim" },
];

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const next = safeNextPath(Array.isArray(params.next) ? params.next[0] : params.next);
  const account = await getCurrentAccount();

  if (account) redirect(next ?? defaultLoginRedirectForRole(account.role));

  return (
    <div className="flex min-h-screen">
      {/* Left: dark brand panel */}
      <div className="relative hidden lg:flex lg:w-[440px] xl:w-[520px] flex-col justify-between overflow-hidden bg-[#0a0f1e] p-10 text-white">
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_100%,rgba(251,115,22,0.18),transparent)]" />

        <div className="relative">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand-orange">
              <GraduationCapIcon className="size-5" aria-hidden="true" />
            </span>
            ÖzelDers<span className="text-brand-orange">Evim</span>
          </Link>

          <div className="mt-20">
            <h2 className="text-4xl font-extrabold leading-tight">
              Tekrar<br />
              hoş geldin.
            </h2>
            <p className="mt-4 text-sm text-white/50 leading-relaxed">
              Hesabına giriş yap, öğretmenlerine ve ders taleplerine devam et.
            </p>

            <div className="mt-10 flex flex-col gap-4">
              {highlights.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-white/60">
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

      {/* Right: form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-brand-navy">Giriş Yap</h1>
            <p className="mt-1 text-sm text-muted-foreground">Hesabına devam et.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <LoginForm next={next} />
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Hesabın yok mu?{" "}
            <Link
              href={next ? `/kayit?next=${encodeURIComponent(next)}` : "/kayit"}
              className="font-medium text-brand-orange hover:underline"
            >
              Ücretsiz kayıt ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
