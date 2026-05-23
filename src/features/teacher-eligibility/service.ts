import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  TeacherListingCreationPayload,
  TeacherListingCreationServiceResult,
  TeacherRegistrationPayload,
  TeacherRegistrationServiceResult,
} from "@/features/teacher-eligibility/types";
import {
  scoreTeacherEligibilityAnswers,
  teacherListingShortBio,
  teacherListingSlug,
  teacherListingSlugFallback,
} from "@/features/teacher-eligibility/utils";
import { createSupabaseAdminClient } from "@/shared/db/supabase/admin";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

type ActiveTeacherEligibilityTest = {
  id: string;
  passing_score: number;
  question_count: number;
};

type TeacherAccountProfile = {
  id: string;
  role: "student" | "teacher" | "admin";
  full_name: string;
};

type OnboardingLocation = {
  id: string;
  city: string;
  district: string | null;
  latitude: number | null;
  longitude: number | null;
  slug: string;
};

type OnboardingLesson = {
  id: string;
  name: string;
  slug: string;
};

type ListingInsert = {
  teacher_profile_id: string;
  headline: string;
  short_bio: string;
  rating_average: number;
  review_count: number;
  is_published: boolean;
};

export async function registerTeacherAccount(
  input: TeacherRegistrationPayload
): Promise<TeacherRegistrationServiceResult> {
  const supabase = await createSupabaseServerClient();
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        full_name: input.fullName,
        phone: input.phone,
        role: "teacher",
      },
    },
  });

  if (signUpError) {
    return { ok: false, status: 400, message: signUpError.message };
  }

  if (!signUpData.user || !signUpData.session) {
    return {
      ok: false,
      status: 409,
      message: "Bu MVP akışı için Supabase email doğrulaması kapalı olmalı.",
    };
  }

  const { error: sessionError } = await supabase.auth.setSession({
    access_token: signUpData.session.access_token,
    refresh_token: signUpData.session.refresh_token,
  });

  if (sessionError) {
    return { ok: false, status: 500, message: sessionError.message };
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: signUpData.user.id,
    role: "teacher",
    full_name: input.fullName,
    phone: input.phone,
  });

  if (profileError) {
    return { ok: false, status: 500, message: profileError.message };
  }

  return {
    ok: true,
    data: {
      profileId: signUpData.user.id,
      role: "teacher",
      status: "registered",
    },
  };
}

export async function createTeacherListing(
  input: TeacherListingCreationPayload
): Promise<TeacherListingCreationServiceResult> {
  const eligibilityResult = scoreTeacherEligibilityAnswers(input.eligibilityAnswers);

  if (!eligibilityResult.passed) {
    return {
      ok: false,
      status: 400,
      message: "Özel ders ilanı oluşturmak için uygunluk testini geçmelisin.",
    };
  }

  const sessionClient = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await sessionClient.auth.getUser();

  if (userError || !user) {
    return { ok: false, status: 401, message: "İlan oluşturmak için öğretmen hesabıyla giriş yapmalısın." };
  }

  const { data: profile, error: profileReadError } = await sessionClient
    .from("profiles")
    .select("id,role,full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profileReadError) {
    return { ok: false, status: 500, message: profileReadError.message };
  }

  if (!profile || (profile as TeacherAccountProfile).role !== "teacher") {
    return { ok: false, status: 403, message: "Bu işlem için öğretmen hesabı gerekir." };
  }

  const teacherAccount = profile as TeacherAccountProfile;
  const admin = createSupabaseAdminClient();
  const existingProfile = await getExistingTeacherProfile(admin, user.id);

  if (!existingProfile.ok) {
    return existingProfile;
  }

  if (existingProfile.data) {
    return { ok: false, status: 409, message: "Bu öğretmen hesabı için zaten bir ilan var." };
  }

  const activeTest = await getActiveTeacherEligibilityTest(admin);

  if (!activeTest.ok) {
    return activeTest;
  }

  if (eligibilityResult.score < activeTest.data.passing_score) {
    return {
      ok: false,
      status: 400,
      message: "Özel ders ilanı oluşturmak için uygunluk testini geçmelisin.",
    };
  }

  const location = await getOnboardingLocation(admin, input.locationSlug);

  if (!location.ok) {
    return location;
  }

  const lessons = await getOnboardingLessons(admin, input.lessonSlugs);

  if (!lessons.ok) {
    return lessons;
  }

  const { error: attemptError } = await admin.from("teacher_eligibility_attempts").insert({
    profile_id: user.id,
    test_id: activeTest.data.id,
    status: "passed",
    score: eligibilityResult.score,
    submitted_at: new Date().toISOString(),
  });

  if (attemptError) {
    return { ok: false, status: 500, message: attemptError.message };
  }

  const { data: teacherProfile, error: teacherProfileError } = await admin
    .from("teacher_profiles")
    .insert({
      profile_id: user.id,
      location_id: location.data.id,
      title: input.title,
      bio: input.bio,
      education: input.education,
      experience_years: input.experienceYears,
      hourly_price: input.hourlyPrice,
      delivery_mode: input.deliveryMode,
      status: "published",
      latitude: location.data.latitude,
      longitude: location.data.longitude,
    })
    .select("id")
    .single();

  if (teacherProfileError) {
    return { ok: false, status: 500, message: teacherProfileError.message };
  }

  const lessonInsert = lessons.data.map((lesson) => ({
    teacher_profile_id: teacherProfile.id,
    lesson_category_id: lesson.id,
  }));
  const { error: teacherLessonsError } = await admin.from("teacher_lessons").insert(lessonInsert);

  if (teacherLessonsError) {
    return { ok: false, status: 500, message: teacherLessonsError.message };
  }

  const primaryLesson = lessons.data.find((lesson) => lesson.slug === input.lessonSlugs[0]) ?? lessons.data[0];
  const listingSlugBase = teacherListingSlug([teacherAccount.full_name, primaryLesson.name, location.data.city]);
  const listingResult = await insertTeacherListing(admin, listingSlugBase, user.id, {
    teacher_profile_id: teacherProfile.id,
    headline: input.title,
    short_bio: teacherListingShortBio(input.bio),
    rating_average: 0,
    review_count: 0,
    is_published: true,
  });

  if (!listingResult.ok) {
    return listingResult;
  }

  return {
    ok: true,
    data: {
      teacherProfileId: teacherProfile.id,
      listingSlug: listingResult.data.slug,
      status: "published",
    },
  };
}

async function getExistingTeacherProfile(
  supabase: SupabaseClient,
  profileId: string
): Promise<
  | { ok: true; data: { id: string } | null }
  | { ok: false; status: number; message: string }
> {
  const { data, error } = await supabase
    .from("teacher_profiles")
    .select("id")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) {
    return { ok: false, status: 500, message: error.message };
  }

  return { ok: true, data: data as { id: string } | null };
}

async function getActiveTeacherEligibilityTest(
  supabase: SupabaseClient
): Promise<
  | { ok: true; data: ActiveTeacherEligibilityTest }
  | { ok: false; status: number; message: string }
> {
  const { data, error } = await supabase
    .from("teacher_eligibility_tests")
    .select("id,passing_score,question_count")
    .eq("is_active", true)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return { ok: false, status: 500, message: error.message };
  }

  if (!data) {
    return { ok: false, status: 404, message: "Aktif öğretmenlik testi bulunamadı." };
  }

  return { ok: true, data: data as ActiveTeacherEligibilityTest };
}

async function getOnboardingLocation(
  supabase: SupabaseClient,
  locationSlug: string
): Promise<
  | { ok: true; data: OnboardingLocation }
  | { ok: false; status: number; message: string }
> {
  const { data, error } = await supabase
    .from("locations")
    .select("id,city,district,latitude,longitude,slug")
    .eq("slug", locationSlug)
    .maybeSingle();

  if (error) {
    return { ok: false, status: 500, message: error.message };
  }

  if (!data) {
    return { ok: false, status: 404, message: "Konum bulunamadı." };
  }

  return { ok: true, data: data as OnboardingLocation };
}

async function getOnboardingLessons(
  supabase: SupabaseClient,
  lessonSlugs: string[]
): Promise<
  | { ok: true; data: OnboardingLesson[] }
  | { ok: false; status: number; message: string }
> {
  const { data, error } = await supabase
    .from("lesson_categories")
    .select("id,name,slug")
    .in("slug", lessonSlugs)
    .eq("is_active", true);

  if (error) {
    return { ok: false, status: 500, message: error.message };
  }

  if (!data || data.length !== lessonSlugs.length) {
    return { ok: false, status: 404, message: "Seçilen derslerden en az biri bulunamadı." };
  }

  const lessons = data as OnboardingLesson[];
  return {
    ok: true,
    data: lessonSlugs
      .map((slug) => lessons.find((lesson) => lesson.slug === slug))
      .filter((lesson): lesson is OnboardingLesson => Boolean(lesson)),
  };
}

async function insertTeacherListing(
  supabase: SupabaseClient,
  baseSlug: string,
  userId: string,
  listing: ListingInsert
): Promise<
  | { ok: true; data: { slug: string } }
  | { ok: false; status: number; message: string }
> {
  const candidates = [baseSlug, teacherListingSlugFallback(baseSlug, userId)];
  let lastConflictMessage = "Öğretmen ilanı slug değeri zaten kullanılıyor.";

  for (const slug of candidates) {
    const { data, error } = await supabase
      .from("teacher_listings")
      .insert({
        ...listing,
        slug,
      })
      .select("slug")
      .single();

    if (!error) {
      return { ok: true, data: data as { slug: string } };
    }

    if (error.code !== "23505") {
      return { ok: false, status: 500, message: error.message };
    }

    lastConflictMessage = error.message;
  }

  return { ok: false, status: 409, message: lastConflictMessage };
}
