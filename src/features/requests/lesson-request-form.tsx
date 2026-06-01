"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ArrowRightIcon, CheckCircle2Icon, SendIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";

import {
  contactPreferenceOptions,
  lessonRequestFormSchema,
  lessonRequestFormStepFields,
  lessonRequestLessonOptions,
  lessonRequestLocationOptions,
  lessonRequestSteps,
  studentLevelOptions,
} from "@/features/requests/constants";
import type { LessonRequestFormValues, SubmitLessonRequestResponse } from "@/features/requests/types";
import {
  apiErrorMessage,
  defaultDeliveryModeForTeacher,
  deliveryOptionsForTeacher,
  formValuesToSubmitPayload,
  lessonSlugFromName,
  locationSlugFromTeacher,
} from "@/features/requests/utils";
import type { TeacherProfile } from "@/features/teachers/types";
import { Button } from "@/shared/components/ui/button";

type LessonRequestFormProps = {
  accountContact: {
    fullName: string;
    email: string;
    phone: string;
  };
  teacher: TeacherProfile;
};

export function LessonRequestForm({ accountContact, teacher }: LessonRequestFormProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completedRequest, setCompletedRequest] = useState<SubmitLessonRequestResponse | null>(null);
  const form = useForm<LessonRequestFormValues>({
    resolver: zodResolver(lessonRequestFormSchema),
    defaultValues: {
      teacherSlug: teacher.slug,
      lessonSlug: lessonSlugFromName(teacher.lessons[0] ?? ""),
      locationSlug: locationSlugFromTeacher(teacher),
      deliveryMode: defaultDeliveryModeForTeacher(teacher),
      studentLevel: "",
      goal: "",
      budgetMin: "",
      budgetMax: "",
      studentName: accountContact.fullName,
      email: accountContact.email,
      phone: accountContact.phone,
      contactPreference: "phone",
      termsAccepted: false,
      privacyAccepted: false,
    },
  });

  const currentStep = lessonRequestSteps[stepIndex];
  const errors = form.formState.errors;
  const isLastStep = stepIndex === lessonRequestSteps.length - 1;

  async function goNext() {
    const fields = lessonRequestFormStepFields[currentStep.id] as readonly FieldPath<LessonRequestFormValues>[];
    const valid = await form.trigger(fields);
    if (valid) setStepIndex((value) => Math.min(value + 1, lessonRequestSteps.length - 1));
  }

  function goBack() {
    setStepIndex((value) => Math.max(value - 1, 0));
  }

  async function submit(values: LessonRequestFormValues) {
    setSubmitError(null);
    const response = await fetch("/api/lesson-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValuesToSubmitPayload(values)),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setSubmitError(apiErrorMessage(payload));
      return;
    }

    setCompletedRequest(payload as SubmitLessonRequestResponse);
  }

  if (completedRequest) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="flex size-14 items-center justify-center rounded-full bg-brand-orange text-white">
          <CheckCircle2Icon aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-3xl font-bold text-brand-navy">Ders talebin alındı</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Talebin öğretmene iletilmek üzere kaydedildi. Öğretmen talebi kabul ettiğinde iletişim bilgilerin
          öğretmenle paylaşılır.
        </p>
        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-brand-navy">
          Talep numarası: <span className="font-semibold">{completedRequest.requestId}</span>
        </div>
        <Button
          className="mt-6 bg-brand-orange text-white hover:bg-brand-orange/90"
          nativeButton={false}
          render={<Link href={`/ogretmen/${teacher.slug}`} />}
        >
          Öğretmen profiline dön
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <div className="flex flex-wrap gap-2">
        {lessonRequestSteps.map((step, index) => (
          <span
            key={step.id}
            className={
              index === stepIndex
                ? "rounded-full bg-brand-orange px-3 py-1 text-xs font-medium text-white"
                : "rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-brand-navy"
            }
          >
            {index + 1}. {step.title}
          </span>
        ))}
      </div>

      <div className="mt-8">
        {currentStep.id === "lesson" ? (
          <div className="grid gap-5">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy">Hangi dersten destek istiyorsun?</h2>
              <p className="mt-2 text-sm text-muted-foreground">Seçim öğretmenin verdiği derslerle uyumlu olmalı.</p>
            </div>
            <FieldError message={errors.lessonSlug?.message} />
            <select {...form.register("lessonSlug")} className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-brand-navy">
              {lessonRequestLessonOptions.map((lesson) => (
                <option key={lesson.value} value={lesson.value}>
                  {lesson.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {currentStep.id === "location" ? (
          <div className="grid gap-5">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy">Konum ve ders türü</h2>
              <p className="mt-2 text-sm text-muted-foreground">Online derslerde görüşme linkini taraflar kendi oluşturur.</p>
            </div>
            <FieldError message={errors.locationSlug?.message ?? errors.deliveryMode?.message} />
            <div className="grid gap-4 md:grid-cols-2">
              <select {...form.register("locationSlug")} className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-brand-navy">
                {lessonRequestLocationOptions.map((location) => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </select>
              <select {...form.register("deliveryMode")} className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-brand-navy">
                {deliveryOptionsForTeacher(teacher).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}

        {currentStep.id === "details" ? (
          <div className="grid gap-5">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy">Ders ihtiyacını anlat</h2>
              <p className="mt-2 text-sm text-muted-foreground">Öğretmenin talebi değerlendirmesi için kısa ve net bilgi ver.</p>
            </div>
            <FieldError message={errors.studentLevel?.message ?? errors.goal?.message ?? errors.budgetMin?.message ?? errors.budgetMax?.message} />
            <select {...form.register("studentLevel")} className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-brand-navy">
              <option value="">Seviye seç</option>
              {studentLevelOptions.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            <textarea
              {...form.register("goal")}
              rows={5}
              placeholder="Örn. LGS matematikte problem sorularında destek istiyorum."
              className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-brand-navy outline-none focus:border-brand-orange"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <input {...form.register("budgetMin")} inputMode="numeric" placeholder="Minimum bütçe" className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-brand-navy" />
              <input {...form.register("budgetMax")} inputMode="numeric" placeholder="Maksimum bütçe" className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-brand-navy" />
            </div>
          </div>
        ) : null}

        {currentStep.id === "contact" ? (
          <div className="grid gap-5">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy">İletişim bilgileri</h2>
              <p className="mt-2 text-sm text-muted-foreground">Bu bilgiler öğretmen talebi kabul edince paylaşılır.</p>
            </div>
            <FieldError message={errors.studentName?.message ?? errors.email?.message ?? errors.phone?.message ?? errors.contactPreference?.message ?? errors.termsAccepted?.message ?? errors.privacyAccepted?.message ?? submitError ?? undefined} />
            <div className="grid gap-4 md:grid-cols-2">
              <input {...form.register("studentName")} placeholder="Ad soyad" className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-brand-navy" />
              <input {...form.register("email")} type="email" placeholder="Email" className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-brand-navy" />
              <input {...form.register("phone")} placeholder="Telefon" className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-brand-navy" />
              <select {...form.register("contactPreference")} className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-brand-navy">
                {contactPreferenceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex gap-3 rounded-xl border border-slate-200 p-4 text-sm text-brand-navy">
              <input type="checkbox" {...form.register("termsAccepted")} className="mt-1" />
              Kullanım koşullarını kabul ediyorum.
            </label>
            <label className="flex gap-3 rounded-xl border border-slate-200 p-4 text-sm text-brand-navy">
              <input type="checkbox" {...form.register("privacyAccepted")} className="mt-1" />
              Gizlilik politikası ve KVKK aydınlatma metnini kabul ediyorum.
            </label>
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button type="button" variant="outline" onClick={goBack} disabled={stepIndex === 0}>
          <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
          Geri
        </Button>
        {isLastStep ? (
          <Button type="submit" className="bg-brand-orange text-white hover:bg-brand-orange/90" disabled={form.formState.isSubmitting}>
            <SendIcon data-icon="inline-start" aria-hidden="true" />
            {form.formState.isSubmitting ? "Gönderiliyor" : "Talebi Gönder"}
          </Button>
        ) : (
          <Button type="button" className="bg-brand-orange text-white hover:bg-brand-orange/90" onClick={goNext}>
            Devam
            <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
          </Button>
        )}
      </div>
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
