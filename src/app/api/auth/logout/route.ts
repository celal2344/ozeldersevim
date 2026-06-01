import { NextResponse } from "next/server";

import { logoutAccount } from "@/features/auth/service";

export async function POST() {
  try {
    await logoutAccount();

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Çıkış yapılamadı." },
      { status: 500 }
    );
  }
}
