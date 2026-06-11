import { getCurrentAccount } from "@/features/auth/service";
import type { FavoriteTeacher } from "@/features/favorites/types";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

export async function getStudentFavorites(): Promise<FavoriteTeacher[]> {
  const account = await getCurrentAccount();

  if (!account || account.role !== "student") {
    return [];
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("favorites")
    .select(
      "teacher_profile_id, teacher_profiles!teacher_profile_id(hourly_price, delivery_mode, locations!location_id(city, district), teacher_listings!teacher_profile_id(slug, headline, rating_average, review_count, is_published))"
    )
    .eq("student_profile_id", account.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return ((data ?? []) as unknown as FavoriteTeacher[]).filter(
    (favorite) => favorite.teacher_profiles?.teacher_listings?.is_published
  );
}
