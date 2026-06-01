import type { TeacherProfile, TeacherProfileReview } from "@/features/teachers/types";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

type PublishedTeacherData = {
  profiles: TeacherProfile[];
  lessonSlugsByTeacherProfileId: Map<string, string[]>;
};

export async function getPublishedTeacherProfiles(): Promise<TeacherProfile[]> {
  const data = await getPublishedTeacherData();
  return data.profiles;
}

export async function getTeacherProfileBySlug(slug: string): Promise<TeacherProfile | null> {
  const data = await getPublishedTeacherData(slug);
  return data.profiles[0] ?? null;
}

export async function getTeacherProfileSlugs(): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("teacher_listings")
    .select("slug")
    .eq("is_published", true)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((listing) => listing.slug);
}

export async function getTeacherLessonSlugsBySlug(slug: string) {
  const data = await getPublishedTeacherData(slug);
  const teacher = data.profiles[0];

  if (!teacher) {
    return null;
  }

  return data.lessonSlugsByTeacherProfileId.get(teacher.id) ?? [];
}

async function getPublishedTeacherData(slug?: string): Promise<PublishedTeacherData> {
  const supabase = await createSupabaseServerClient();
  let listingQuery = supabase
    .from("teacher_listings")
    .select("id,teacher_profile_id,slug,headline,short_bio,rating_average,review_count,updated_at")
    .eq("is_published", true)
    .order("updated_at", { ascending: false });

  if (slug) {
    listingQuery = listingQuery.eq("slug", slug);
  }

  const { data: listings, error: listingError } = await listingQuery;

  if (listingError) {
    throw new Error(listingError.message);
  }

  const publishedListings = listings ?? [];

  if (!publishedListings.length) {
    return { profiles: [], lessonSlugsByTeacherProfileId: new Map() };
  }

  const teacherProfileIds = publishedListings.map((listing) => listing.teacher_profile_id);
  const { data: teacherProfiles, error: teacherProfileError } = await supabase
    .from("teacher_profiles")
    .select("id,profile_id,location_id,title,bio,education,experience_years,hourly_price,delivery_mode,latitude,longitude")
    .in("id", teacherProfileIds)
    .eq("status", "published");

  if (teacherProfileError) {
    throw new Error(teacherProfileError.message);
  }

  const teacherRows = teacherProfiles ?? [];
  const profileIds = teacherRows.map((teacher) => teacher.profile_id);
  const locationIds = teacherRows.map((teacher) => teacher.location_id);

  const [{ data: profiles, error: profileError }, { data: locations, error: locationError }] = await Promise.all([
    supabase.from("profiles").select("id,full_name").in("id", profileIds),
    supabase.from("locations").select("id,city,district,latitude,longitude").in("id", locationIds),
  ]);

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (locationError) {
    throw new Error(locationError.message);
  }

  const [lessonData, reviewsByTeacherProfileId] = await Promise.all([
    getLessonsForTeacherProfiles(teacherProfileIds),
    getReviewsForTeacherProfiles(teacherProfileIds),
  ]);

  const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
  const locationById = new Map((locations ?? []).map((location) => [location.id, location]));
  const listingByTeacherProfileId = new Map(publishedListings.map((listing) => [listing.teacher_profile_id, listing]));

  return {
    profiles: teacherRows
      .map<TeacherProfile | null>((teacher) => {
        const listing = listingByTeacherProfileId.get(teacher.id);
        const profile = profileById.get(teacher.profile_id);
        const location = locationById.get(teacher.location_id);

        if (!listing || !profile || !location) {
          return null;
        }

        const shortBio = listing.short_bio ?? teacher.bio ?? listing.headline;
        const longBio = teacher.bio ?? shortBio;

        return {
          id: teacher.id,
          slug: listing.slug,
          fullName: profile.full_name,
          title: teacher.title ?? listing.headline,
          headline: listing.headline,
          shortBio,
          longBio,
          city: location.city,
          district: location.district ?? "",
          latitude: teacher.latitude ?? location.latitude ?? 0,
          longitude: teacher.longitude ?? location.longitude ?? 0,
          lessons: lessonData.lessonNamesByTeacherProfileId.get(teacher.id) ?? [],
          deliveryMode: teacher.delivery_mode,
          hourlyPrice: Number(teacher.hourly_price),
          lessonDurationMinutes: 60,
          ratingAverage: Number(listing.rating_average),
          reviewCount: listing.review_count,
          experienceYears: teacher.experience_years ?? 0,
          education: teacher.education ?? "",
          responseTime: "Henüz ölçülmedi",
          activeStudentCount: 0,
          completedLessonCount: 0,
          isVerified: false,
          reviews: reviewsByTeacherProfileId.get(teacher.id) ?? [],
        };
      })
      .filter((teacher): teacher is TeacherProfile => teacher !== null),
    lessonSlugsByTeacherProfileId: lessonData.lessonSlugsByTeacherProfileId,
  };
}

async function getLessonsForTeacherProfiles(teacherProfileIds: string[]) {
  const supabase = await createSupabaseServerClient();
  const { data: teacherLessons, error: lessonError } = await supabase
    .from("teacher_lessons")
    .select("teacher_profile_id,lesson_category_id")
    .in("teacher_profile_id", teacherProfileIds);

  if (lessonError) {
    throw new Error(lessonError.message);
  }

  const categoryIds = [...new Set((teacherLessons ?? []).map((lesson) => lesson.lesson_category_id))];

  if (!categoryIds.length) {
    return {
      lessonNamesByTeacherProfileId: new Map<string, string[]>(),
      lessonSlugsByTeacherProfileId: new Map<string, string[]>(),
    };
  }

  const { data: categories, error: categoryError } = await supabase
    .from("lesson_categories")
    .select("id,name,slug")
    .in("id", categoryIds);

  if (categoryError) {
    throw new Error(categoryError.message);
  }

  const categoryById = new Map((categories ?? []).map((category) => [category.id, category]));
  const lessonNamesByTeacherProfileId = new Map<string, string[]>();
  const lessonSlugsByTeacherProfileId = new Map<string, string[]>();

  for (const lesson of teacherLessons ?? []) {
    const category = categoryById.get(lesson.lesson_category_id);

    if (!category) continue;

    lessonNamesByTeacherProfileId.set(lesson.teacher_profile_id, [
      ...(lessonNamesByTeacherProfileId.get(lesson.teacher_profile_id) ?? []),
      category.name,
    ]);
    lessonSlugsByTeacherProfileId.set(lesson.teacher_profile_id, [
      ...(lessonSlugsByTeacherProfileId.get(lesson.teacher_profile_id) ?? []),
      category.slug,
    ]);
  }

  return { lessonNamesByTeacherProfileId, lessonSlugsByTeacherProfileId };
}

async function getReviewsForTeacherProfiles(teacherProfileIds: string[]) {
  const supabase = await createSupabaseServerClient();
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("id,teacher_profile_id,rating,comment,created_at")
    .in("teacher_profile_id", teacherProfileIds)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const reviewsByTeacherProfileId = new Map<string, TeacherProfileReview[]>();

  for (const review of reviews ?? []) {
    reviewsByTeacherProfileId.set(review.teacher_profile_id, [
      ...(reviewsByTeacherProfileId.get(review.teacher_profile_id) ?? []),
      {
        id: review.id,
        studentName: "Öğrenci",
        rating: review.rating,
        comment: review.comment ?? "",
        createdAt: review.created_at,
      },
    ]);
  }

  return reviewsByTeacherProfileId;
}
