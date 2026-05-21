import { NextResponse, type NextRequest } from "next/server";

import { parseTeacherSearchParams, searchTeachers } from "@/features/search/search-service";

export function GET(request: NextRequest) {
  const params = parseTeacherSearchParams(request.nextUrl.searchParams);
  return NextResponse.json(searchTeachers(params));
}
