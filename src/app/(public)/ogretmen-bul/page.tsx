import type { Metadata } from "next";
import Link from "next/link";

import { SearchFilters } from "@/features/search/search-filters";
import { searchTeachers } from "@/features/search/search-service";
import { TeacherResultCard } from "@/features/search/teacher-result-card";
import { Button } from "@/shared/components/ui/button";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Öğretmen Bul",
  description: "Ders, şehir, ilçe, ücret ve ders türüne göre özel ders öğretmeni ara.",
};

function toValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TeacherSearchPage({ searchParams }: PageProps) {
  const rawParams = await searchParams;
  const params = new URLSearchParams();

  Object.entries(rawParams).forEach(([key, value]) => {
    const normalized = toValue(value);
    if (normalized) params.set(key, normalized);
  });

  const response = searchTeachers({
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

  function pageHref(page: number) {
    const nextParams = new URLSearchParams(params);
    nextParams.set("page", String(page));
    return `/ogretmen-bul?${nextParams.toString()}`;
  }

  return (
    <main className="bg-muted/30">
      <section className="border-b bg-primary text-primary-foreground">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm opacity-80">Öğretmen Bul</p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance">
            Özel ders öğretmenlerini ders, konum ve puana göre ara.
          </h1>
          <p className="max-w-2xl text-sm leading-6 opacity-80">
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
          <div className="rounded-lg border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold">Sonuç bulunamadı</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Filtreleri azaltarak, yakın ilçeleri veya online ders seçeneğini deneyebilirsin.
            </p>
          </div>
        )}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            disabled={response.meta.page <= 1}
            nativeButton={false}
            render={<Link href={pageHref(Math.max(1, response.meta.page - 1))} />}
          >
            Önceki
          </Button>
          <span className="text-sm text-muted-foreground">
            Sayfa {response.meta.page} / {response.meta.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={response.meta.page >= response.meta.totalPages}
            nativeButton={false}
            render={<Link href={pageHref(Math.min(response.meta.totalPages, response.meta.page + 1))} />}
          >
            Sonraki
          </Button>
        </div>
      </section>
    </main>
  );
}
