import { NextResponse } from "next/server";

import { teacherRegistrationSchema } from "@/features/teacher-eligibility/constants";
import { registerTeacherAccount } from "@/features/teacher-eligibility/service";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = teacherRegistrationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Öğretmen hesap bilgileri eksik veya hatalı.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const result = await registerTeacherAccount(parsed.data);

    if (!result.ok) {
      return NextResponse.json({ message: result.message }, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Öğretmen hesabı oluşturulamadı." },
      { status: 500 }
    );
  }
}
