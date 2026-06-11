import { NextResponse } from "next/server";
import { z } from "zod";

import { siteConfig } from "@/features/seo/site";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";
import { rateLimitResponse } from "@/shared/rate-limit/response";
import { assertRateLimit, RateLimitError } from "@/shared/rate-limit/service";

const schema = z.object({
  email: z.email("Geçerli bir email adresi gir."),
});

export async function POST(request: Request) {
  try {
    const rateLimit = await assertRateLimit(request, "auth:forgot-password");
    if (!rateLimit.allowed) return rateLimitResponse(rateLimit);

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

    // Always return success to prevent email enumeration.
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error instanceof RateLimitError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Şifre sıfırlama isteği gönderilemedi.";
    return NextResponse.json({ message }, { status });
  }
}
