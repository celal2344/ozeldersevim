import { NextResponse, type NextRequest } from "next/server";

import { trackEvent } from "@/features/analytics/track";
import { parseTeacherSearchParams, searchTeachers } from "@/features/search/search-service";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

export async function GET(request: NextRequest) {
  const params = parseTeacherSearchParams(request.nextUrl.searchParams);
  const result = searchTeachers(params);

  const supabase = await createSupabaseServerClient();
  await trackEvent(supabase, "search_submitted", {
    q: params.q ?? null,
    lesson: params.lesson ?? null,
    city: params.city ?? null,
    district: params.district ?? null,
    deliveryMode: params.deliveryMode ?? null,
    page: params.page ?? 1,
    resultCount: result.meta.total,
  });

  return NextResponse.json(result);
}
