import type { RateLimitBucket, RateLimitRule } from "@/shared/rate-limit/types";

export const rateLimitRules: Record<RateLimitBucket, RateLimitRule> = {
  "auth:forgot-password": { bucket: "auth:forgot-password", limit: 3, windowSeconds: 60 * 60 },
  "auth:login": { bucket: "auth:login", limit: 10, windowSeconds: 15 * 60 },
  "auth:register": { bucket: "auth:register", limit: 5, windowSeconds: 60 * 60 },
  "favorites:toggle": { bucket: "favorites:toggle", limit: 60, windowSeconds: 60 },
  "lesson-requests:create": { bucket: "lesson-requests:create", limit: 5, windowSeconds: 60 * 60 },
  "reviews:create": { bucket: "reviews:create", limit: 5, windowSeconds: 60 * 60 },
  "teacher-eligibility:submit": { bucket: "teacher-eligibility:submit", limit: 10, windowSeconds: 60 * 60 },
};

export const rateLimitExceededMessage = "Çok fazla deneme yapıldı. Lütfen daha sonra tekrar dene.";
