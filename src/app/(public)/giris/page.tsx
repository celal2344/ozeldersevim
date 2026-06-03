import Link from "next/link";
import { redirect } from "next/navigation";

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

  if (account) {
    redirect(next ?? defaultLoginRedirectForRole(account.role));
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-3xl font-bold text-brand-navy">Tekrar hoş geldin! 👋</p>
          <p className="mt-2 text-sm text-muted-foreground">Hesabına giriş yaparak devam et.</p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
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
    </main>
  );
}
