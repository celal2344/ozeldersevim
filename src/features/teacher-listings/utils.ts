import type { TeacherListing, TeacherListingInput } from "@/features/teacher-listings/types";
import type { FieldErrors } from "react-hook-form";

const turkishCharacterMap: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  I: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
};

export function slugifyTurkish(value: string) {
  return value
    .split("")
    .map((character) => turkishCharacterMap[character] ?? character)
    .join("")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function listingShortBio(bio: string) {
  const normalized = bio.trim().replace(/\s+/g, " ");
  return normalized.length > 180 ? `${normalized.slice(0, 177)}...` : normalized;
}

export function listingStatusLabel(status: TeacherListing["status"]) {
  if (status === "published") return "Yayında";
  if (status === "suspended") return "Askıya alınmış";
  if (status === "draft") return "Taslak";
  return "Henüz yok";
}

export function listingInputFromResource(listing: TeacherListing): TeacherListingInput {
  return {
    status: listing.status === "published" ? "published" : "draft",
    title: listing.title,
    bio: listing.bio,
    education: listing.education,
    experienceYears: listing.experienceYears,
    hourlyPrice: listing.hourlyPrice,
    deliveryMode: listing.deliveryMode,
    locationSlug: listing.locationSlug,
    lessonSlugs: listing.lessonSlugs,
  };
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "İstek tamamlanamadı.";
    throw new Error(message);
  }

  return payload as T;
}

export function firstListingFormError(errors: FieldErrors<TeacherListingInput>) {
  return (
    errors.title?.message ??
    errors.bio?.message ??
    errors.education?.message ??
    errors.experienceYears?.message ??
    errors.hourlyPrice?.message ??
    errors.deliveryMode?.message ??
    errors.locationSlug?.message ??
    errors.lessonSlugs?.message
  );
}
