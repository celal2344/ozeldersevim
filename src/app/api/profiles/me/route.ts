import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentAccount } from "@/features/auth/service";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

const updateProfileSchema = z.object({
  fullName: z.string().min(2, "Ad soyad zorunlu.").max(120, "Ad soyad çok uzun."),
  phone: z.string().min(10, "Telefon zorunlu.").max(30, "Telefon çok uzun."),
});

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = updateProfileSchema.safeParse(body);

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

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.fullName, phone: parsed.data.phone })
    .eq("id", account.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ fullName: parsed.data.fullName, phone: parsed.data.phone });
}
