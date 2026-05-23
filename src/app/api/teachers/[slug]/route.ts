import { NextResponse } from "next/server";

import { getTeacherProfileBySlug } from "@/features/teachers/service";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const teacher = await getTeacherProfileBySlug(slug);

  if (!teacher) {
    return NextResponse.json({ message: "Öğretmen bulunamadı." }, { status: 404 });
  }

  return NextResponse.json(teacher);
}
