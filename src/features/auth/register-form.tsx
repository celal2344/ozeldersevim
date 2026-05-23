"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { authRoleOptions, registerSchema } from "@/features/auth/constants";
import type { AuthResponsePayload, RegisterInput } from "@/features/auth/types";
import { authApiErrorMessage } from "@/features/auth/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export function RegisterForm({ initialRole = "student", next }: { initialRole?: RegisterInput["role"]; next?: string | null }) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: initialRole,
      fullName: "",
      email: "",
      phone: "",
      password: "",
      termsAccepted: false,
      privacyAccepted: false,
    },
  });
  const errors = form.formState.errors;

  async function submit(values: RegisterInput) {
    setSubmitError(null);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, next }),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setSubmitError(authApiErrorMessage(payload, "Kayıt oluşturulamadı. Lütfen tekrar dene."));
      return;
    }

    const result = payload as AuthResponsePayload;
    window.location.assign(result.redirectTo);
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="grid gap-5">
      <FieldError
        message={
          errors.role?.message ??
          errors.fullName?.message ??
          errors.email?.message ??
          errors.phone?.message ??
          errors.password?.message ??
          errors.termsAccepted?.message ??
          errors.privacyAccepted?.message ??
          submitError ??
          undefined
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-brand-navy">
          Hesap türü
          <select
            {...form.register("role")}
            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-brand-navy outline-none focus:border-brand-orange"
          >
            {authRoleOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-brand-navy">
          Ad soyad
          <Input {...form.register("fullName")} className="h-11 bg-white" placeholder="Ad soyad" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-brand-navy">
          Email
          <Input {...form.register("email")} className="h-11 bg-white" type="email" placeholder="ornek@email.com" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-brand-navy">
          Telefon
          <Input {...form.register("phone")} className="h-11 bg-white" placeholder="05xx xxx xx xx" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-brand-navy sm:col-span-2">
          Şifre
          <Input {...form.register("password")} className="h-11 bg-white" type="password" placeholder="En az 8 karakter" />
        </label>
      </div>
      <label className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-brand-navy">
        <input type="checkbox" {...form.register("termsAccepted")} className="mt-1" />
        Kullanım koşullarını kabul ediyorum.
      </label>
      <label className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-brand-navy">
        <input type="checkbox" {...form.register("privacyAccepted")} className="mt-1" />
        Gizlilik politikası ve KVKK aydınlatma metnini kabul ediyorum.
      </label>
      <Button type="submit" className="h-11 bg-brand-orange text-white hover:bg-brand-orange/90" disabled={form.formState.isSubmitting}>
        <UserPlusIcon data-icon="inline-start" aria-hidden="true" />
        {form.formState.isSubmitting ? "Kaydediliyor" : "Kayıt Ol"}
      </Button>
      <Button variant="outline" nativeButton={false} render={<Link href={next ? `/giris?next=${encodeURIComponent(next)}` : "/giris"} />}>
        Hesabın var mı? Giriş yap
        <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
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
