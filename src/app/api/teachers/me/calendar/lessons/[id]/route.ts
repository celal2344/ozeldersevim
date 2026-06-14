import { NextResponse } from "next/server";

import { updateCalendarLessonSchema } from "@/features/calendar/constants";
import { CalendarError, updateTeacherCalendarLesson } from "@/features/calendar/service";

function errorResponse(error: unknown, fallback: string) {
  const status = error instanceof CalendarError ? error.status : 500;
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ message }, { status });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateCalendarLessonSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Ders bilgileri eksik veya hatalı.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const result = await updateTeacherCalendarLesson(id, parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(error, "Ders güncellenemedi.");
  }
}
