import { NextResponse } from "next/server";

import { teacherEligibilityAttemptSchema } from "@/features/teacher-eligibility/constants";
import { scoreTeacherEligibilityAnswers } from "@/features/teacher-eligibility/utils";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = teacherEligibilityAttemptSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Öğretmenlik testi eksik veya hatalı.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  return NextResponse.json(scoreTeacherEligibilityAnswers(parsed.data.answers));
}
