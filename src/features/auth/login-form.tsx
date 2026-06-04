"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { loginSchema } from "@/features/auth/constants";
import type { AuthResponsePayload, LoginInput } from "@/features/auth/types";
import { authApiErrorMessage } from "@/features/auth/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export function LoginForm({ next }: { next?: string | null }) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const errors = form.formState.errors;

  async function submit(values: LoginInput) {
    setSubmitError(null);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, next }),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setSubmitError(authApiErrorMessage(payload, "Giriş yapılamadı. Lütfen tekrar dene."));
      return;
    }

    window.location.assign((payload as AuthResponsePayload).redirectTo);
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-4">
      {(errors.email?.message ?? errors.password?.message ?? submitError) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errors.email?.message ?? errors.password?.message ?? submitError}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-brand-navy" htmlFor="email">
          E-posta adresin
        </label>
        <Input
          id="email"
          {...form.register("email")}
          className="h-11 bg-white"
          type="email"
          placeholder="ornek@email.com"
          autoComplete="email"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-brand-navy" htmlFor="password">
            Şifren
          </label>
          <Link
            href="/sifremi-unuttum"
            className="text-xs text-brand-orange hover:underline"
            tabIndex={-1}
          >
            Şifremi unuttum
          </Link>
        </div>
        <Input
          id="password"
          {...form.register("password")}
          className="h-11 bg-white"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>

      <Button
        type="submit"
        className="mt-1 h-11 w-full bg-brand-orange text-white hover:bg-brand-orange/90"
        disabled={form.formState.isSubmitting}
      >
        <LogInIcon data-icon="inline-start" aria-hidden="true" />
        {form.formState.isSubmitting ? "Giriş yapılıyor…" : "Giriş Yap"}
      </Button>
    </form>
  );
}
