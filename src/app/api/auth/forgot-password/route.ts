import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServerClient } from "@/shared/db/supabase/server";
import { siteConfig } from "@/features/seo/site";

const schema = z.object({
  email: z.email("Geçerli bir email adresi gir."),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Geçerli bir email adresi gir." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteConfig.url}/sifremi-sifirla`,
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  // Always return success to prevent email enumeration
  return NextResponse.json({ ok: true });
}
