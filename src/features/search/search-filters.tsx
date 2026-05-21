"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LocateFixedIcon, SearchIcon } from "lucide-react";
import { useState } from "react";

import { cityOptions, districtOptions, lessonOptions } from "@/features/search/mock-data";
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

function optionValue(value: string) {
  return value.toLocaleLowerCase("tr-TR");
}

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [locationPending, setLocationPending] = useState(false);

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams);
    params.delete("page");

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/ogretmen-bul?${params.toString()}`);
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) return;

    setLocationPending(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const params = new URLSearchParams(searchParams);
        params.set("lat", position.coords.latitude.toFixed(6));
        params.set("lng", position.coords.longitude.toFixed(6));
        params.set("sort", "nearest");
        params.delete("page");
        router.push(`/ogretmen-bul?${params.toString()}`);
        setLocationPending(false);
      },
      () => setLocationPending(false),
      { enableHighAccuracy: false, timeout: 7000 }
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <form action="/ogretmen-bul" className="grid gap-3 md:grid-cols-[1.2fr_1fr_1fr_auto]">
        <div className="relative">
          <SearchIcon aria-hidden="true" className="pointer-events-none absolute left-3 top-2.5 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={searchParams.get("q") ?? ""}
            placeholder="Ders, öğretmen veya şehir ara"
            className="pl-9"
          />
        </div>
        <select
          name="lesson"
          defaultValue={searchParams.get("lesson") ?? ""}
          className="h-8 rounded-lg border border-input bg-background px-3 text-sm"
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
          className="h-8 rounded-lg border border-input bg-background px-3 text-sm"
        >
          <option value="">Tüm şehirler</option>
          {cityOptions.map((city) => (
            <option key={city} value={optionValue(city)}>
              {city}
            </option>
          ))}
        </select>
        <Button type="submit">
          <SearchIcon data-icon="inline-start" aria-hidden="true" />
          Ara
        </Button>
      </form>
      <div className="mt-3 grid gap-3 md:grid-cols-4">
        <select
          value={searchParams.get("district") ?? ""}
          onChange={(event) => updateParam("district", event.target.value)}
          className="h-8 rounded-lg border border-input bg-background px-3 text-sm"
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
          <SelectTrigger className="w-full">
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
          <SelectTrigger className="w-full">
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
        <Button type="button" variant="outline" onClick={useCurrentLocation} disabled={locationPending}>
          <LocateFixedIcon data-icon="inline-start" aria-hidden="true" />
          Konumumu Kullan
        </Button>
      </div>
    </div>
  );
}
