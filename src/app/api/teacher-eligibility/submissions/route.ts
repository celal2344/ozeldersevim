import { NextResponse } from "next/server";

import { getCurrentAccount } from "@/features/auth/service";
import { teacherEligibilitySubmissionSchema } from "@/features/teacher-eligibility/constants";
import {
  submitTeacherEligibilityAnswers,
  TeacherEligibilityError,
} from "@/features/teacher-eligibility/service";
import { rateLimitResponse } from "@/shared/rate-limit/response";
import { assertRateLimit, RateLimitError } from "@/shared/rate-limit/service";

export async function POST(request: Request) {
  const account = await getCurrentAccount();

  if (!account) {
    return NextResponse.json({ message: "Öğretmenlik testi için giriş yapmalısın." }, { status: 401 });
  }

  if (account.role !== "teacher") {
    return NextResponse.json({ message: "Öğretmenlik testini sadece öğretmen hesapları gönderebilir." }, { status: 403 });
  }

  try {
    const rateLimit = await assertRateLimit(request, "teacher-eligibility:submit", account.id);
    if (!rateLimit.allowed) return rateLimitResponse(rateLimit);
  } catch (error) {
    const status = error instanceof RateLimitError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Öğretmenlik testi değerlendirilemedi.";
    return NextResponse.json({ message }, { status });
  }

  const body = await request.json().catch(() => null);
  const parsed = teacherEligibilitySubmissionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Test cevapları eksik veya hatalı.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const result = await submitTeacherEligibilityAnswers(account.id, parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    const status = error instanceof TeacherEligibilityError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Öğretmenlik testi değerlendirilemedi.";

    return NextResponse.json({ message }, { status });
  }
}
