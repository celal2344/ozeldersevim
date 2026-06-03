export type FavoriteTeacher = {
  teacher_profile_id: string;
  teacher_profiles: {
    hourly_price: number;
    delivery_mode: "online" | "face_to_face" | "both";
    locations: { city: string; district: string | null } | null;
    teacher_listings: {
      slug: string;
      headline: string;
      rating_average: number;
      review_count: number;
    } | null;
  } | null;
};
