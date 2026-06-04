import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentAccount } from "@/features/auth/service";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

const schema = z.object({
  status: z.enum(["published", "suspended", "draft"]),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Geçersiz durum değeri." }, { status: 400 });
  }

  const account = await getCurrentAccount();

  if (!account || account.role !== "admin") {
    return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 403 });
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("teacher_profiles")
    .update({ status: parsed.data.status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ id, status: parsed.data.status });
}
