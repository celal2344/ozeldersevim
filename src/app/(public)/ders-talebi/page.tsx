import { AlertCircleIcon, ArrowLeftIcon, MapPinIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentAccount } from "@/features/auth/service";
import { panelPathForRole, registerPathWithNext } from "@/features/auth/utils";
import { LessonRequestForm } from "@/features/requests/lesson-request-form";
import { lessonRequestMetadata } from "@/features/seo/constants";
import { getTeacherProfileBySlug } from "@/features/teachers/service";
import { teacherDeliveryLabel, teacherRatingLabel } from "@/features/teachers/utils";
import { Button } from "@/shared/components/ui/button";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export { lessonRequestMetadata as metadata };
export const dynamic = "force-dynamic";

export default async function LessonRequestPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const teacherSlug = Array.isArray(params.teacher) ? params.teacher[0] : params.teacher;
  const nextPath = teacherSlug ? `/ders-talebi?teacher=${encodeURIComponent(teacherSlug)}` : "/ders-talebi";
  const account = await getCurrentAccount();

  if (!account) {
    redirect(registerPathWithNext(nextPath));
  }

  if (account.role !== "student") {
    redirect(panelPathForRole(account.role));
  }

  const teacher = teacherSlug ? await getTeacherProfileBySlug(teacherSlug) : null;

  if (!teacher) {
    return (
      <main className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex size-12 items-center justify-center rounded-full bg-brand-orange text-white">
            <AlertCircleIcon aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-3xl font-bold text-brand-navy">Öğretmen seçimi gerekli</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Ders talebi oluşturmak için önce bir öğretmen profili seçmelisin.
          </p>
          <Button
            className="mt-6 bg-brand-orange text-white hover:bg-brand-orange/90"
            nativeButton={false}
            render={<Link href="/ogretmen-bul" />}
          >
            Öğretmen Bul
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50">
      <section className="bg-brand-navy text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            className="w-fit border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            nativeButton={false}
            render={<Link href={`/ogretmen/${teacher.slug}`} />}
          >
            <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
            Profiline dön
          </Button>
          <div>
            <p className="text-sm text-brand-orange">Ders Talebi</p>
            <h1 className="mt-2 max-w-4xl text-4xl font-bold tracking-tight text-balance">
              {teacher.fullName} için özel ders talebi oluştur
            </h1>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-white/72">
            <span className="inline-flex items-center gap-2">
              <MapPinIcon aria-hidden="true" className="text-brand-orange" />
              {teacher.city} / {teacher.district}
            </span>
            <span>{teacherDeliveryLabel(teacher.deliveryMode)}</span>
            <span className="inline-flex items-center gap-2">
              <StarIcon aria-hidden="true" className="text-brand-orange" />
              {teacherRatingLabel(teacher)}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <LessonRequestForm
          accountContact={{
            fullName: account.fullName,
            email: account.email ?? "",
            phone: account.phone ?? "",
          }}
          teacher={teacher}
        />
        <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-brand-navy">Talep akışı</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <p>Önce ders ihtiyacını ve tercihlerini girersin.</p>
            <p>İletişim bilgilerin hesabından otomatik gelir; istersen bu talep için güncelleyebilirsin.</p>
            <p>Öğretmen talebi kabul edince iletişim bilgilerin öğretmene açılır.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
