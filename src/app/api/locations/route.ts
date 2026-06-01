import { NextResponse } from "next/server";

import { getLocationOptions, TeacherListingError } from "@/features/teacher-listings/service";

export async function GET() {
  try {
    const locations = await getLocationOptions();
    return NextResponse.json({ locations });
  } catch (error) {
    const status = error instanceof TeacherListingError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Konumlar getirilemedi.";

    return NextResponse.json({ message }, { status });
  }
}
