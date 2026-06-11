import { NextResponse } from "next/server";

import {
  LessonRequestError,
  updateTeacherLessonRequestStatus,
} from "@/features/requests/service";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const result = await updateTeacherLessonRequestStatus(id, "rejected");
    return NextResponse.json(result);
  } catch (error) {
    const status = error instanceof LessonRequestError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Ders talebi reddedilemedi.";
    return NextResponse.json({ message }, { status });
  }
}
