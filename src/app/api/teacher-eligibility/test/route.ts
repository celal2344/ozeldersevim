import { NextResponse } from "next/server";

import { getCurrentAccount } from "@/features/auth/service";
import {
  getActiveTeacherEligibilityTest,
  TeacherEligibilityError,
} from "@/features/teacher-eligibility/service";

export async function GET() {
  const account = await getCurrentAccount();

  if (!account) {
    return NextResponse.json({ message: "Öğretmenlik testi için giriş yapmalısın." }, { status: 401 });
  }

  if (account.role !== "teacher") {
    return NextResponse.json({ message: "Öğretmenlik testini sadece öğretmen hesapları açabilir." }, { status: 403 });
  }

  try {
    const test = await getActiveTeacherEligibilityTest(account.id);
    return NextResponse.json({ test });
  } catch (error) {
    const status = error instanceof TeacherEligibilityError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Öğretmenlik testi getirilemedi.";

    return NextResponse.json({ message }, { status });
  }
}
