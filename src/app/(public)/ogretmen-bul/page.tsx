import Link from "next/link";

import { teacherSearchMetadata } from "@/features/seo/constants";
import { SearchFilters } from "@/features/search/search-filters";
import { pageSearchParamsFromRecord, searchPageHref } from "@/features/search/utils";
import { searchTeachers } from "@/features/search/search-service";
import { TeacherResultCard } from "@/features/search/teacher-result-card";
import { Button } from "@/shared/components/ui/button";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export { teacherSearchMetadata as metadata };
export const dynamic = "force-dynamic";

export default async function TeacherSearchPage({ searchParams }: PageProps) {
  const rawParams = await searchParams;
  const params = pageSearchParamsFromRecord(rawParams);

  const response = await searchTeachers({
    q: params.get("q") ?? undefined,
    lesson: params.get("lesson") ?? undefined,
    city: params.get("city") ?? undefined,
    district: params.get("district") ?? undefined,
    deliveryMode: (params.get("deliveryMode") as never) ?? "all",
    sort: (params.get("sort") as never) ?? "recommended",
    page: Number(params.get("page") ?? 1),
    pageSize: Number(params.get("pageSize") ?? 6),
    lat: params.get("lat") ? Number(params.get("lat")) : undefined,
    lng: params.get("lng") ? Number(params.get("lng")) : undefined,
  });

  return (
    <main className="bg-slate-50">
      <section className="relative overflow-hidden border-b border-white/10 bg-brand-navy text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(251,115,22,0.26),transparent_26%)]" />
        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm text-brand-orange">Öğretmen Bul</p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-balance">
            Özel ders öğretmenlerini ders, konum ve puana göre ara.
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-white/72">
            {response.meta.total} öğretmen bulundu. Konum izni verirsen yakındaki öğretmenleri mesafeye göre sıralayabilirsin.
          </p>
        </div>
      </section>
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <SearchFilters />
        {response.data.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {response.data.map((teacher) => (
              <TeacherResultCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-brand-navy">Sonuç bulunamadı</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Filtreleri azaltarak, yakın ilçeleri veya online ders seçeneğini deneyebilirsin.
            </p>
          </div>
        )}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            className="border-brand-navy/20 bg-white text-brand-navy hover:bg-brand-navy hover:text-white"
            disabled={response.meta.page <= 1}
            nativeButton={false}
            render={<Link href={searchPageHref(params, Math.max(1, response.meta.page - 1))} />}
          >
            Önceki
          </Button>
          <span className="text-sm text-muted-foreground">
            Sayfa {response.meta.page} / {response.meta.totalPages}
          </span>
          <Button
            variant="outline"
            className="border-brand-navy/20 bg-white text-brand-navy hover:bg-brand-navy hover:text-white"
            disabled={response.meta.page >= response.meta.totalPages}
            nativeButton={false}
            render={<Link href={searchPageHref(params, Math.min(response.meta.totalPages, response.meta.page + 1))} />}
          >
            Sonraki
          </Button>
        </div>
      </section>
    </main>
  );
}
