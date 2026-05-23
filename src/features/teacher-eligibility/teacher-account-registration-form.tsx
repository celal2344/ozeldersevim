"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, CheckCircle2Icon, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { teacherRegistrationSchema } from "@/features/teacher-eligibility/constants";
import type {
  TeacherRegistrationPayload,
  TeacherRegistrationResponse,
} from "@/features/teacher-eligibility/types";
import { teacherEligibilityApiErrorMessage } from "@/features/teacher-eligibility/utils";
import { Button } from "@/shared/components/ui/button";

export function TeacherAccountRegistrationForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registeredAccount, setRegisteredAccount] = useState<TeacherRegistrationResponse | null>(null);
  const form = useForm<TeacherRegistrationPayload>({
    resolver: zodResolver(teacherRegistrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      termsAccepted: false,
      privacyAccepted: false,
    },
  });

  async function submit(values: TeacherRegistrationPayload) {
    setSubmitError(null);
    const response = await fetch("/api/teachers/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setSubmitError(teacherEligibilityApiErrorMessage(payload));
      return;
    }

    setRegisteredAccount(payload as TeacherRegistrationResponse);
  }

  if (registeredAccount) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-950/10 ring-1 ring-slate-200 sm:p-8">
        <div className="flex size-14 items-center justify-center rounded-full bg-brand-orange text-white">
          <CheckCircle2Icon aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-3xl font-bold text-brand-navy">Öğretmen hesabın oluşturuldu</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Hesabın aktif. Özel ders ilanı yayınlamak istediğinde uygunluk testini tamamlaman gerekir.
        </p>
        <Button
          className="mt-6 bg-brand-orange text-white hover:bg-brand-orange/90"
          nativeButton={false}
          render={<Link href="/ogretmen-ilani-olustur" />}
        >
          İlan Oluştur
          <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-950/10 ring-1 ring-slate-200 sm:p-7">
      <div>
        <p className="text-sm font-semibold text-brand-orange">Öğretmen Hesabı</p>
        <h2 className="mt-1 text-2xl font-bold text-brand-navy">Test olmadan hesabını oluştur</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Bu adım sadece öğretmen hesabını açar. Ders ilanı oluşturma aşamasında uygunluk testi gösterilir.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-brand-navy">
          Ad soyad
          <input {...form.register("fullName")} className="h-11 rounded-lg border border-slate-200 px-3 text-sm" />
          <FieldError message={form.formState.errors.fullName?.message} />
        </label>
        <label className="grid gap-2 text-sm font-medium text-brand-navy">
          Telefon
          <input {...form.register("phone")} className="h-11 rounded-lg border border-slate-200 px-3 text-sm" />
          <FieldError message={form.formState.errors.phone?.message} />
        </label>
        <label className="grid gap-2 text-sm font-medium text-brand-navy">
          Email
          <input type="email" {...form.register("email")} className="h-11 rounded-lg border border-slate-200 px-3 text-sm" />
          <FieldError message={form.formState.errors.email?.message} />
        </label>
        <label className="grid gap-2 text-sm font-medium text-brand-navy">
          Şifre
          <input type="password" {...form.register("password")} className="h-11 rounded-lg border border-slate-200 px-3 text-sm" />
          <FieldError message={form.formState.errors.password?.message} />
        </label>
      </div>

      <div className="mt-5 grid gap-3">
        <label className="flex gap-3 rounded-xl border border-slate-200 p-4 text-sm text-brand-navy">
          <input type="checkbox" {...form.register("termsAccepted")} className="mt-1" />
          Kullanım koşullarını kabul ediyorum.
        </label>
        <FieldError message={form.formState.errors.termsAccepted?.message} />
        <label className="flex gap-3 rounded-xl border border-slate-200 p-4 text-sm text-brand-navy">
          <input type="checkbox" {...form.register("privacyAccepted")} className="mt-1" />
          Gizlilik politikası ve KVKK aydınlatma metnini kabul ediyorum.
        </label>
        <FieldError message={form.formState.errors.privacyAccepted?.message} />
      </div>

      <FieldError message={submitError ?? undefined} />

      <div className="mt-6 flex justify-end">
        <Button type="submit" className="bg-brand-orange text-white hover:bg-brand-orange/90" disabled={form.formState.isSubmitting}>
          <UserPlusIcon data-icon="inline-start" aria-hidden="true" />
          {form.formState.isSubmitting ? "Oluşturuluyor" : "Öğretmen Hesabı Oluştur"}
        </Button>
      </div>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </div>
  );
}
