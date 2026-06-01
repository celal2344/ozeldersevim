import { NextResponse } from "next/server";

import { getLessonCategoryOptions, TeacherListingError } from "@/features/teacher-listings/service";

export async function GET() {
  try {
    const categories = await getLessonCategoryOptions();
    return NextResponse.json({ categories });
  } catch (error) {
    const status = error instanceof TeacherListingError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Ders kategorileri getirilemedi.";

    return NextResponse.json({ message }, { status });
  }
}
