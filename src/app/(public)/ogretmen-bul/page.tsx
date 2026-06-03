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

export default async function TeacherSearchPage({ searchParams }: PageProps) {
  const rawParams = await searchParams;
  const params = pageSearchParamsFromRecord(rawParams);

  const response = searchTeachers({
    q: params.get("q") ?? undefined,
    lesson: params.get("lesson") ?? undefined,
    city: params.get("city") ?? undefined,
    district: params.get("district") ?? undefined,
    deliveryMode: (params.get("deliveryMode") as never) ?? "all",
    sort: (params.get("sort") as never) ?? "recommended",
    gender: (params.get("gender") as never) ?? "all",
    minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : undefined,
    maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : undefined,
    fastResponse: params.get("fastResponse") === "1",
    page: Number(params.get("page") ?? 1),
    pageSize: Number(params.get("pageSize") ?? 6),
    lat: params.get("lat") ? Number(params.get("lat")) : undefined,
    lng: params.get("lng") ? Number(params.get("lng")) : undefined,
  });

  return (
    <main>
      <section className="relative overflow-hidden bg-[#0a0f1e] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_0%,rgba(251,115,22,0.18),transparent)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Öğretmen Bul</p>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-balance lg:text-5xl">
            Özel ders öğretmeni bul, puana göre karşılaştır.
          </h1>
          <p className="max-w-xl text-sm leading-6 text-white/55">
            {response.meta.total > 0 ? `${response.meta.total} öğretmen listelendi.` : "Filtrelerinize uygun öğretmen bulunamadı."} Konum erişimine izin verirseniz yakındaki öğretmenleri mesafeye göre sıralayabilirsiniz.
          </p>
        </div>
      </section>
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8" style={{ background: "linear-gradient(180deg,#f8f9fe 0%,#f0f4ff 100%)" }}>
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
