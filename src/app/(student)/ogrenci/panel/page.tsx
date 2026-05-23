import Link from "next/link";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/features/auth/logout-button";
import { getCurrentAccount } from "@/features/auth/service";
import { loginPathWithNext, panelPathForRole } from "@/features/auth/utils";
import { Button } from "@/shared/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Öğrenci Paneli | ÖzelDersEvim",
};

export default async function StudentPanelPage() {
  const account = await getCurrentAccount();

  if (!account) redirect(loginPathWithNext("/ogrenci/panel"));
  if (account.role !== "student") redirect(panelPathForRole(account.role));

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold text-brand-orange">Öğrenci Paneli</p>
        <h1 className="mt-2 text-3xl font-bold text-brand-navy">Merhaba, {account.fullName}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Ders taleplerin ve kabul edilen derslerin dashboard temeli sonraki branch içinde genişletilecek.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button className="bg-brand-orange text-white hover:bg-brand-orange/90" nativeButton={false} render={<Link href="/ogretmen-bul" />}>
            Öğretmen Bul
          </Button>
          <LogoutButton />
        </div>
      </section>
    </main>
  );
}
