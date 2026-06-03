"use client";

import { BoltIcon, LocateFixedIcon, SearchIcon } from "lucide-react";

import { cityOptions, districtOptions, lessonOptions } from "@/features/search/mock-data";
import { optionValue } from "@/features/search/utils";
import { useSearchFilterNavigation } from "@/features/search/use-search-filter-navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { PremiumSelect } from "@/shared/components/ui/premium-select";
import { cn } from "@/shared/lib/utils";

const lessonSelectOptions = [
  { value: "", label: "Tüm dersler" },
  ...lessonOptions.map((l) => ({ value: optionValue(l), label: l })),
];

const citySelectOptions = [
  { value: "", label: "Tüm şehirler" },
  ...cityOptions.map((c) => ({ value: optionValue(c), label: c })),
];

const districtSelectOptions = [
  { value: "", label: "Tüm ilçeler" },
  ...districtOptions.map((d) => ({ value: optionValue(d), label: d })),
];

const deliveryOptions = [
  { value: "all", label: "Tüm ders türleri" },
  { value: "online", label: "Online" },
  { value: "face_to_face", label: "Yüz yüze" },
];

const sortOptions = [
  { value: "recommended", label: "Önerilen" },
  { value: "nearest", label: "Yakındaki" },
  { value: "highest_rated", label: "En yüksek puan" },
  { value: "lowest_price", label: "En düşük ücret" },
  { value: "most_reviewed", label: "En çok yorum" },
];

const priceOptions = [
  { value: "", label: "Tüm fiyatlar" },
  { value: "0-500", label: "₺0 – ₺500" },
  { value: "500-750", label: "₺500 – ₺750" },
  { value: "750-1000", label: "₺750 – ₺1000" },
  { value: "1000-1500", label: "₺1000 – ₺1500" },
  { value: "1500-", label: "₺1500+" },
];

function parsePriceRange(value: string) {
  if (!value) return { min: undefined, max: undefined };
  const [minStr, maxStr] = value.split("-");
  return {
    min: minStr ? Number(minStr) : undefined,
    max: maxStr ? Number(maxStr) : undefined,
  };
}

function currentPriceOption(min?: number, max?: number) {
  if (min === undefined && max === undefined) return "";
  return `${min ?? ""}-${max ?? ""}`;
}

export function SearchFilters() {
  const { locationPending, searchParams, updateParam, updateParams, useCurrentLocation } =
    useSearchFilterNavigation();

  const currentMin = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const currentMax = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
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
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/60">
      {/* Üst satır */}
      <form action="/ogretmen-bul" className="grid gap-3 md:grid-cols-[1.2fr_1fr_1fr_auto]">
        <div className="relative">
          <SearchIcon aria-hidden="true" className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={searchParams.get("q") ?? ""}
            placeholder="Ders, öğretmen veya şehir ara"
            className="h-10 border-slate-200 pl-9"
          />
        </div>
        {/* Lesson — form GET param, use native for submit compatibility */}
        <PremiumSelect
          value={searchParams.get("lesson") ?? ""}
          onChange={(v) => updateParam("lesson", v)}
          options={lessonSelectOptions}
        />
        <PremiumSelect
          value={searchParams.get("city") ?? ""}
          onChange={(v) => updateParam("city", v)}
          options={citySelectOptions}
        />
        <Button type="submit" className="h-10 bg-brand-orange text-white hover:bg-brand-orange/90">
          <SearchIcon data-icon="inline-start" aria-hidden="true" />
          Ara
        </Button>
      </form>

      {/* Alt satır 1 */}
      <div className="mt-3 grid gap-3 md:grid-cols-4">
        <PremiumSelect
          value={searchParams.get("district") ?? ""}
          onChange={(v) => updateParam("district", v)}
          options={districtSelectOptions}
        />
        <PremiumSelect
          value={searchParams.get("deliveryMode") ?? "all"}
          onChange={(v) => updateParam("deliveryMode", v)}
          options={deliveryOptions}
        />
        <PremiumSelect
          value={searchParams.get("sort") ?? "recommended"}
          onChange={(v) => updateParam("sort", v)}
          options={sortOptions}
        />
        <Button
          type="button"
          variant="outline"
          className="h-10 border-slate-200 text-brand-navy hover:bg-brand-navy hover:text-white"
          onClick={useCurrentLocation}
          disabled={locationPending}
        >
          <LocateFixedIcon data-icon="inline-start" aria-hidden="true" />
          Konumumu Kullan
        </Button>
      </div>

      {/* Alt satır 2 */}
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        {/* Cinsiyet toggle */}
        <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-sm">
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
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                currentGender === opt.value || (opt.value === "all" && !searchParams.get("gender"))
                  ? "bg-brand-navy text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Fiyat */}
        <PremiumSelect
          value={currentPriceOption(currentMin, currentMax)}
          onChange={handlePriceChange}
          options={priceOptions}
          className="h-9 min-w-[140px]"
        />

        {/* Hızlı yanıt */}
        <button
          type="button"
          onClick={() => updateParam("fastResponse", fastResponse ? "" : "1")}
          className={cn(
            "flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-medium transition-all",
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
