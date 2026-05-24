import { NextResponse } from "next/server";

import {
  ELIGIBILITY_PASSING_SCORE,
  eligibilityQuestions,
  submitEligibilitySchema,
} from "@/features/teacher-eligibility/constants";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = submitEligibilitySchema.safeParse({ ...body, attemptId: id });

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Cevaplar eksik veya hatalı.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { attemptId, answers } = parsed.data;
  const supabase = await createSupabaseServerClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Giriş yapmalısınız." }, { status: 401 });
  }

  const { data: attempt, error: attemptError } = await supabase
    .from("teacher_eligibility_attempts")
    .select("id, profile_id, status")
    .eq("id", attemptId)
    .eq("profile_id", user.id)
    .maybeSingle();

  if (attemptError) {
    return NextResponse.json({ message: attemptError.message }, { status: 500 });
  }

  if (!attempt) {
    return NextResponse.json({ message: "Deneme bulunamadı." }, { status: 404 });
  }

  if (attempt.status !== "started") {
    return NextResponse.json({ message: "Bu deneme zaten tamamlandı." }, { status: 409 });
  }

  const correct = eligibilityQuestions.filter(
    (q) => answers[String(q.id)] === q.correct
  ).length;

  const score = Math.round((correct / eligibilityQuestions.length) * 100);
  const passed = score >= ELIGIBILITY_PASSING_SCORE;

  const { error: updateError } = await supabase
    .from("teacher_eligibility_attempts")
    .update({
      status: passed ? "passed" : "failed",
      score,
      submitted_at: new Date().toISOString(),
    })
    .eq("id", attemptId);

  if (updateError) {
    return NextResponse.json({ message: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    passed,
    score,
    passingScore: ELIGIBILITY_PASSING_SCORE,
  });
}
