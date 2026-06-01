import { NextResponse } from "next/server";

import { loginSchema } from "@/features/auth/constants";
import { loginAccount } from "@/features/auth/service";
import { redirectForAuthResult, safeNextPath } from "@/features/auth/utils";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Giriş bilgileri eksik veya hatalı.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const next = body && typeof body === "object" && "next" in body && typeof body.next === "string"
      ? safeNextPath(body.next)
      : null;
    const account = await loginAccount(parsed.data);

    return NextResponse.json({
      account,
      redirectTo: redirectForAuthResult(account.role, next, "login"),
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Giriş yapılamadı." },
      { status: 401 }
    );
  }
}
