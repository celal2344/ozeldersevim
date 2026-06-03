import { ArrowRightIcon, CheckCircle2Icon, Clock3Icon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";

import { teacherOnboardingMetadata } from "@/features/seo/constants";
import { Button } from "@/shared/components/ui/button";

export { teacherOnboardingMetadata as metadata };

export default function TeacherOnboardingHoldingPage() {
  return (
    <main className="bg-slate-50">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(251,115,22,0.3),transparent_30%)]" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold text-brand-orange">Öğretmen Ol</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Önce öğretmen hesabını oluştur.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/74">
              Öğretmen hesabı açmak için uygunluk testi gerekmez. Ders ilanı oluşturma adımında öğretmenlik testi
              gösterilecek ve sadece testi geçen öğretmenler ilan yayınlayabilecek.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="bg-brand-orange text-white hover:bg-brand-orange/90" nativeButton={false} render={<Link href="/kayit?role=teacher" />}>
                Öğretmen Hesabı Aç
                <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
              </Button>
              <Button variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white" nativeButton={false} render={<Link href="/giris" />}>
                Giriş Yap
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/12 bg-white/8 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-white p-4 text-brand-navy">
                  <CheckCircle2Icon aria-hidden="true" className="text-brand-orange" />
                  <p className="mt-3 text-2xl font-bold">Hesap</p>
                  <p className="text-xs text-muted-foreground">Testten bağımsız</p>
                </div>
                <div className="rounded-xl bg-white p-4 text-brand-navy">
                  <ShieldCheckIcon aria-hidden="true" className="text-brand-orange" />
                  <p className="mt-3 text-2xl font-bold">Test</p>
                  <p className="text-xs text-muted-foreground">İlan aşamasında</p>
                </div>
                <div className="rounded-xl bg-white p-4 text-brand-navy">
                  <Clock3Icon aria-hidden="true" className="text-brand-orange" />
                  <p className="mt-3 text-2xl font-bold">Sırada</p>
                  <p className="text-xs text-muted-foreground">İlan oluşturma</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/12 bg-brand-navy-muted p-5 text-sm leading-6 text-white/72">
              Hesabını oluşturduktan sonra öğretmen paneline yönlendirileceksin. İlan oluşturma adımında kısa bir
              uygunluk testi seni bekleyecek.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
