import { NextResponse } from "next/server";

import { CalendarError, getTeacherCalendarResource } from "@/features/calendar/service";

function errorResponse(error: unknown, fallback: string) {
  const status = error instanceof CalendarError ? error.status : 500;
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ message }, { status });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json({ message: "Tarih aralığı zorunlu." }, { status: 400 });
  }

  try {
    const resource = await getTeacherCalendarResource(from, to);
    return NextResponse.json(resource);
  } catch (error) {
    return errorResponse(error, "Takvim bilgileri alınamadı.");
  }
}
