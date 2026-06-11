import { NextResponse } from "next/server";

import { trackEvent } from "@/features/analytics/track";
import { registerSchema } from "@/features/auth/constants";
import { registerAccount } from "@/features/auth/service";
import { redirectForAuthResult, safeNextPath } from "@/features/auth/utils";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";
import { rateLimitResponse } from "@/shared/rate-limit/response";
import { assertRateLimit, RateLimitError } from "@/shared/rate-limit/service";

export async function POST(request: Request) {
  try {
    const rateLimit = await assertRateLimit(request, "auth:register");
    if (!rateLimit.allowed) return rateLimitResponse(rateLimit);

    const body = await request.json().catch(() => null);
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Kayıt bilgileri eksik veya hatalı.", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const next = body && typeof body === "object" && "next" in body && typeof body.next === "string"
      ? safeNextPath(body.next)
      : null;
    const account = await registerAccount(parsed.data);
    const supabase = await createSupabaseServerClient();
    await trackEvent(supabase, "user_registered", { role: account.role }, account.id);

    return NextResponse.json(
      {
        account,
        redirectTo: redirectForAuthResult(account.role, next, "signup"),
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kayıt oluşturulamadı.";
    const status = error instanceof RateLimitError
      ? error.status
      : message.includes("email doğrulaması") ? 409 : 400;

    return NextResponse.json({ message }, { status });
  }
}
