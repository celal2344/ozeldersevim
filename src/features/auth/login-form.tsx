"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogInIcon, UserPlusIcon } from "lucide-react";
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, next }),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setSubmitError(authApiErrorMessage(payload, "Giriş yapılamadı. Lütfen tekrar dene."));
      return;
    }

    const result = payload as AuthResponsePayload;
    window.location.assign(result.redirectTo);
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="grid gap-5">
      <FieldError message={errors.email?.message ?? errors.password?.message ?? submitError ?? undefined} />
      <label className="grid gap-2 text-sm font-medium text-brand-navy">
        Email
        <Input {...form.register("email")} className="h-11 bg-white" type="email" placeholder="ornek@email.com" />
      </label>
      <label className="grid gap-2 text-sm font-medium text-brand-navy">
        Şifre
        <Input {...form.register("password")} className="h-11 bg-white" type="password" placeholder="Şifren" />
      </label>
      <Button type="submit" className="h-11 bg-brand-orange text-white hover:bg-brand-orange/90" disabled={form.formState.isSubmitting}>
        <LogInIcon data-icon="inline-start" aria-hidden="true" />
        {form.formState.isSubmitting ? "Giriş yapılıyor" : "Giriş Yap"}
      </Button>
      <Button variant="outline" nativeButton={false} render={<Link href={next ? `/kayit?next=${encodeURIComponent(next)}` : "/kayit"} />}>
        <UserPlusIcon data-icon="inline-start" aria-hidden="true" />
        Yeni hesap oluştur
      </Button>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </div>
  );
}
