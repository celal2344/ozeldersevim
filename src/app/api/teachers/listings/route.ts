import { NextResponse } from "next/server";

import { teacherListingCreationSchema } from "@/features/teacher-eligibility/constants";
import { createTeacherListing } from "@/features/teacher-eligibility/service";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = teacherListingCreationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Öğretmen ilan bilgileri eksik veya hatalı.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const result = await createTeacherListing(parsed.data);

    if (!result.ok) {
      return NextResponse.json({ message: result.message }, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Öğretmen ilanı oluşturulamadı." },
      { status: 500 }
    );
  }
}
