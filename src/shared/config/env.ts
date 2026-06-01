import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
});

const serviceRoleEnvSchema = publicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
});

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

export function hasSupabasePublicEnv() {
  return publicEnvSchema
    .required()
    .safeParse({
      NEXT_PUBLIC_SUPABASE_URL: publicEnv.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }).success;
}

export function assertSupabasePublicEnv() {
  const parsed = publicEnvSchema
    .required()
    .safeParse({
      NEXT_PUBLIC_SUPABASE_URL: publicEnv.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });

  if (!parsed.success) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return parsed.data;
}

export function assertSupabaseServiceRoleEnv() {
  const parsed = serviceRoleEnvSchema
    .required()
    .safeParse({
      NEXT_PUBLIC_SUPABASE_URL: publicEnv.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    });

  if (!parsed.success) {
    throw new Error("Supabase service role environment variables are not configured.");
  }

  return parsed.data;
}
