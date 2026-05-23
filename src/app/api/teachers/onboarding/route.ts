import { NextResponse } from "next/server";

import { completeTeacherOnboarding } from "@/features/teacher-eligibility/service";
import { teacherOnboardingSchema } from "@/features/teacher-eligibility/constants";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = teacherOnboardingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Öğretmen onboarding bilgileri eksik veya hatalı.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const result = await completeTeacherOnboarding(parsed.data);

    if (!result.ok) {
      return NextResponse.json({ message: result.message }, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Öğretmen onboarding tamamlanamadı." },
      { status: 500 }
    );
  }
}
