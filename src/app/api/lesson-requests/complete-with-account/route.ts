import { NextResponse } from "next/server";

import { completeLessonRequestSchema } from "@/features/requests/constants";
import { deliveryModeAllowedForTeacher, lessonSlugFromName, optionalNumber } from "@/features/requests/utils";
import { getTeacherProfileBySlug } from "@/features/teachers/service";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = completeLessonRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Ders talebi bilgileri eksik veya hatalı.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const teacher = await getTeacherProfileBySlug(input.teacherSlug);

  if (!teacher) {
    return NextResponse.json({ message: "Öğretmen bulunamadı." }, { status: 404 });
  }

  if (!deliveryModeAllowedForTeacher(teacher, input.deliveryMode)) {
    return NextResponse.json({ message: "Seçilen öğretmen bu ders türünü vermiyor." }, { status: 400 });
  }

  if (!teacher.lessons.some((lesson) => lessonSlugFromName(lesson) === input.lessonSlug)) {
    return NextResponse.json({ message: "Seçilen öğretmen bu dersi vermiyor." }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.studentName,
          phone: input.phone,
          role: "student",
        },
      },
    });

    if (signUpError) {
      return NextResponse.json({ message: signUpError.message }, { status: 400 });
    }

    if (!signUpData.user || !signUpData.session) {
      return NextResponse.json(
        { message: "Bu MVP akışı için Supabase email doğrulaması kapalı olmalı." },
        { status: 409 }
      );
    }

    await supabase.auth.setSession({
      access_token: signUpData.session.access_token,
      refresh_token: signUpData.session.refresh_token,
    });

    const { data: teacherListing, error: teacherListingError } = await supabase
      .from("teacher_listings")
      .select("teacher_profile_id")
      .eq("slug", input.teacherSlug)
      .eq("is_published", true)
      .maybeSingle();

    if (teacherListingError) {
      return NextResponse.json({ message: teacherListingError.message }, { status: 500 });
    }

    if (!teacherListing) {
      return NextResponse.json({ message: "Öğretmen ilanı bulunamadı." }, { status: 404 });
    }

    const { data: lessonCategory, error: lessonError } = await supabase
      .from("lesson_categories")
      .select("id")
      .eq("slug", input.lessonSlug)
      .eq("is_active", true)
      .maybeSingle();

    if (lessonError) {
      return NextResponse.json({ message: lessonError.message }, { status: 500 });
    }

    if (!lessonCategory) {
      return NextResponse.json({ message: "Ders kategorisi bulunamadı." }, { status: 404 });
    }

    const { data: location, error: locationError } = await supabase
      .from("locations")
      .select("id")
      .eq("slug", input.locationSlug)
      .maybeSingle();

    if (locationError) {
      return NextResponse.json({ message: locationError.message }, { status: 500 });
    }

    if (!location) {
      return NextResponse.json({ message: "Konum bulunamadı." }, { status: 404 });
    }

    const profileError = await supabase.from("profiles").insert({
      id: signUpData.user.id,
      role: "student",
      full_name: input.studentName,
      phone: input.phone,
    });

    if (profileError.error) {
      return NextResponse.json({ message: profileError.error.message }, { status: 500 });
    }

    const studentProfileError = await supabase.from("student_profiles").insert({
      profile_id: signUpData.user.id,
    });

    if (studentProfileError.error) {
      return NextResponse.json({ message: studentProfileError.error.message }, { status: 500 });
    }

    const now = new Date().toISOString();
    const { data: lessonRequest, error: lessonRequestError } = await supabase
      .from("lesson_requests")
      .insert({
        student_profile_id: signUpData.user.id,
        teacher_profile_id: teacherListing.teacher_profile_id,
        lesson_category_id: lessonCategory.id,
        location_id: location.id,
        delivery_mode: input.deliveryMode,
        student_level: input.studentLevel,
        goal: input.goal,
        budget_min: optionalNumber(input.budgetMin),
        budget_max: optionalNumber(input.budgetMax),
        contact_preference: input.contactPreference,
        consent_terms_at: now,
        consent_privacy_at: now,
      })
      .select("id,status")
      .single();

    if (lessonRequestError) {
      return NextResponse.json({ message: lessonRequestError.message }, { status: 500 });
    }

    const contactError = await supabase.from("lesson_request_contacts").insert({
      lesson_request_id: lessonRequest.id,
      student_name: input.studentName,
      email: input.email,
      phone: input.phone,
    });

    if (contactError.error) {
      return NextResponse.json({ message: contactError.error.message }, { status: 500 });
    }

    return NextResponse.json({
      requestId: lessonRequest.id,
      studentProfileId: signUpData.user.id,
      status: lessonRequest.status,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Ders talebi oluşturulamadı." },
      { status: 500 }
    );
  }
}
