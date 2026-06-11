export type RateLimitBucket =
  | "auth:forgot-password"
  | "auth:login"
  | "auth:register"
  | "favorites:toggle"
  | "lesson-requests:create"
  | "reviews:create"
  | "teacher-eligibility:submit";

export type RateLimitRule = {
  bucket: RateLimitBucket;
  limit: number;
  windowSeconds: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: string;
};
