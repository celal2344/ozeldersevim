import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentAccount } from "@/features/auth/service";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

const toggleFavoriteSchema = z.object({
  slug: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = toggleFavoriteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Geçersiz istek." }, { status: 400 });
  }

  const account = await getCurrentAccount();

  if (!account) {
    return NextResponse.json({ message: "Giriş yapmalısın." }, { status: 401 });
  }

  if (account.role !== "student") {
    return NextResponse.json({ message: "Favoriler yalnızca öğrenci hesaplarında kullanılabilir." }, { status: 403 });
  }

  const supabase = await createSupabaseServerClient();

  const { data: listing, error: listingError } = await supabase
    .from("teacher_listings")
    .select("teacher_profile_id")
    .eq("slug", parsed.data.slug)
    .eq("is_published", true)
    .maybeSingle();

  if (listingError) {
    return NextResponse.json({ message: listingError.message }, { status: 500 });
  }

  if (!listing) {
    return NextResponse.json({ message: "Öğretmen ilanı bulunamadı." }, { status: 404 });
  }

  const { data: existing } = await supabase
    .from("favorites")
    .select("teacher_profile_id")
    .eq("student_profile_id", account.id)
    .eq("teacher_profile_id", listing.teacher_profile_id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("favorites")
      .delete()
      .eq("student_profile_id", account.id)
      .eq("teacher_profile_id", listing.teacher_profile_id);

    return NextResponse.json({ isFavorited: false });
  }

  await supabase
    .from("favorites")
    .insert({ student_profile_id: account.id, teacher_profile_id: listing.teacher_profile_id });

  return NextResponse.json({ isFavorited: true });
}
