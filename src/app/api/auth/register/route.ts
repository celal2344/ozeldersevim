import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServerClient } from "@/shared/db/supabase/server";

const registerSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(["student", "teacher"]),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Kayıt bilgileri eksik veya hatalı.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { fullName, phone, email, password, role } = parsed.data;
  const supabase = await createSupabaseServerClient();

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, phone, role } },
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

  const { error: profileError } = await supabase.from("profiles").insert({
    id: signUpData.user.id,
    role,
    full_name: fullName,
    phone,
  });

  if (profileError) {
    return NextResponse.json({ message: profileError.message }, { status: 500 });
  }

  if (role === "student") {
    const { error: studentError } = await supabase.from("student_profiles").insert({
      profile_id: signUpData.user.id,
    });

    if (studentError) {
      return NextResponse.json({ message: studentError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ userId: signUpData.user.id, role });
}
