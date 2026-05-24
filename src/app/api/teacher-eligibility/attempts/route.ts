import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/shared/db/supabase/server";

export async function POST() {
  const supabase = await createSupabaseServerClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Giriş yapmalısınız." }, { status: 401 });
  }

  const { data: activeTest, error: testError } = await supabase
    .from("teacher_eligibility_tests")
    .select("id")
    .eq("is_active", true)
    .maybeSingle();

  if (testError) {
    return NextResponse.json({ message: testError.message }, { status: 500 });
  }

  if (!activeTest) {
    return NextResponse.json({ message: "Aktif test bulunamadı." }, { status: 404 });
  }

  const { data: attempt, error: attemptError } = await supabase
    .from("teacher_eligibility_attempts")
    .insert({
      profile_id: user.id,
      test_id: activeTest.id,
      status: "started",
    })
    .select("id")
    .single();

  if (attemptError) {
    return NextResponse.json({ message: attemptError.message }, { status: 500 });
  }

  return NextResponse.json({ attemptId: attempt.id });
}
