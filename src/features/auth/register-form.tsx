"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { studentRegisterSchema, teacherRegisterSchema } from "@/features/auth/constants";
import type { RegisterRole, StudentRegisterFormValues } from "@/features/auth/types";
import { Button } from "@/shared/components/ui/button";

export function RegisterForm({ role }: { role: RegisterRole }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const schema = role === "teacher" ? teacherRegisterSchema : studentRegisterSchema;

  const form = useForm<StudentRegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", phone: "", email: "", password: "", passwordConfirm: "" },
  });

  async function submit(values: StudentRegisterFormValues) {
    setError(null);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, role }),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setError(payload?.message ?? "Kayıt başarısız oldu.");
      return;
    }

    if (role === "teacher") {
      router.push("/ogretmen-ol");
    } else {
      router.push("/");
    }
    router.refresh();
  }

  const errors = form.formState.errors;

  return (
    <form onSubmit={form.handleSubmit(submit)} className="grid gap-5">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      ) : null}
      <div className="grid gap-2">
        <label className="text-sm font-medium text-brand-navy">Ad Soyad</label>
        <input
          {...form.register("fullName")}
          placeholder="Ad ve soyadınız"
          className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-brand-navy outline-none focus:border-brand-orange"
        />
        {errors.fullName ? <p className="text-xs text-red-600">{errors.fullName.message}</p> : null}
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-brand-navy">Telefon</label>
        <input
          {...form.register("phone")}
          placeholder="05xx xxx xx xx"
          className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-brand-navy outline-none focus:border-brand-orange"
        />
        {errors.phone ? <p className="text-xs text-red-600">{errors.phone.message}</p> : null}
      </div>
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
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-brand-navy">Şifre</label>
          <input
            {...form.register("password")}
            type="password"
            placeholder="En az 8 karakter"
            className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-brand-navy outline-none focus:border-brand-orange"
          />
          {errors.password ? <p className="text-xs text-red-600">{errors.password.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-brand-navy">Şifre Tekrar</label>
          <input
            {...form.register("passwordConfirm")}
            type="password"
            placeholder="Şifreyi tekrar girin"
            className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-brand-navy outline-none focus:border-brand-orange"
          />
          {errors.passwordConfirm ? <p className="text-xs text-red-600">{errors.passwordConfirm.message}</p> : null}
        </div>
      </div>
      <Button
        type="submit"
        className="bg-brand-orange text-white hover:bg-brand-orange/90"
        disabled={form.formState.isSubmitting}
      >
        <UserPlusIcon data-icon="inline-start" aria-hidden="true" />
        {form.formState.isSubmitting ? "Kaydediliyor..." : "Kayıt Ol"}
      </Button>
    </form>
  );
}
