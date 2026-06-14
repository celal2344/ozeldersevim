import { NextResponse } from "next/server";

import { createCalendarLessonSchema } from "@/features/calendar/constants";
import { CalendarError, createTeacherCalendarLesson } from "@/features/calendar/service";

function errorResponse(error: unknown, fallback: string) {
  const status = error instanceof CalendarError ? error.status : 500;
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ message }, { status });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createCalendarLessonSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Ders bilgileri eksik veya hatalı.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const result = await createTeacherCalendarLesson(parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return errorResponse(error, "Ders oluşturulamadı.");
  }
}
