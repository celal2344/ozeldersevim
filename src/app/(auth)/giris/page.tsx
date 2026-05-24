import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "Giriş Yap | ÖzelDersEvim",
};

export default async function GirisPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-2xl font-bold text-brand-navy">Giriş Yap</h1>
      <p className="mt-2 text-sm text-muted-foreground">Hesabınıza giriş yapın.</p>
      <div className="mt-8">
        <LoginForm redirectTo={redirect} />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Hesabın yok mu?{" "}
        <Link href="/kayit" className="font-medium text-brand-orange hover:underline">
          Kayıt Ol
        </Link>
      </p>
    </div>
  );
}
