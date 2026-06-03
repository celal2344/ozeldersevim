import { createSupabaseServerClient } from "@/shared/db/supabase/server";
import type { FavoriteTeacher } from "@/features/favorites/types";

export async function getStudentFavorites(): Promise<FavoriteTeacher[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("favorites")
    .select(
      "teacher_profile_id, teacher_profiles!teacher_profile_id(hourly_price, delivery_mode, locations!location_id(city, district), teacher_listings!teacher_profile_id(slug, headline, rating_average, review_count))"
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []) as unknown as FavoriteTeacher[];
}
