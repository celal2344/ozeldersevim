import type { SupabaseClient } from "@supabase/supabase-js";

import { teacherProfileSeed } from "@/features/teachers/constants";
import type { TeacherProfile } from "@/features/teachers/types";
import { publicEnv } from "@/shared/config/env";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

type TeacherListingRow = {
  teacher_profile_id: string;
  slug: string;
  headline: string;
  short_bio: string | null;
  rating_average: number | string;
  review_count: number;
};

type TeacherProfileRow = {
  id: string;
  profile_id: string;
  location_id: string;
  title: string | null;
  bio: string | null;
  education: string | null;
  experience_years: number | null;
  hourly_price: number | string;
  delivery_mode: TeacherProfile["deliveryMode"];
  latitude: number | null;
  longitude: number | null;
};

type ProfileRow = {
  full_name: string;
};

type LocationRow = {
  city: string;
  district: string | null;
  latitude: number | null;
  longitude: number | null;
};

type TeacherLessonRow = {
  lesson_category_id: string;
};

type LessonCategoryRow = {
  id: string;
  name: string;
};

export async function getTeacherProfileBySlug(slug: string): Promise<TeacherProfile | null> {
  const seedTeacher = getSeedTeacherProfileBySlug(slug);

  if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL || !publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return seedTeacher;
  }

  const supabaseTeacher = await getSupabaseTeacherProfileBySlug(slug).catch(() => null);
  return supabaseTeacher ?? seedTeacher;
}

export function getTeacherProfileSlugs() {
  return teacherProfileSeed.map((teacher) => teacher.slug);
}

export async function getPublishedTeacherProfiles(): Promise<TeacherProfile[]> {
  if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL || !publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return teacherProfileSeed;
  }

  const supabaseTeachers = await getSupabasePublishedTeacherProfiles().catch(() => []);
  return supabaseTeachers.length > 0 ? supabaseTeachers : teacherProfileSeed;
}

function getSeedTeacherProfileBySlug(slug: string) {
  return teacherProfileSeed.find((teacher) => teacher.slug === slug) ?? null;
}

async function getSupabaseTeacherProfileBySlug(slug: string): Promise<TeacherProfile | null> {
  const supabase = await createSupabaseServerClient();
  const { data: listing, error: listingError } = await supabase
    .from("teacher_listings")
    .select("teacher_profile_id,slug,headline,short_bio,rating_average,review_count")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (listingError || !listing) {
    return null;
  }

  return getSupabaseTeacherProfileFromListing(supabase, listing as TeacherListingRow);
}

async function getSupabasePublishedTeacherProfiles(): Promise<TeacherProfile[]> {
  const supabase = await createSupabaseServerClient();
  const { data: listings, error } = await supabase
    .from("teacher_listings")
    .select("teacher_profile_id,slug,headline,short_bio,rating_average,review_count")
    .eq("is_published", true);

  if (error || !listings) {
    return [];
  }

  const teachers = await Promise.all(
    (listings as TeacherListingRow[]).map((listing) =>
      getSupabaseTeacherProfileFromListing(supabase, listing)
    )
  );

  return teachers.filter((teacher): teacher is TeacherProfile => Boolean(teacher));
}

async function getSupabaseTeacherProfileFromListing(
  supabase: SupabaseClient,
  listingRow: TeacherListingRow
): Promise<TeacherProfile | null> {
  const { data: teacherProfile, error: teacherProfileError } = await supabase
    .from("teacher_profiles")
    .select("id,profile_id,location_id,title,bio,education,experience_years,hourly_price,delivery_mode,latitude,longitude")
    .eq("id", listingRow.teacher_profile_id)
    .eq("status", "published")
    .maybeSingle();

  if (teacherProfileError || !teacherProfile) {
    return null;
  }

  const teacherProfileRow = teacherProfile as TeacherProfileRow;
  const [{ data: profile }, { data: location }, lessons] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", teacherProfileRow.profile_id).maybeSingle(),
    supabase.from("locations").select("city,district,latitude,longitude").eq("id", teacherProfileRow.location_id).maybeSingle(),
    getTeacherLessonNames(supabase, teacherProfileRow.id),
  ]);

  if (!profile || !location) {
    return null;
  }

  const profileRow = profile as ProfileRow;
  const locationRow = location as LocationRow;

  return {
    id: teacherProfileRow.id,
    slug: listingRow.slug,
    fullName: profileRow.full_name,
    title: teacherProfileRow.title ?? listingRow.headline,
    headline: listingRow.headline,
    shortBio: listingRow.short_bio ?? teacherProfileRow.bio ?? "",
    longBio: teacherProfileRow.bio ?? listingRow.short_bio ?? "",
    city: locationRow.city,
    district: locationRow.district ?? "",
    latitude: teacherProfileRow.latitude ?? locationRow.latitude ?? 0,
    longitude: teacherProfileRow.longitude ?? locationRow.longitude ?? 0,
    lessons,
    deliveryMode: teacherProfileRow.delivery_mode,
    hourlyPrice: Number(teacherProfileRow.hourly_price),
    lessonDurationMinutes: 60,
    ratingAverage: Number(listingRow.rating_average),
    reviewCount: listingRow.review_count,
    experienceYears: teacherProfileRow.experience_years ?? 0,
    education: teacherProfileRow.education ?? "Belirtilmedi",
    responseTime: "Yeni öğretmen",
    activeStudentCount: 0,
    completedLessonCount: 0,
    isVerified: false,
    reviews: [],
  };
}

async function getTeacherLessonNames(supabase: SupabaseClient, teacherProfileId: string) {
  const { data: teacherLessons, error: teacherLessonsError } = await supabase
    .from("teacher_lessons")
    .select("lesson_category_id")
    .eq("teacher_profile_id", teacherProfileId);

  if (teacherLessonsError || !teacherLessons?.length) {
    return [];
  }

  const categoryIds = (teacherLessons as TeacherLessonRow[]).map((lesson) => lesson.lesson_category_id);
  const { data: categories, error: categoriesError } = await supabase
    .from("lesson_categories")
    .select("id,name")
    .in("id", categoryIds)
    .eq("is_active", true);

  if (categoriesError || !categories) {
    return [];
  }

  const categoriesById = new Map(
    (categories as LessonCategoryRow[]).map((category) => [category.id, category.name])
  );

  return categoryIds
    .map((categoryId) => categoriesById.get(categoryId))
    .filter((name): name is string => Boolean(name));
}
