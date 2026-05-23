import { NextResponse } from "next/server";

import { getCurrentAccount } from "@/features/auth/service";

export async function GET() {
  const account = await getCurrentAccount();

  if (!account) {
    return NextResponse.json({ message: "Oturum bulunamadı." }, { status: 401 });
  }

  return NextResponse.json({ account });
}
