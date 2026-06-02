import { NextResponse } from "next/server";

import { getCurrentAccount } from "@/features/auth/service";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const account = await getCurrentAccount();

  if (!account) {
    return NextResponse.json({ message: "Giriş yapmalısın." }, { status: 401 });
  }

  if (account.role !== "teacher") {
    return NextResponse.json({ message: "Bu işlem yalnızca öğretmen hesapları tarafından yapılabilir." }, { status: 403 });
  }

  const supabase = await createSupabaseServerClient();

  const { data: lessonRequest, error: fetchError } = await supabase
    .from("lesson_requests")
    .select("id, status")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ message: fetchError.message }, { status: 500 });
  }

  if (!lessonRequest) {
    return NextResponse.json({ message: "Ders talebi bulunamadı." }, { status: 404 });
  }

  if (lessonRequest.status !== "submitted") {
    return NextResponse.json({ message: "Yalnızca bekleyen talepler reddedilebilir." }, { status: 409 });
  }

  const { error: updateError } = await supabase
    .from("lesson_requests")
    .update({ status: "rejected", rejected_at: new Date().toISOString() })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ message: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ id, status: "rejected" });
}
