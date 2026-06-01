import { redirect } from "next/navigation";

import { RegisterForm } from "@/features/auth/register-form";
import { getCurrentAccount } from "@/features/auth/service";
import { defaultLoginRedirectForRole, safeNextPath } from "@/features/auth/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: "Kayıt Ol | ÖzelDersEvim",
  description: "Öğrenci veya öğretmen hesabı oluştur.",
};

export default async function RegisterPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const next = safeNextPath(Array.isArray(params.next) ? params.next[0] : params.next);
  const roleParam = Array.isArray(params.role) ? params.role[0] : params.role;
  const initialRole = roleParam === "teacher" ? "teacher" : "student";
  const account = await getCurrentAccount();

  if (account) {
    redirect(next ?? defaultLoginRedirectForRole(account.role));
  }

  return (
    <main className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="rounded-2xl bg-brand-navy p-8 text-white shadow-sm">
          <p className="text-sm font-semibold text-brand-orange">Kayıt Ol</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Özel ders hesabını oluştur.</h1>
          <p className="mt-4 text-sm leading-6 text-white/72">
            Öğrenciler öğretmen bulup ders talebi gönderebilir. Öğretmenler ise hesap açtıktan sonra ilan oluşturma
            adımında öğretmenlik testinden geçer.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <RegisterForm initialRole={initialRole} next={next} />
        </div>
      </section>
    </main>
  );
}
