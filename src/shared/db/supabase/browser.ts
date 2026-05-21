import { createBrowserClient } from "@supabase/ssr";

import { assertSupabasePublicEnv } from "@/shared/config/env";

export function createSupabaseBrowserClient() {
  const env = assertSupabasePublicEnv();

  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
