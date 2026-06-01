import { createClient } from "@supabase/supabase-js";

import { assertSupabaseServiceRoleEnv } from "@/shared/config/env";

export function createSupabaseServiceRoleClient() {
  const env = assertSupabaseServiceRoleEnv();

  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
