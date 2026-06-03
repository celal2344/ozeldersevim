import type { SupabaseClient } from "@supabase/supabase-js";

export type AnalyticsEventName =
  | "user_registered"
  | "search_submitted"
  | "teacher_profile_viewed"
  | "lesson_request_submitted"
  | "review_submitted"
  | "favorite_toggled";

export async function trackEvent(
  supabase: SupabaseClient,
  name: AnalyticsEventName,
  properties: Record<string, unknown> = {},
  actorId?: string | null
): Promise<void> {
  try {
    await supabase
      .from("analytics_events")
      .insert({ name, properties, actor_id: actorId ?? null });
  } catch {
    // Analytics must never break the main request
  }
}
