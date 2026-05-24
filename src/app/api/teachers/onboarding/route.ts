import { NextResponse } from "next/server";

import { teacherOnboardingApiSchema } from "@/features/teachers/onboarding-constants";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = teacherOnboardingApiSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Profil bilgileri eksik veya hatalı.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Giriş yapmalısınız." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "teacher") {
    return NextResponse.json({ message: "Bu işlem yalnızca öğretmen hesapları için geçerli." }, { status: 403 });
  }

  const hasPassed = await supabase
    .from("teacher_eligibility_attempts")
    .select("id")
    .eq("profile_id", user.id)
    .eq("status", "passed")
    .maybeSingle();

  if (!hasPassed.data) {
    return NextResponse.json(
      { message: "Profil oluşturmak için önce öğretmenlik uygunluk testini geçmelisiniz." },
      { status: 403 }
    );
  }

  const { data: existingProfile } = await supabase
    .from("teacher_profiles")
    .select("id")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (existingProfile) {
    return NextResponse.json({ message: "Zaten bir öğretmen profiliniz var." }, { status: 409 });
  }

  const { data: location } = await supabase
    .from("locations")
    .select("id")
    .eq("slug", parsed.data.locationSlug)
    .maybeSingle();

  if (!location) {
    return NextResponse.json({ message: "Seçilen konum bulunamadı." }, { status: 400 });
  }

  const { data: teacherProfile, error: profileError } = await supabase
    .from("teacher_profiles")
    .insert({
      profile_id: user.id,
      location_id: location.id,
      title: parsed.data.title,
      bio: parsed.data.bio,
      education: parsed.data.education,
      experience_years: Number(parsed.data.experienceYears),
      hourly_price: Number(parsed.data.hourlyPrice),
      delivery_mode: parsed.data.deliveryMode,
      status: parsed.data.publishNow ? "published" : "draft",
    })
    .select("id")
    .single();

  if (profileError) {
    return NextResponse.json({ message: profileError.message }, { status: 500 });
  }

  const { data: categories } = await supabase
    .from("lesson_categories")
    .select("id, slug")
    .in("slug", parsed.data.lessonSlugs)
    .eq("is_active", true);

  if (categories && categories.length > 0) {
    await supabase.from("teacher_lessons").insert(
      categories.map((cat) => ({
        teacher_profile_id: teacherProfile.id,
        lesson_category_id: cat.id,
      }))
    );
  }

  const nameSlug = toSlug(profile.full_name);
  const firstLessonSlug = parsed.data.lessonSlugs[0] ?? "ders";
  const locationPart = parsed.data.locationSlug.split("-")[0] ?? "turkiye";
  const baseSlug = `${nameSlug}-${firstLessonSlug}-${locationPart}`;

  const { data: existingSlug } = await supabase
    .from("teacher_listings")
    .select("slug")
    .eq("slug", baseSlug)
    .maybeSingle();

  const finalSlug = existingSlug
    ? `${baseSlug}-${Date.now().toString(36)}`
    : baseSlug;

  const { data: listing, error: listingError } = await supabase
    .from("teacher_listings")
    .insert({
      teacher_profile_id: teacherProfile.id,
      slug: finalSlug,
      headline: parsed.data.title,
      short_bio: parsed.data.bio.slice(0, 160),
      is_published: parsed.data.publishNow,
    })
    .select("slug")
    .single();

  if (listingError) {
    return NextResponse.json({ message: listingError.message }, { status: 500 });
  }

  return NextResponse.json({
    teacherProfileId: teacherProfile.id,
    listingSlug: listing.slug,
    status: parsed.data.publishNow ? "published" : "draft",
  });
}
