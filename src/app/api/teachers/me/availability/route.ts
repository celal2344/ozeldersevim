import { NextResponse } from "next/server";

import { teacherAvailabilityInputSchema } from "@/features/availability/constants";
import {
  AvailabilityError,
  getOwnTeacherAvailability,
  saveOwnTeacherAvailability,
} from "@/features/availability/service";

function errorResponse(error: unknown, fallback: string) {
  const status = error instanceof AvailabilityError ? error.status : 500;
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ message }, { status });
}

export async function GET() {
  try {
    const availability = await getOwnTeacherAvailability();
    return NextResponse.json(availability);
  } catch (error) {
    return errorResponse(error, "Müsaitlik bilgileri alınamadı.");
  }
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = teacherAvailabilityInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Müsaitlik bilgileri eksik veya hatalı.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const availability = await saveOwnTeacherAvailability(parsed.data);
    return NextResponse.json(availability);
  } catch (error) {
    return errorResponse(error, "Müsaitlik bilgileri kaydedilemedi.");
  }
}
