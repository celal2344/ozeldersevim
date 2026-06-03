import Link from "next/link";
import { redirect } from "next/navigation";
import { GraduationCapIcon, SearchIcon } from "lucide-react";

import { RegisterForm } from "@/features/auth/register-form";
import { getCurrentAccount } from "@/features/auth/service";
import { defaultLoginRedirectForRole, safeNextPath } from "@/features/auth/utils";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

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
  "Aracı kurum olmadan kazan",
  "Online veya yüz yüze ders ver",
];

const studentBenefits = [
  "Yüzlerce öğretmen arasından seç",
  "Ders talebi gönder, öğretmen seni bulsun",
  "Online veya yüz yüze ders al",
  "Tamamen ücretsiz kayıt",
];

export default async function RegisterPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const next = safeNextPath(Array.isArray(params.next) ? params.next[0] : params.next);
  const roleParam = Array.isArray(params.role) ? params.role[0] : params.role;
  const account = await getCurrentAccount();

  if (account) {
    redirect(next ?? defaultLoginRedirectForRole(account.role));
  }

  // Eğer rol seçilmişse direkt formu göster
  if (roleParam === "teacher" || roleParam === "student") {
    const roleHref = (r: string) =>
      next ? `/kayit?role=${r}&next=${encodeURIComponent(next)}` : `/kayit?role=${r}`;

    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-6 text-center">
            <p className="text-2xl font-bold text-brand-navy">
              {roleParam === "teacher" ? "Öğretmen Hesabı Oluştur" : "Öğrenci Hesabı Oluştur"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tamamen ücretsiz, hemen başla.
            </p>
          </div>

          <div className="mb-4 flex rounded-xl border border-slate-200 bg-white p-1">
            {[
              { role: "student", label: "Öğrenci" },
              { role: "teacher", label: "Öğretmen" },
            ].map((opt) => (
              <Link
                key={opt.role}
                href={roleHref(opt.role)}
                className={`flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors ${
                  roleParam === opt.role
                    ? "bg-brand-orange text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </Link>
            ))}
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <RegisterForm initialRole={roleParam} next={next} />
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Hesabın var mı?{" "}
            <Link href={next ? `/giris?next=${encodeURIComponent(next)}` : "/giris"} className="font-medium text-brand-orange hover:underline">
              Giriş yap
            </Link>
          </p>
        </div>
      </main>
    );
  }

  // Rol seçilmemişse hub sayfasını göster
  const roleHref = (role: string) =>
    next ? `/kayit?role=${role}&next=${encodeURIComponent(next)}` : `/kayit?role=${role}`;

  return (
    <main className="bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p className="text-3xl font-bold text-brand-navy">ÖzelDersEvim'e Katıl</p>
          <p className="mt-2 text-muted-foreground">Tamamen ücretsiz. Hemen başla.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Öğretmen Kartı */}
          <Card className="flex flex-col border-2 border-transparent transition-colors hover:border-brand-orange/40">
            <CardHeader className="pb-3">
              <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-brand-orange/10">
                <GraduationCapIcon className="size-6 text-brand-orange" aria-hidden="true" />
              </div>
              <CardTitle className="text-xl text-brand-navy">Öğretmen Ol</CardTitle>
              <p className="text-sm text-muted-foreground">
                Kendi ilanını oluştur, öğrenci bul ve bağımsız çalış.
              </p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <ul className="flex flex-col gap-2">
                {teacherBenefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-foreground/80">
                    <span className="size-1.5 shrink-0 rounded-full bg-brand-orange" />
                    {b}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-auto h-11 w-full bg-brand-navy text-white hover:bg-brand-navy/90"
                nativeButton={false}
                render={<Link href={roleHref("teacher")} />}
              >
                Öğretmen Hesabı Aç
              </Button>
            </CardContent>
          </Card>

          {/* Öğrenci Kartı */}
          <Card className="flex flex-col border-2 border-transparent transition-colors hover:border-brand-orange/40">
            <CardHeader className="pb-3">
              <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-brand-orange/10">
                <SearchIcon className="size-6 text-brand-orange" aria-hidden="true" />
              </div>
              <CardTitle className="text-xl text-brand-navy">Öğrenci Ol</CardTitle>
              <p className="text-sm text-muted-foreground">
                Öğretmen bul, ders talebi gönder, hemen başla.
              </p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <ul className="flex flex-col gap-2">
                {studentBenefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-foreground/80">
                    <span className="size-1.5 shrink-0 rounded-full bg-brand-orange" />
                    {b}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-auto h-11 w-full bg-brand-orange text-white hover:bg-brand-orange/90"
                nativeButton={false}
                render={<Link href={roleHref("student")} />}
              >
                Öğrenci Hesabı Aç
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Zaten hesabın var mı?{" "}
          <Link href={next ? `/giris?next=${encodeURIComponent(next)}` : "/giris"} className="font-medium text-brand-orange hover:underline">
            Giriş yap
          </Link>
        </p>
      </div>
    </main>
  );
}
