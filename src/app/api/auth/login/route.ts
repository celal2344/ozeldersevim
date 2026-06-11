import { NextResponse } from "next/server";

import { loginSchema } from "@/features/auth/constants";
import { loginAccount } from "@/features/auth/service";
import { redirectForAuthResult, safeNextPath } from "@/features/auth/utils";
import { rateLimitResponse } from "@/shared/rate-limit/response";
import { assertRateLimit, RateLimitError } from "@/shared/rate-limit/service";

export async function POST(request: Request) {
  try {
    const rateLimit = await assertRateLimit(request, "auth:login");
    if (!rateLimit.allowed) return rateLimitResponse(rateLimit);

    const body = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Giriş bilgileri eksik veya hatalı.", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const next = body && typeof body === "object" && "next" in body && typeof body.next === "string"
      ? safeNextPath(body.next)
      : null;
    const account = await loginAccount(parsed.data);

    return NextResponse.json({
      account,
      redirectTo: redirectForAuthResult(account.role, next, "login"),
    });
  } catch (error) {
    const status = error instanceof RateLimitError ? error.status : 401;
    const message = error instanceof Error ? error.message : "Giriş yapılamadı.";

    return NextResponse.json({ message }, { status });
  }
}
