import { NextResponse } from "next/server";

import { rateLimitExceededMessage } from "@/shared/rate-limit/constants";
import type { RateLimitResult } from "@/shared/rate-limit/types";

export function rateLimitResponse(result: RateLimitResult) {
  return NextResponse.json(
    { message: rateLimitExceededMessage },
    {
      status: 429,
      headers: {
        "Retry-After": Math.max(
          1,
          Math.ceil((new Date(result.resetAt).getTime() - Date.now()) / 1000)
        ).toString(),
        "X-RateLimit-Remaining": result.remaining.toString(),
        "X-RateLimit-Reset": result.resetAt,
      },
    }
  );
}
