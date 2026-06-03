"use client";

import { BoltIcon, LocateFixedIcon, SearchIcon } from "lucide-react";

import { cityOptions, districtOptions, lessonOptions } from "@/features/search/mock-data";
import { optionValue } from "@/features/search/utils";
import { useSearchFilterNavigation } from "@/features/search/use-search-filter-navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";

const priceRanges = [
  { label: "Tüm fiyatlar", min: undefined, max: undefined },
  { label: "₺0 – ₺500", min: 0, max: 500 },
  { label: "₺500 – ₺750", min: 500, max: 750 },
  { label: "₺750 – ₺1000", min: 750, max: 1000 },
  { label: "₺1000 – ₺1500", min: 1000, max: 1500 },
  { label: "₺1500+", min: 1500, max: undefined },
];

function priceRangeValue(min?: number, max?: number) {
  if (min === undefined && max === undefined) return "";
  return `${min ?? ""}-${max ?? ""}`;
}

function parsePriceRange(value: string) {
  if (!value) return { min: undefined, max: undefined };
  const [minStr, maxStr] = value.split("-");
  return {
    min: minStr ? Number(minStr) : undefined,
    max: maxStr ? Number(maxStr) : undefined,
  };
}

export function SearchFilters() {
  const { locationPending, searchParams, updateParam, updateParams, useCurrentLocation } =
    useSearchFilterNavigation();

  const currentMin = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const currentMax = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const currentPriceValue = priceRangeValue(currentMin, currentMax);
  const fastResponse = searchParams.get("fastResponse") === "1";
  const currentGender = searchParams.get("gender") ?? "all";

  function handlePriceChange(value: string) {
    const { min, max } = parsePriceRange(value);
    updateParams({
      minPrice: min !== undefined ? String(min) : null,
      maxPrice: max !== undefined ? String(max) : null,
    });
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-2xl shadow-slate-950/10 ring-1 ring-slate-200">
      {/* Üst satır: metin arama + ders + şehir + ara butonu */}
      <form action="/ogretmen-bul" className="grid gap-3 md:grid-cols-[1.2fr_1fr_1fr_auto]">
        <div className="relative">
          <SearchIcon aria-hidden="true" className="pointer-events-none absolute left-3 top-2.5 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={searchParams.get("q") ?? ""}
            placeholder="Ders, öğretmen veya şehir ara"
            className="h-10 border-slate-200 pl-9"
          />
        </div>
        <select
          name="lesson"
          defaultValue={searchParams.get("lesson") ?? ""}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-brand-navy"
        >
          <option value="">Tüm dersler</option>
          {lessonOptions.map((lesson) => (
            <option key={lesson} value={optionValue(lesson)}>
              {lesson}
            </option>
          ))}
        </select>
        <select
          name="city"
          defaultValue={searchParams.get("city") ?? ""}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-brand-navy"
        >
          <option value="">Tüm şehirler</option>
          {cityOptions.map((city) => (
            <option key={city} value={optionValue(city)}>
              {city}
            </option>
          ))}
        </select>
        <Button type="submit" className="h-10 bg-brand-orange text-white hover:bg-brand-orange/90">
          <SearchIcon data-icon="inline-start" aria-hidden="true" />
          Ara
        </Button>
      </form>

      {/* Alt satır 1: ilçe, ders türü, sıralama, konum */}
      <div className="mt-3 grid gap-3 md:grid-cols-4">
        <select
          value={searchParams.get("district") ?? ""}
          onChange={(e) => updateParam("district", e.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-brand-navy"
        >
          <option value="">Tüm ilçeler</option>
          {districtOptions.map((district) => (
            <option key={district} value={optionValue(district)}>
              {district}
            </option>
          ))}
        </select>
        <select
          value={searchParams.get("deliveryMode") ?? "all"}
          onChange={(e) => updateParam("deliveryMode", e.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-brand-navy"
        >
          <option value="all">Tüm ders türleri</option>
          <option value="online">Online</option>
          <option value="face_to_face">Yüz yüze</option>
        </select>
        <select
          value={searchParams.get("sort") ?? "recommended"}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-brand-navy"
        >
          <option value="recommended">Önerilen</option>
          <option value="nearest">Yakındaki</option>
          <option value="highest_rated">En yüksek puan</option>
          <option value="lowest_price">En düşük ücret</option>
          <option value="most_reviewed">En çok yorum</option>
        </select>
        <Button
          type="button"
          variant="outline"
          className="h-10 border-brand-navy/20 bg-white text-brand-navy hover:bg-brand-navy hover:text-white"
          onClick={useCurrentLocation}
          disabled={locationPending}
        >
          <LocateFixedIcon data-icon="inline-start" aria-hidden="true" />
          Konumumu Kullan
        </Button>
      </div>

      {/* Alt satır 2: cinsiyet, fiyat, hızlı yanıt */}
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        {/* Cinsiyet */}
        <div className="flex rounded-lg border border-slate-200 bg-white overflow-hidden text-sm">
          {[
            { value: "all", label: "Tümü" },
            { value: "female", label: "Kadın" },
            { value: "male", label: "Erkek" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateParam("gender", opt.value === "all" ? "" : opt.value)}
              className={cn(
                "px-3 py-1.5 transition-colors",
                currentGender === opt.value || (opt.value === "all" && !searchParams.get("gender"))
                  ? "bg-brand-navy text-white"
                  : "text-muted-foreground hover:bg-slate-50"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Fiyat aralığı */}
        <select
          value={currentPriceValue}
          onChange={(e) => handlePriceChange(e.target.value)}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-brand-navy"
        >
          {priceRanges.map((range) => (
            <option key={priceRangeValue(range.min, range.max)} value={priceRangeValue(range.min, range.max)}>
              {range.label}
            </option>
          ))}
        </select>

        {/* Hızlı yanıt toggle */}
        <button
          type="button"
          onClick={() => updateParam("fastResponse", fastResponse ? "" : "1")}
          className={cn(
            "flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm transition-colors",
            fastResponse
              ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
              : "border-slate-200 bg-white text-muted-foreground hover:bg-slate-50"
          )}
        >
          <BoltIcon className="size-3.5" aria-hidden="true" />
          Hızlı yanıt
        </button>
      </div>
    </div>
  );
}
