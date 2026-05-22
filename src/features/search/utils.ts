import type { TeacherSearchResult } from "@/features/search/types";

export function optionValue(value: string) {
  return value.toLocaleLowerCase("tr-TR");
}

export function initialsFromTeacherName(fullName: string) {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export function reviewLabel(teacher: TeacherSearchResult) {
  return teacher.reviewCount > 0
    ? `${teacher.ratingAverage.toFixed(1)} (${teacher.reviewCount})`
    : "Yeni öğretmen";
}

export function distanceLabel(distanceKm: number) {
  return `${distanceKm.toFixed(1)} km yakında`;
}

export function firstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function searchPageHref(params: URLSearchParams, page: number) {
  const nextParams = new URLSearchParams(params);
  nextParams.set("page", String(page));
  return `/ogretmen-bul?${nextParams.toString()}`;
}

export function pageSearchParamsFromRecord(record: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  Object.entries(record).forEach(([key, value]) => {
    const normalized = firstSearchParam(value);
    if (normalized) params.set(key, normalized);
  });

  return params;
}
