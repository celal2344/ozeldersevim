import { getTeacherEligibilityState } from "@/features/teacher-eligibility/service";
import type {
  LessonCategoryOption,
  LocationOption,
  TeacherListing,
  TeacherListingInput,
  TeacherListingResource,
} from "@/features/teacher-listings/types";
import { listingShortBio, slugifyTurkish } from "@/features/teacher-listings/utils";
import { createSupabaseServiceRoleClient } from "@/shared/db/supabase/admin";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

export class TeacherListingError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

const missingListing: TeacherListing = {
  status: "missing",
  slug: null,
  title: "",
  bio: "",
  education: "",
  experienceYears: 0,
  hourlyPrice: 0,
  deliveryMode: "both",
  locationSlug: "",
  lessonSlugs: [],
  updatedAt: null,
};

export async function getLessonCategoryOptions(): Promise<LessonCategoryOption[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("lesson_categories")
    .select("name,slug")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    throw new TeacherListingError(error.message, 500);
  }

  return (data ?? []).map((category) => ({
    slug: category.slug,
    name: category.name,
  }));
}

export async function getLocationOptions(): Promise<LocationOption[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("locations")
    .select("city,district,slug")
    .order("city", { ascending: true })
    .order("district", { ascending: true });

  if (error) {
    throw new TeacherListingError(error.message, 500);
  }

  return (data ?? []).map((location) => ({
    slug: location.slug,
    city: location.city,
    district: location.district,
  }));
}

export async function getTeacherListingResource(profileId: string): Promise<TeacherListingResource> {
  const [eligibility, listing] = await Promise.all([
    getTeacherEligibilityState(profileId),
    getTeacherListing(profileId),
  ]);

  return { eligibility, listing };
}

export async function saveTeacherListing(profileId: string, input: TeacherListingInput): Promise<TeacherListingResource> {
  const supabase = await createSupabaseServerClient();
  const eligibility = await getTeacherEligibilityState(profileId);
  if (eligibility.status !== "passed") {
    throw new TeacherListingError("İlan oluşturmak için önce öğretmenlik testini geçmelisin.", 409);
  }

  const uniqueLessonSlugs = [...new Set(input.lessonSlugs)];
  const { data: location, error: locationError } = await supabase
    .from("locations")
    .select("id,city,district,latitude,longitude,slug")
    .eq("slug", input.locationSlug)
    .maybeSingle();

  if (locationError) {
    throw new TeacherListingError(locationError.message, 500);
  }

  if (!location) {
    throw new TeacherListingError("Konum bulunamadı.", 404);
  }

  const { data: categories, error: categoryError } = await supabase
    .from("lesson_categories")
    .select("id,name,slug")
    .in("slug", uniqueLessonSlugs)
    .eq("is_active", true);

  if (categoryError) {
    throw new TeacherListingError(categoryError.message, 500);
  }

  if ((categories ?? []).length !== uniqueLessonSlugs.length) {
    throw new TeacherListingError("Seçilen derslerden biri bulunamadı.", 404);
  }

  const { data: existingProfile, error: existingProfileError } = await supabase
    .from("teacher_profiles")
    .select("id,status")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (existingProfileError) {
    throw new TeacherListingError(existingProfileError.message, 500);
  }

  if (existingProfile?.status === "suspended") {
    throw new TeacherListingError("Askıya alınmış ilan öğretmen tarafından güncellenemez.", 409);
  }

  const teacherProfilePayload = {
    profile_id: profileId,
    location_id: location.id,
    title: input.title,
    bio: input.bio,
    education: input.education,
    experience_years: input.experienceYears,
    hourly_price: input.hourlyPrice,
    delivery_mode: input.deliveryMode,
    status: input.status,
    latitude: location.latitude,
    longitude: location.longitude,
  };

  const teacherProfileId = existingProfile
    ? await updateTeacherProfile(existingProfile.id, teacherProfilePayload)
    : await insertTeacherProfile(teacherProfilePayload);

  const lessonRows = (categories ?? []).map((category) => ({
    teacher_profile_id: teacherProfileId,
    lesson_category_id: category.id,
  }));

  const { error: deleteLessonsError } = await supabase
    .from("teacher_lessons")
    .delete()
    .eq("teacher_profile_id", teacherProfileId);

  if (deleteLessonsError) {
    throw new TeacherListingError(deleteLessonsError.message, 500);
  }

  const { error: insertLessonsError } = await supabase.from("teacher_lessons").insert(lessonRows);

  if (insertLessonsError) {
    throw new TeacherListingError(insertLessonsError.message, 500);
  }

  const { data: existingListing, error: existingListingError } = await supabase
    .from("teacher_listings")
    .select("id,slug")
    .eq("teacher_profile_id", teacherProfileId)
    .maybeSingle();

  if (existingListingError) {
    throw new TeacherListingError(existingListingError.message, 500);
  }

  const listingPayload = {
    teacher_profile_id: teacherProfileId,
    slug:
      existingListing?.slug ??
      (await createUniqueTeacherSlug(profileId, input.title, categories?.[0]?.slug ?? "ders", location.city)),
    headline: input.title,
    short_bio: listingShortBio(input.bio),
    is_published: input.status === "published",
  };

  if (existingListing) {
    const { error: updateListingError } = await supabase
      .from("teacher_listings")
      .update(listingPayload)
      .eq("id", existingListing.id);

    if (updateListingError) {
      throw new TeacherListingError(updateListingError.message, 500);
    }
  } else {
    const { error: insertListingError } = await supabase.from("teacher_listings").insert(listingPayload);

    if (insertListingError) {
      throw new TeacherListingError(insertListingError.message, 500);
    }
  }

  return getTeacherListingResource(profileId);
}

async function getTeacherListing(profileId: string): Promise<TeacherListing> {
  const supabase = await createSupabaseServerClient();
  const { data: teacherProfile, error: profileError } = await supabase
    .from("teacher_profiles")
    .select("id,location_id,title,bio,education,experience_years,hourly_price,delivery_mode,status,updated_at")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (profileError) {
    throw new TeacherListingError(profileError.message, 500);
  }

  if (!teacherProfile) {
    return missingListing;
  }

  const [{ data: location, error: locationError }, { data: listing, error: listingError }, lessons] =
    await Promise.all([
      supabase.from("locations").select("slug").eq("id", teacherProfile.location_id).maybeSingle(),
      supabase
        .from("teacher_listings")
        .select("slug,updated_at")
        .eq("teacher_profile_id", teacherProfile.id)
        .maybeSingle(),
      getTeacherLessonSlugs(teacherProfile.id),
    ]);

  if (locationError) {
    throw new TeacherListingError(locationError.message, 500);
  }

  if (listingError) {
    throw new TeacherListingError(listingError.message, 500);
  }

  return {
    status: teacherProfile.status,
    slug: listing?.slug ?? null,
    title: teacherProfile.title ?? "",
    bio: teacherProfile.bio ?? "",
    education: teacherProfile.education ?? "",
    experienceYears: teacherProfile.experience_years ?? 0,
    hourlyPrice: Number(teacherProfile.hourly_price),
    deliveryMode: teacherProfile.delivery_mode,
    locationSlug: location?.slug ?? "",
    lessonSlugs: lessons,
    updatedAt: listing?.updated_at ?? teacherProfile.updated_at,
  };
}

async function getTeacherLessonSlugs(teacherProfileId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: lessonRows, error: lessonError } = await supabase
    .from("teacher_lessons")
    .select("lesson_category_id")
    .eq("teacher_profile_id", teacherProfileId);

  if (lessonError) {
    throw new TeacherListingError(lessonError.message, 500);
  }

  const lessonCategoryIds = (lessonRows ?? []).map((row) => row.lesson_category_id);

  if (!lessonCategoryIds.length) {
    return [];
  }

  const { data: categories, error: categoryError } = await supabase
    .from("lesson_categories")
    .select("slug")
    .in("id", lessonCategoryIds);

  if (categoryError) {
    throw new TeacherListingError(categoryError.message, 500);
  }

  return (categories ?? []).map((category) => category.slug);
}

async function insertTeacherProfile(payload: {
  profile_id: string;
  location_id: string;
  title: string;
  bio: string;
  education: string;
  experience_years: number;
  hourly_price: number;
  delivery_mode: "online" | "face_to_face" | "both";
  status: "draft" | "published";
  latitude: number | null;
  longitude: number | null;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("teacher_profiles").insert(payload).select("id").single();

  if (error) {
    throw new TeacherListingError(error.message, 500);
  }

  return data.id;
}

async function updateTeacherProfile(
  id: string,
  payload: {
    location_id: string;
    title: string;
    bio: string;
    education: string;
    experience_years: number;
    hourly_price: number;
    delivery_mode: "online" | "face_to_face" | "both";
    status: "draft" | "published";
    latitude: number | null;
    longitude: number | null;
  }
) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("teacher_profiles").update(payload).eq("id", id).select("id").single();

  if (error) {
    throw new TeacherListingError(error.message, 500);
  }

  return data.id;
}

async function createUniqueTeacherSlug(profileId: string, title: string, lessonSlug: string, city: string) {
  const admin = createSupabaseServiceRoleClient();
  const baseSlug = slugifyTurkish(`${title}-${lessonSlug}-${city}`) || slugifyTurkish(`${profileId}-${lessonSlug}`);
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    const { data, error } = await admin
      .from("teacher_listings")
      .select("teacher_profile_id")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      throw new TeacherListingError(error.message, 500);
    }

    if (!data) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}
