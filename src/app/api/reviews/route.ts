import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentAccount } from "@/features/auth/service";
import { trackEvent } from "@/features/analytics/track";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

const submitReviewSchema = z.object({
  lessonRequestId: z.string().uuid("Geçersiz talep ID."),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000, "Yorum 1000 karakteri geçemez.").optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = submitReviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Yorum bilgileri eksik veya hatalı.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const account = await getCurrentAccount();

  if (!account) {
    return NextResponse.json({ message: "Yorum yazmak için giriş yapmalısın." }, { status: 401 });
  }

  if (account.role !== "student") {
    return NextResponse.json({ message: "Yorum yalnızca öğrenci hesapları tarafından yazılabilir." }, { status: 403 });
  }

  const supabase = await createSupabaseServerClient();
  const { lessonRequestId, rating, comment } = parsed.data;

  const { data: lessonRequest, error: fetchError } = await supabase
    .from("lesson_requests")
    .select("id, status, teacher_profile_id, student_profile_id")
    .eq("id", lessonRequestId)
    .eq("student_profile_id", account.id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ message: fetchError.message }, { status: 500 });
  }

  if (!lessonRequest) {
    return NextResponse.json({ message: "Ders talebi bulunamadı." }, { status: 404 });
  }

  if (lessonRequest.status !== "accepted") {
    return NextResponse.json({ message: "Yorum yalnızca kabul edilmiş taleplere yazılabilir." }, { status: 409 });
  }

  const { data: review, error: insertError } = await supabase
    .from("reviews")
    .insert({
      lesson_request_id: lessonRequestId,
      student_profile_id: account.id,
      teacher_profile_id: lessonRequest.teacher_profile_id,
      rating,
      comment: comment ?? null,
    })
    .select("id, rating, status")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json({ message: "Bu talep için zaten bir yorum yazılmış." }, { status: 409 });
    }
    return NextResponse.json({ message: insertError.message }, { status: 500 });
  }

  await trackEvent(supabase, "review_submitted", { rating, lessonRequestId }, account.id);

  return NextResponse.json({ reviewId: review.id, rating: review.rating, status: review.status });
}
