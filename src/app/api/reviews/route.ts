import { NextResponse } from "next/server";
import { z } from "zod";

import { ReviewError, submitStudentReview } from "@/features/reviews/service";
import { rateLimitResponse } from "@/shared/rate-limit/response";
import { assertRateLimit, RateLimitError } from "@/shared/rate-limit/service";

const submitReviewSchema = z.object({
  lessonRequestId: z.string().uuid("Geçersiz talep ID."),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000, "Yorum 1000 karakteri geçemez.").optional(),
});

export async function POST(request: Request) {
  try {
    const rateLimit = await assertRateLimit(request, "reviews:create");
    if (!rateLimit.allowed) return rateLimitResponse(rateLimit);

    const body = await request.json().catch(() => null);
    const parsed = submitReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Yorum bilgileri eksik veya hatalı.", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const review = await submitStudentReview(parsed.data);
    return NextResponse.json(review);
  } catch (error) {
    const status = error instanceof ReviewError || error instanceof RateLimitError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Yorum gönderilemedi.";

    return NextResponse.json({ message }, { status });
  }
}
