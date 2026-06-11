import { NextResponse } from "next/server";

import { getCurrentAccount } from "@/features/auth/service";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ isFavorited: false });
  }

  const account = await getCurrentAccount();

  if (!account || account.role !== "student") {
    return NextResponse.json({ isFavorited: false });
  }

  const supabase = await createSupabaseServerClient();

  const { data: listing } = await supabase
    .from("teacher_listings")
    .select("teacher_profile_id")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!listing) {
    return NextResponse.json({ isFavorited: false });
  }

  const { data: favorite } = await supabase
    .from("favorites")
    .select("teacher_profile_id")
    .eq("student_profile_id", account.id)
    .eq("teacher_profile_id", listing.teacher_profile_id)
    .maybeSingle();

  return NextResponse.json({ isFavorited: Boolean(favorite) });
}
