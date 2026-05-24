import type { TeacherSearchParams, TeacherSearchResponse, TeacherSearchResult } from "./types";
import { getPublishedTeacherProfiles } from "@/features/teachers/service";
import { paginateItems, parsePaginationParams } from "@/shared/api/list-query";

const TEACHER_SEARCH_PAGE_SIZE = 6;

function normalize(value: string) {
  return value.toLocaleLowerCase("tr-TR").trim();
}

function toNumber(value: string | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function getDistanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const earthRadiusKm = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function parseTeacherSearchParams(searchParams: URLSearchParams): TeacherSearchParams {
  return {
    q: searchParams.get("q") ?? undefined,
    lesson: searchParams.get("lesson") ?? undefined,
    city: searchParams.get("city") ?? undefined,
    district: searchParams.get("district") ?? undefined,
    deliveryMode: (searchParams.get("deliveryMode") as TeacherSearchParams["deliveryMode"]) ?? "all",
    sort: (searchParams.get("sort") as TeacherSearchParams["sort"]) ?? "recommended",
    ...parsePaginationParams(searchParams, { pageSize: TEACHER_SEARCH_PAGE_SIZE }),
    lat: toNumber(searchParams.get("lat")),
    lng: toNumber(searchParams.get("lng")),
  };
}

export async function searchTeachers(params: TeacherSearchParams): Promise<TeacherSearchResponse> {
  const hasLocation = typeof params.lat === "number" && typeof params.lng === "number";
  const query = params.q ? normalize(params.q) : "";
  const lesson = params.lesson ? normalize(params.lesson) : "";
  const city = params.city ? normalize(params.city) : "";
  const district = params.district ? normalize(params.district) : "";
  const teachers = await getPublishedTeacherProfiles();
  const filtered = teachers
    .filter((teacher) => {
      const searchable = normalize(
        [teacher.fullName, teacher.headline, teacher.shortBio, teacher.city, teacher.district, ...teacher.lessons].join(" ")
      );

      if (query && !searchable.includes(query)) return false;
      if (lesson && !teacher.lessons.some((item) => normalize(item).includes(lesson))) return false;
      if (city && normalize(teacher.city) !== city) return false;
      if (district && normalize(teacher.district) !== district) return false;
      if (
        params.deliveryMode &&
        params.deliveryMode !== "all" &&
        teacher.deliveryMode !== params.deliveryMode &&
        teacher.deliveryMode !== "both"
      ) {
        return false;
      }

      return true;
    })
    .map<TeacherSearchResult>((teacher) => ({
      ...teacher,
      distanceKm: hasLocation
        ? getDistanceKm(
            { lat: params.lat as number, lng: params.lng as number },
            { lat: teacher.latitude, lng: teacher.longitude }
          )
        : undefined,
    }));

  filtered.sort((a, b) => {
    switch (params.sort) {
      case "nearest":
        return (a.distanceKm ?? Number.MAX_SAFE_INTEGER) - (b.distanceKm ?? Number.MAX_SAFE_INTEGER);
      case "highest_rated":
        return b.ratingAverage - a.ratingAverage || b.reviewCount - a.reviewCount;
      case "lowest_price":
        return a.hourlyPrice - b.hourlyPrice;
      case "most_reviewed":
        return b.reviewCount - a.reviewCount;
      default:
        return b.ratingAverage * 10 + b.reviewCount - (a.ratingAverage * 10 + a.reviewCount);
    }
  });

  return paginateItems(
    filtered,
    { page: params.page ?? 1, pageSize: params.pageSize ?? TEACHER_SEARCH_PAGE_SIZE },
    {
      sort: params.sort ?? "recommended",
      filters: {
        ...(params.q ? { q: params.q } : {}),
        ...(params.lesson ? { lesson: params.lesson } : {}),
        ...(params.city ? { city: params.city } : {}),
        ...(params.district ? { district: params.district } : {}),
        ...(params.deliveryMode && params.deliveryMode !== "all" ? { deliveryMode: params.deliveryMode } : {}),
      },
    }
  );
}
