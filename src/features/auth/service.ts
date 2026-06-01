import { createSupabaseServerClient } from "@/shared/db/supabase/server";
import { hasSupabasePublicEnv } from "@/shared/config/env";
import type { AuthAccount, LoginInput, RegisterInput } from "@/features/auth/types";

function profileToAccount(profile: {
  id: string;
  role: "student" | "teacher" | "admin";
  full_name: string;
  phone: string | null;
}, email: string | null): AuthAccount {
  return {
    id: profile.id,
    role: profile.role,
    fullName: profile.full_name,
    phone: profile.phone,
    email,
  };
}

export async function getCurrentAccount(): Promise<AuthAccount | null> {
  if (!hasSupabasePublicEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return null;
  }

  const userId = claimsData.claims.sub;
  const emailClaim = claimsData.claims.email;
  const email = typeof emailClaim === "string" ? emailClaim : null;
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,role,full_name,phone")
    .eq("id", userId)
    .maybeSingle();

  if (profileError || !profile) {
    return null;
  }

  return profileToAccount(profile, email);
}

export async function registerAccount(input: RegisterInput): Promise<AuthAccount> {
  const supabase = await createSupabaseServerClient();
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        full_name: input.fullName,
        phone: input.phone,
        role: input.role,
      },
    },
  });

  if (signUpError) {
    throw new Error(signUpError.message);
  }

  if (!signUpData.user || !signUpData.session) {
    throw new Error("Bu MVP akışı için Supabase email doğrulaması kapalı olmalı.");
  }

  await supabase.auth.setSession({
    access_token: signUpData.session.access_token,
    refresh_token: signUpData.session.refresh_token,
  });

  const { error: profileError } = await supabase.from("profiles").insert({
    id: signUpData.user.id,
    role: input.role,
    full_name: input.fullName,
    phone: input.phone,
  });

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (input.role === "student") {
    const { error: studentProfileError } = await supabase.from("student_profiles").insert({
      profile_id: signUpData.user.id,
    });

    if (studentProfileError) {
      throw new Error(studentProfileError.message);
    }
  }

  return {
    id: signUpData.user.id,
    role: input.role,
    fullName: input.fullName,
    phone: input.phone,
    email: signUpData.user.email ?? input.email,
  };
}

export async function loginAccount(input: LoginInput): Promise<AuthAccount> {
  const supabase = await createSupabaseServerClient();
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (signInError) {
    throw new Error(signInError.message);
  }

  if (!signInData.user) {
    throw new Error("Oturum açılamadı.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,role,full_name,phone")
    .eq("id", signInData.user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (!profile) {
    await supabase.auth.signOut();
    throw new Error("Bu hesap için profil bulunamadı.");
  }

  return profileToAccount(profile, signInData.user.email ?? input.email);
}

export async function logoutAccount() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}
