"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { loginSchema } from "@/features/auth/constants";
import type { LoginFormValues } from "@/features/auth/types";
import { Button } from "@/shared/components/ui/button";
import { createSupabaseBrowserClient } from "@/shared/db/supabase/browser";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function submit(values: LoginFormValues) {
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (signInError) {
      setError("Email veya şifre hatalı.");
      return;
    }

    router.push(redirectTo ?? "/");
    router.refresh();
  }

  const errors = form.formState.errors;

  return (
    <form onSubmit={form.handleSubmit(submit)} className="grid gap-5">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      ) : null}
      <div className="grid gap-2">
        <label className="text-sm font-medium text-brand-navy">Email</label>
        <input
          {...form.register("email")}
          type="email"
          placeholder="ornek@email.com"
          className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-brand-navy outline-none focus:border-brand-orange"
        />
        {errors.email ? <p className="text-xs text-red-600">{errors.email.message}</p> : null}
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-brand-navy">Şifre</label>
        <input
          {...form.register("password")}
          type="password"
          placeholder="Şifreniz"
          className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-brand-navy outline-none focus:border-brand-orange"
        />
        {errors.password ? <p className="text-xs text-red-600">{errors.password.message}</p> : null}
      </div>
      <Button
        type="submit"
        className="bg-brand-orange text-white hover:bg-brand-orange/90"
        disabled={form.formState.isSubmitting}
      >
        <LogInIcon data-icon="inline-start" aria-hidden="true" />
        {form.formState.isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
      </Button>
    </form>
  );
}
