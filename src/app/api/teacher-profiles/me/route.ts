import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentAccount } from "@/features/auth/service";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

const updateTeacherProfileSchema = z.object({
  title: z.string().max(200, "Başlık 200 karakteri geçemez.").optional(),
  bio: z.string().max(2000, "Açıklama 2000 karakteri geçemez.").optional(),
  education: z.string().max(300, "Eğitim bilgisi 300 karakteri geçemez.").optional(),
  experienceYears: z.number().int().min(0).max(60).optional(),
  hourlyPrice: z.number().min(0, "Fiyat sıfırdan küçük olamaz."),
  deliveryMode: z.enum(["online", "face_to_face", "both"]),
});

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = updateTeacherProfileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Geçersiz bilgiler.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const account = await getCurrentAccount();

  if (!account) {
    return NextResponse.json({ message: "Giriş yapmalısın." }, { status: 401 });
  }

  if (account.role !== "teacher") {
    return NextResponse.json({ message: "Bu işlem yalnızca öğretmen hesapları için geçerlidir." }, { status: 403 });
  }

  const supabase = await createSupabaseServerClient();

  const { data: teacherProfile, error: fetchError } = await supabase
    .from("teacher_profiles")
    .select("id")
    .eq("profile_id", account.id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ message: fetchError.message }, { status: 500 });
  }

  if (!teacherProfile) {
    return NextResponse.json({ message: "Öğretmen profili bulunamadı." }, { status: 404 });
  }

  const { error: updateError } = await supabase
    .from("teacher_profiles")
    .update({
      title: parsed.data.title ?? null,
      bio: parsed.data.bio ?? null,
      education: parsed.data.education ?? null,
      experience_years: parsed.data.experienceYears ?? null,
      hourly_price: parsed.data.hourlyPrice,
      delivery_mode: parsed.data.deliveryMode,
    })
    .eq("id", teacherProfile.id);

  if (updateError) {
    return NextResponse.json({ message: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
