"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2Icon, SendIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  deliveryModeOptions,
  lessonCategoryOptions,
  locationOptions,
  teacherOnboardingSchema,
} from "@/features/teachers/onboarding-constants";
import type { TeacherOnboardingFormValues, TeacherOnboardingResponse } from "@/features/teachers/onboarding-types";
import { Button } from "@/shared/components/ui/button";

export function TeacherOnboardingForm() {
  const [done, setDone] = useState<TeacherOnboardingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TeacherOnboardingFormValues>({
    resolver: zodResolver(teacherOnboardingSchema),
    defaultValues: {
      title: "",
      bio: "",
      education: "",
      experienceYears: "",
      hourlyPrice: "",
      deliveryMode: "both",
      locationSlug: "",
      lessonSlugs: [],
      publishNow: true,
    },
  });

  async function submit(values: TeacherOnboardingFormValues) {
    setError(null);
    const response = await fetch("/api/teachers/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setError(payload?.message ?? "Profil oluşturulamadı.");
      return;
    }

    setDone(payload as TeacherOnboardingResponse);
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="flex size-14 items-center justify-center rounded-full bg-brand-orange text-white">
          <CheckCircle2Icon aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-brand-navy">
          {done.status === "published" ? "Profiliniz Yayında!" : "Profiliniz Kaydedildi!"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {done.status === "published"
            ? "Profiliniz yayına alındı. Öğrenciler artık sizi bulabilir."
            : "Profiliniz taslak olarak kaydedildi. İstediğinizde yayına alabilirsiniz."}
        </p>
        {done.status === "published" ? (
          <Button
            className="mt-6 bg-brand-orange text-white hover:bg-brand-orange/90"
            nativeButton={false}
            render={<Link href={`/ogretmen/${done.listingSlug}`} />}
          >
            Profilimi Görüntüle
          </Button>
        ) : null}
      </div>
    );
  }

  const errors = form.formState.errors;
  const selectedLessons = form.watch("lessonSlugs");

  function toggleLesson(slug: string) {
    const current = form.getValues("lessonSlugs");
    if (current.includes(slug)) {
      form.setValue("lessonSlugs", current.filter((s) => s !== slug), { shouldValidate: true });
    } else {
      form.setValue("lessonSlugs", [...current, slug], { shouldValidate: true });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-2xl font-bold text-brand-navy">Öğretmen Profilini Oluştur</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Öğrencilerin sizi bulması için profilinizi doldurun.
      </p>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="mt-8 grid gap-6">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-brand-navy">
            Profil Başlığı <span className="text-red-500">*</span>
          </label>
          <input
            {...form.register("title")}
            placeholder="Örn: Matematik ve Fizik Özel Dersleri"
            className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-brand-navy outline-none focus:border-brand-orange"
          />
          {errors.title ? <p className="text-xs text-red-600">{errors.title.message}</p> : null}
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-brand-navy">
            Hakkımda <span className="text-red-500">*</span>
          </label>
          <textarea
            {...form.register("bio")}
            rows={4}
            placeholder="Kendinizi tanıtın. Öğrencilere nasıl yardımcı olabileceğinizi yazın."
            className="rounded-lg border border-slate-200 px-3 py-3 text-sm text-brand-navy outline-none focus:border-brand-orange"
          />
          {errors.bio ? <p className="text-xs text-red-600">{errors.bio.message}</p> : null}
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-brand-navy">
            Eğitim Bilgisi <span className="text-red-500">*</span>
          </label>
          <input
            {...form.register("education")}
            placeholder="Örn: Orta Doğu Teknik Üniversitesi, Matematik Bölümü"
            className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-brand-navy outline-none focus:border-brand-orange"
          />
          {errors.education ? <p className="text-xs text-red-600">{errors.education.message}</p> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-brand-navy">
              Tecrübe (yıl) <span className="text-red-500">*</span>
            </label>
            <input
              {...form.register("experienceYears")}
              inputMode="numeric"
              placeholder="Örn: 3"
              className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-brand-navy outline-none focus:border-brand-orange"
            />
            {errors.experienceYears ? (
              <p className="text-xs text-red-600">{errors.experienceYears.message}</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-brand-navy">
              Saatlik Ücret (₺) <span className="text-red-500">*</span>
            </label>
            <input
              {...form.register("hourlyPrice")}
              inputMode="numeric"
              placeholder="Örn: 500"
              className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-brand-navy outline-none focus:border-brand-orange"
            />
            {errors.hourlyPrice ? (
              <p className="text-xs text-red-600">{errors.hourlyPrice.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-brand-navy">
              Ders Türü <span className="text-red-500">*</span>
            </label>
            <select
              {...form.register("deliveryMode")}
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-brand-navy"
            >
              {deliveryModeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.deliveryMode ? (
              <p className="text-xs text-red-600">{errors.deliveryMode.message}</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-brand-navy">
              Konum <span className="text-red-500">*</span>
            </label>
            <select
              {...form.register("locationSlug")}
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-brand-navy"
            >
              <option value="">Şehir / İlçe seçin</option>
              {locationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.locationSlug ? (
              <p className="text-xs text-red-600">{errors.locationSlug.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-brand-navy">
            Verdiğiniz Dersler <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {lessonCategoryOptions.map((cat) => {
              const active = selectedLessons.includes(cat.value);
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => toggleLesson(cat.value)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-brand-orange text-white"
                      : "bg-slate-100 text-brand-navy hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
          {errors.lessonSlugs ? (
            <p className="text-xs text-red-600">{errors.lessonSlugs.message}</p>
          ) : null}
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
          <input
            type="checkbox"
            {...form.register("publishNow")}
            className="accent-brand-orange"
          />
          <div>
            <p className="text-sm font-medium text-brand-navy">Profili hemen yayına al</p>
            <p className="text-xs text-muted-foreground">
              İşareti kaldırırsanız profil taslak olarak kaydedilir, daha sonra yayınlayabilirsiniz.
            </p>
          </div>
        </label>
      </div>

      <Button
        type="submit"
        className="mt-8 w-full bg-brand-orange text-white hover:bg-brand-orange/90"
        disabled={form.formState.isSubmitting}
      >
        <SendIcon data-icon="inline-start" aria-hidden="true" />
        {form.formState.isSubmitting ? "Kaydediliyor..." : "Profili Oluştur"}
      </Button>
    </form>
  );
}
