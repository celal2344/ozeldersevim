"use client";

import { BoltIcon, ChevronDownIcon, LocateFixedIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import { useState } from "react";

import {
  deliveryFilterOptions,
  genderFilterOptions,
  priceFilterOptions,
  sortFilterOptions,
} from "@/features/search/constants";
import { endHourOptions, hourOptions, weekdayOptions } from "@/features/availability/constants";
import type { TeacherSearchFilterOptions } from "@/features/search/search-service";
import { currentPriceOption, optionValue, parsePriceRange } from "@/features/search/utils";
import { useSearchFilterNavigation } from "@/features/search/use-search-filter-navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { PremiumSelect } from "@/shared/components/ui/premium-select";
import { cn } from "@/shared/lib/utils";

export function SearchFilters({ lessonOptions, cityOptions, districtOptions }: TeacherSearchFilterOptions) {
  const { locationPending, searchParams, updateParam, updateParams, useCurrentLocation } = useSearchFilterNavigation();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const lessonSelectOptions = [
    { value: "", label: "Tüm dersler" },
    ...lessonOptions.map((lesson) => ({ value: optionValue(lesson), label: lesson })),
  ];
  const citySelectOptions = [
    { value: "", label: "Tüm şehirler" },
    ...cityOptions.map((city) => ({ value: optionValue(city), label: city })),
  ];
  const districtSelectOptions = [
    { value: "", label: "Tüm ilçeler" },
    ...districtOptions.map((district) => ({ value: optionValue(district), label: district })),
  ];
  const currentMin = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const currentMax = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const fastResponse = searchParams.get("fastResponse") === "1";
  const currentGender = searchParams.get("gender") ?? "all";
  const availabilityWeekdayOptions = [{ value: "", label: "Tüm günler" }, ...weekdayOptions];
  const availabilityStartOptions = [{ value: "", label: "Başlangıç" }, ...hourOptions];
  const availabilityEndOptions = [{ value: "", label: "Bitiş" }, ...endHourOptions];
  const hasAdvancedFilters = Boolean(
    searchParams.get("district") ||
      (searchParams.get("deliveryMode") && searchParams.get("deliveryMode") !== "all") ||
      (searchParams.get("sort") && searchParams.get("sort") !== "recommended") ||
      searchParams.get("gender") ||
      searchParams.get("minPrice") ||
      searchParams.get("fastResponse") ||
      searchParams.get("availabilityWeekday")
  );

  function handlePriceChange(value: string) {
    const { min, max } = parsePriceRange(value);
    updateParams({ minPrice: min !== undefined ? String(min) : null, maxPrice: max !== undefined ? String(max) : null });
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60">
      <div className="p-4 sm:p-5">
        <form action="/ogretmen-bul" className="flex flex-col gap-3">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              name="q"
              defaultValue={searchParams.get("q") ?? ""}
              placeholder="Ders, öğretmen veya şehir ara"
              className="h-11 border-slate-200 pl-9 text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <PremiumSelect value={searchParams.get("lesson") ?? ""} onChange={(value) => updateParam("lesson", value)} options={lessonSelectOptions} />
            <PremiumSelect value={searchParams.get("city") ?? ""} onChange={(value) => updateParam("city", value)} options={citySelectOptions} />
          </div>

          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-orange text-sm font-bold text-white shadow-md shadow-orange-200 transition-all hover:scale-[1.01] hover:bg-orange-400"
          >
            <SearchIcon className="size-4" aria-hidden="true" />
            Öğretmen Ara
          </button>
        </form>

        <button
          type="button"
          onClick={() => setAdvancedOpen((value) => !value)}
          className={cn(
            "mt-3 flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition-all md:hidden",
            hasAdvancedFilters || advancedOpen
              ? "border-brand-orange/30 bg-brand-orange/8 text-brand-orange"
              : "border-slate-200 bg-slate-50 text-muted-foreground hover:bg-slate-100"
          )}
        >
          <SlidersHorizontalIcon className="size-3.5" aria-hidden="true" />
          Gelişmiş Filtreler
          {hasAdvancedFilters ? <span className="size-1.5 rounded-full bg-brand-orange" /> : null}
          <ChevronDownIcon className={cn("size-3.5 transition-transform", advancedOpen && "rotate-180")} aria-hidden="true" />
        </button>
      </div>

      <div className={cn("border-t border-slate-100 p-4 sm:p-5 md:block", advancedOpen ? "block" : "hidden")}>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <PremiumSelect value={searchParams.get("district") ?? ""} onChange={(value) => updateParam("district", value)} options={districtSelectOptions} />
          <PremiumSelect value={searchParams.get("deliveryMode") ?? "all"} onChange={(value) => updateParam("deliveryMode", value)} options={deliveryFilterOptions} />
          <PremiumSelect value={searchParams.get("sort") ?? "recommended"} onChange={(value) => updateParam("sort", value)} options={sortFilterOptions} />
          <Button
            type="button"
            variant="outline"
            className="col-span-2 h-10 border-slate-200 text-brand-navy hover:bg-brand-navy hover:text-white md:col-span-1"
            onClick={useCurrentLocation}
            disabled={locationPending}
          >
            <LocateFixedIcon data-icon="inline-start" aria-hidden="true" />
            Konumumu Kullan
          </Button>
        </div>

        <div className="mt-3 grid gap-2 border-t border-slate-100 pt-3 md:grid-cols-3">
          <PremiumSelect
            value={searchParams.get("availabilityWeekday") ?? ""}
            onChange={(value) => updateParam("availabilityWeekday", value)}
            options={availabilityWeekdayOptions}
          />
          <PremiumSelect
            value={searchParams.get("availabilityStartHour") ?? ""}
            onChange={(value) => updateParam("availabilityStartHour", value)}
            options={availabilityStartOptions}
          />
          <PremiumSelect
            value={searchParams.get("availabilityEndHour") ?? ""}
            onChange={(value) => updateParam("availabilityEndHour", value)}
            options={availabilityEndOptions}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-0.5">
            {genderFilterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateParam("gender", option.value === "all" ? "" : option.value)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  currentGender === option.value || (option.value === "all" && !searchParams.get("gender"))
                    ? "bg-brand-navy text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <PremiumSelect value={currentPriceOption(currentMin, currentMax)} onChange={handlePriceChange} options={priceFilterOptions} className="h-9 min-w-[130px]" />
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
    </div>
  );
}
