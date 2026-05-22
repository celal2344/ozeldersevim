"use client";

import { LocateFixedIcon, SearchIcon } from "lucide-react";

import { cityOptions, districtOptions, lessonOptions } from "@/features/search/mock-data";
import { optionValue } from "@/features/search/utils";
import { useSearchFilterNavigation } from "@/features/search/use-search-filter-navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export function SearchFilters() {
  const { locationPending, searchParams, updateParam, useCurrentLocation } =
    useSearchFilterNavigation();

  return (
    <div className="rounded-2xl bg-white p-5 shadow-2xl shadow-slate-950/10 ring-1 ring-slate-200">
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
      <div className="mt-3 grid gap-3 md:grid-cols-4">
        <select
          value={searchParams.get("district") ?? ""}
          onChange={(event) => updateParam("district", event.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-brand-navy"
        >
          <option value="">Tüm ilçeler</option>
          {districtOptions.map((district) => (
            <option key={district} value={optionValue(district)}>
              {district}
            </option>
          ))}
        </select>
        <Select
          value={searchParams.get("deliveryMode") ?? "all"}
          onValueChange={(value) => updateParam("deliveryMode", value)}
        >
          <SelectTrigger className="h-10 w-full border-slate-200 bg-white text-brand-navy">
            <SelectValue placeholder="Ders türü" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Tüm ders türleri</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="face_to_face">Yüz yüze</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={searchParams.get("sort") ?? "recommended"} onValueChange={(value) => updateParam("sort", value)}>
          <SelectTrigger className="h-10 w-full border-slate-200 bg-white text-brand-navy">
            <SelectValue placeholder="Sıralama" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="recommended">Önerilen</SelectItem>
              <SelectItem value="nearest">Yakındaki</SelectItem>
              <SelectItem value="highest_rated">En yüksek puan</SelectItem>
              <SelectItem value="lowest_price">En düşük ücret</SelectItem>
              <SelectItem value="most_reviewed">En çok yorum</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
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
    </div>
  );
}
