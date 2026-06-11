import "server-only";

import { rateLimitRules } from "@/shared/rate-limit/constants";
import type { RateLimitBucket, RateLimitResult } from "@/shared/rate-limit/types";
import { getClientIdentifier, hashRateLimitIdentifier } from "@/shared/rate-limit/utils";
import { createSupabaseServiceRoleClient } from "@/shared/db/supabase/admin";

export class RateLimitError extends Error {
  constructor(message: string, public status = 429) {
    super(message);
  }
}

export async function assertRateLimit(
  request: Request,
  bucket: RateLimitBucket,
  accountId?: string | null
): Promise<RateLimitResult> {
  const rule = rateLimitRules[bucket];
  const now = Date.now();
  const windowStart = new Date(now - rule.windowSeconds * 1000).toISOString();
  const resetAt = new Date(now + rule.windowSeconds * 1000).toISOString();
  const identifierHash = hashRateLimitIdentifier(getClientIdentifier(request, accountId));
  const supabase = createSupabaseServiceRoleClient();

  const { count, error: countError } = await supabase
    .from("request_rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("bucket", bucket)
    .eq("identifier_hash", identifierHash)
    .gte("created_at", windowStart);

  if (countError) {
    throw new RateLimitError(countError.message, 500);
  }

  const currentCount = count ?? 0;

  if (currentCount >= rule.limit) {
    return { allowed: false, remaining: 0, resetAt };
  }

  const { error: insertError } = await supabase.from("request_rate_limits").insert({
    bucket,
    identifier_hash: identifierHash,
  });

  if (insertError) {
    throw new RateLimitError(insertError.message, 500);
  }

  return { allowed: true, remaining: Math.max(rule.limit - currentCount - 1, 0), resetAt };
}
