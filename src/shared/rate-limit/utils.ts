import { createHash } from "node:crypto";

export function getClientIdentifier(request: Request, accountId?: string | null) {
  if (accountId) return `account:${accountId}`;

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const ip = forwardedFor || realIp || "unknown";

  return `ip:${ip}`;
}

export function hashRateLimitIdentifier(identifier: string) {
  return createHash("sha256").update(identifier).digest("hex");
}
