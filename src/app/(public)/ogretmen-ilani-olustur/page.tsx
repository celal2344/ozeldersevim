import { CheckCircle2Icon, GraduationCapIcon, ShieldCheckIcon } from "lucide-react";

import { teacherListingCreationMetadata } from "@/features/seo/constants";
import { teacherListingCreationSteps } from "@/features/teacher-eligibility/constants";
import { TeacherListingCreationForm } from "@/features/teacher-eligibility/teacher-listing-creation-form";

export { teacherListingCreationMetadata as metadata };

export default function TeacherListingCreationPage() {
  return (
    <main className="bg-slate-50">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_24%,rgba(251,115,22,0.28),transparent_28%)]" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold text-brand-orange">Öğretmen İlanı</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              İlan yayınlamadan önce öğretmenlik uygunluğunu doğrula.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/74">
              Bu adım mevcut öğretmen hesabı için çalışır. Testi geçen öğretmenler tek özel ders ilanını yayınlayabilir ve arama sonuçlarında görünmeye başlar.
            </p>
            <div className="mt-8 grid gap-3">
              {teacherListingCreationSteps.map(({ title, text }) => (
                <div key={title} className="flex gap-3 rounded-xl border border-white/12 bg-white/8 p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-orange text-white">
                    <CheckCircle2Icon aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="mt-1 text-sm text-white/64">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/12 bg-white/8 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-white p-4 text-brand-navy">
                  <GraduationCapIcon aria-hidden="true" className="text-brand-orange" />
                  <p className="mt-3 text-2xl font-bold">10</p>
                  <p className="text-xs text-muted-foreground">Sabit soru</p>
                </div>
                <div className="rounded-xl bg-white p-4 text-brand-navy">
                  <ShieldCheckIcon aria-hidden="true" className="text-brand-orange" />
                  <p className="mt-3 text-2xl font-bold">70+</p>
                  <p className="text-xs text-muted-foreground">Geçme puanı</p>
                </div>
                <div className="rounded-xl bg-white p-4 text-brand-navy">
                  <CheckCircle2Icon aria-hidden="true" className="text-brand-orange" />
                  <p className="mt-3 text-2xl font-bold">Yayın</p>
                  <p className="text-xs text-muted-foreground">Başarılı testten sonra</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/12 bg-brand-navy-muted p-5 text-sm leading-6 text-white/72">
              Başarısız denemeler kaydedilmez. Başarılı sonuç, ilan yayınlandığında öğretmen hesabına bağlanır.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <TeacherListingCreationForm />
      </section>
    </main>
  );
}
