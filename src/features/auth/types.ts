import type { z } from "zod";

import type { loginSchema, registerSchema } from "@/features/auth/constants";

export type AppRole = "student" | "teacher" | "admin";

export type AuthAccount = {
  id: string;
  role: AppRole;
  fullName: string;
  phone: string | null;
  email: string | null;
};

export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export type AuthResponsePayload = {
  account: AuthAccount;
  redirectTo: string;
};
