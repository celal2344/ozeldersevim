"use client";

import { BoltIcon, ChevronDownIcon, LocateFixedIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import { useState } from "react";

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
  return { min: minStr ? Number(minStr) : undefined, max: maxStr ? Number(maxStr) : undefined };
}

function currentPriceOption(min?: number, max?: number) {
  if (min === undefined && max === undefined) return "";
  return `${min ?? ""}-${max ?? ""}`;
}

export function SearchFilters() {
  const { locationPending, searchParams, updateParam, updateParams, useCurrentLocation } = useSearchFilterNavigation();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const currentMin = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const currentMax = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const fastResponse = searchParams.get("fastResponse") === "1";
  const currentGender = searchParams.get("gender") ?? "all";

  function handlePriceChange(value: string) {
    const { min, max } = parsePriceRange(value);
    updateParams({ minPrice: min !== undefined ? String(min) : null, maxPrice: max !== undefined ? String(max) : null });
  }

  const hasAdvancedFilters = Boolean(searchParams.get("district") || (searchParams.get("deliveryMode") && searchParams.get("deliveryMode") !== "all") || (searchParams.get("sort") && searchParams.get("sort") !== "recommended") || searchParams.get("gender") || searchParams.get("minPrice") || searchParams.get("fastResponse"));

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60">
      {/* ── ANA ARAMA (her ekranda) ── */}
      <div className="p-4 sm:p-5">
        <form action="/ogretmen-bul" className="flex flex-col gap-3">
          {/* Arama input */}
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input name="q" defaultValue={searchParams.get("q") ?? ""} placeholder="Ders, öğretmen veya şehir ara" className="h-11 border-slate-200 pl-9 text-base" />
          </div>

          {/* Ders + Şehir 2 kolon */}
          <div className="grid grid-cols-2 gap-2">
            <PremiumSelect value={searchParams.get("lesson") ?? ""} onChange={(v) => updateParam("lesson", v)} options={lessonSelectOptions} />
            <PremiumSelect value={searchParams.get("city") ?? ""} onChange={(v) => updateParam("city", v)} options={citySelectOptions} />
          </div>

          {/* Ara butonu */}
          <button type="submit" className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-orange text-sm font-bold text-white shadow-md shadow-orange-200 transition-all hover:bg-orange-400 hover:scale-[1.01]">
            <SearchIcon className="size-4" aria-hidden="true" />
            Öğretmen Ara
          </button>
        </form>

        {/* Gelişmiş filtreler toggle (mobil) */}
        <button
          type="button"
          onClick={() => setAdvancedOpen((v) => !v)}
          className={cn(
            "mt-3 flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition-all md:hidden",
            hasAdvancedFilters || advancedOpen
              ? "border-brand-orange/30 bg-brand-orange/8 text-brand-orange"
              : "border-slate-200 bg-slate-50 text-muted-foreground hover:bg-slate-100"
          )}
        >
          <SlidersHorizontalIcon className="size-3.5" aria-hidden="true" />
          Gelişmiş Filtreler
          {hasAdvancedFilters && <span className="size-1.5 rounded-full bg-brand-orange" />}
          <ChevronDownIcon className={cn("size-3.5 transition-transform", advancedOpen && "rotate-180")} aria-hidden="true" />
        </button>
      </div>

      {/* ── GELİŞMİŞ FİLTRELER ── */}
      <div className={cn("border-t border-slate-100 p-4 sm:p-5", "md:block", advancedOpen ? "block" : "hidden")}>
        {/* Satır 1: ilçe + ders türü + sıralama + konum */}
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <PremiumSelect value={searchParams.get("district") ?? ""} onChange={(v) => updateParam("district", v)} options={districtSelectOptions} />
          <PremiumSelect value={searchParams.get("deliveryMode") ?? "all"} onChange={(v) => updateParam("deliveryMode", v)} options={deliveryOptions} />
          <PremiumSelect value={searchParams.get("sort") ?? "recommended"} onChange={(v) => updateParam("sort", v)} options={sortOptions} />
          <Button type="button" variant="outline" className="h-10 border-slate-200 text-brand-navy hover:bg-brand-navy hover:text-white col-span-2 md:col-span-1" onClick={useCurrentLocation} disabled={locationPending}>
            <LocateFixedIcon data-icon="inline-start" aria-hidden="true" />
            Konumumu Kullan
          </Button>
        </div>

        {/* Satır 2: cinsiyet + fiyat + hızlı yanıt */}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-0.5">
            {[{ value: "all", label: "Tümü" }, { value: "female", label: "Kadın" }, { value: "male", label: "Erkek" }].map((opt) => (
              <button key={opt.value} type="button" onClick={() => updateParam("gender", opt.value === "all" ? "" : opt.value)}
                className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-all", currentGender === opt.value || (opt.value === "all" && !searchParams.get("gender")) ? "bg-brand-navy text-white shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                {opt.label}
              </button>
            ))}
          </div>
          <PremiumSelect value={currentPriceOption(currentMin, currentMax)} onChange={handlePriceChange} options={priceOptions} className="h-9 min-w-[130px]" />
          <button type="button" onClick={() => updateParam("fastResponse", fastResponse ? "" : "1")}
            className={cn("flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-medium transition-all", fastResponse ? "border-brand-orange bg-brand-orange/10 text-brand-orange" : "border-slate-200 bg-white text-muted-foreground hover:bg-slate-50")}>
            <BoltIcon className="size-3.5" aria-hidden="true" />
            Hızlı yanıt
          </button>
        </div>
      </div>
    </div>
  );
}
