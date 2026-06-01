import { redirect } from "next/navigation";

import { LoginForm } from "@/features/auth/login-form";
import { getCurrentAccount } from "@/features/auth/service";
import { defaultLoginRedirectForRole, safeNextPath } from "@/features/auth/utils";

export const dynamic = "force-dynamic";

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
    <main className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="rounded-2xl bg-brand-navy p-8 text-white shadow-sm">
          <p className="text-sm font-semibold text-brand-orange">Giriş Yap</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Derslerine ve başvurularına devam et.</h1>
          <p className="mt-4 text-sm leading-6 text-white/72">
            Öğrenci hesabınla öğretmen arayabilir, öğretmen hesabınla gelen ders taleplerini yönetebilirsin.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <LoginForm next={next} />
        </div>
      </section>
    </main>
  );
}
