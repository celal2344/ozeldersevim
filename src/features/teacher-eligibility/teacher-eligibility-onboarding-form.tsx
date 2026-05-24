"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, CheckCircle2Icon, RotateCcwIcon, SendIcon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import {
  teacherEligibilityAttemptSchema,
  teacherEligibilityPassingScore,
  teacherOnboardingDeliveryModeOptions,
  teacherOnboardingSchema,
} from "@/features/teacher-eligibility/constants";
import type {
  TeacherEligibilityAnswer,
  TeacherEligibilityAttemptPayload,
  TeacherEligibilityResult,
  TeacherOnboardingPayload,
  TeacherOnboardingResponse,
} from "@/features/teacher-eligibility/types";
import {
  defaultTeacherEligibilityAnswers,
  publicTeacherEligibilityQuestions,
  teacherEligibilityApiErrorMessage,
} from "@/features/teacher-eligibility/utils";
import {
  lessonRequestLessonOptions,
  lessonRequestLocationOptions,
} from "@/features/requests/constants";
import { Button } from "@/shared/components/ui/button";

export function TeacherEligibilityOnboardingForm() {
  const questions = useMemo(() => publicTeacherEligibilityQuestions(), []);
  const [testResult, setTestResult] = useState<TeacherEligibilityResult | null>(null);
  const [passedAnswers, setPassedAnswers] = useState<TeacherEligibilityAnswer[] | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completedProfile, setCompletedProfile] = useState<TeacherOnboardingResponse | null>(null);
  const testForm = useForm<TeacherEligibilityAttemptPayload>({
    resolver: zodResolver(teacherEligibilityAttemptSchema),
    defaultValues: {
      answers: defaultTeacherEligibilityAnswers(),
    },
  });
  const onboardingForm = useForm<TeacherOnboardingPayload>({
    resolver: zodResolver(teacherOnboardingSchema),
    defaultValues: {
      eligibilityAnswers: defaultTeacherEligibilityAnswers(),
      fullName: "",
      email: "",
      password: "",
      phone: "",
      locationSlug: "erzurum-yakutiye",
      hourlyPrice: 650,
      title: "",
      bio: "",
      lessonSlugs: ["matematik"],
      education: "",
      experienceYears: 0,
      deliveryMode: "both",
      termsAccepted: false,
      privacyAccepted: false,
    },
  });

  async function submitTest(values: TeacherEligibilityAttemptPayload) {
    setTestError(null);
    setSubmitError(null);
    const response = await fetch("/api/teacher-eligibility/attempts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setTestError(teacherEligibilityApiErrorMessage(payload));
      return;
    }

    const result = payload as TeacherEligibilityResult;
    setTestResult(result);

    if (result.passed) {
      setPassedAnswers(values.answers);
      onboardingForm.setValue("eligibilityAnswers", values.answers, { shouldValidate: true });
      return;
    }

    setPassedAnswers(null);
  }

  function resetTest() {
    const answers = defaultTeacherEligibilityAnswers();
    setTestResult(null);
    setPassedAnswers(null);
    setTestError(null);
    setSubmitError(null);
    testForm.reset({ answers });
    onboardingForm.setValue("eligibilityAnswers", answers);
  }

  async function submitOnboarding(values: TeacherOnboardingPayload) {
    setSubmitError(null);

    if (!passedAnswers) {
      setSubmitError("Öğretmen hesabı oluşturmak için önce uygunluk testini geçmelisin.");
      return;
    }

    const response = await fetch("/api/teachers/onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        eligibilityAnswers: passedAnswers,
      }),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setSubmitError(teacherEligibilityApiErrorMessage(payload));
      return;
    }

    setCompletedProfile(payload as TeacherOnboardingResponse);
  }

  if (completedProfile) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-950/10 ring-1 ring-slate-200 sm:p-8">
        <div className="flex size-14 items-center justify-center rounded-full bg-brand-orange text-white">
          <CheckCircle2Icon aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-3xl font-bold text-brand-navy">Öğretmen ilanı yayında</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Test sonucunu ve profil bilgilerini kaydettik. İlanın admin onayı beklemeden yayına alındı.
        </p>
        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-brand-navy">
          Profil numarası: <span className="font-semibold">{completedProfile.teacherProfileId}</span>
        </div>
        <Button
          className="mt-6 bg-brand-orange text-white hover:bg-brand-orange/90"
          nativeButton={false}
          render={<Link href={`/ogretmen/${completedProfile.listingSlug}`} />}
        >
          Profili Gör
          <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={testForm.handleSubmit(submitTest)} className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-950/10 ring-1 ring-slate-200 sm:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-orange">1. Uygunluk Testi</p>
            <h2 className="mt-1 text-2xl font-bold text-brand-navy">Öğretmenlik uygunluğunu doğrula</h2>
          </div>
          <span className="rounded-full bg-brand-orange-soft px-3 py-1 text-xs font-semibold text-brand-navy">
            Geçme puanı {teacherEligibilityPassingScore}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Bu test temel platform kuralları, iletişim ve ders yönetimi beklentilerini ölçer.
        </p>

        <fieldset disabled={Boolean(passedAnswers)} className="mt-6 grid gap-4 disabled:opacity-75">
          {questions.map((question, questionIndex) => (
            <div key={question.id} className="rounded-xl border border-slate-200 p-4">
              <input type="hidden" {...testForm.register(`answers.${questionIndex}.questionId` as const)} />
              <p className="font-semibold leading-6 text-brand-navy">
                {questionIndex + 1}. {question.prompt}
              </p>
              <div className="mt-3 grid gap-2">
                {question.options.map((option) => (
                  <label key={option.id} className="flex gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm text-brand-navy">
                    <input
                      type="radio"
                      value={option.id}
                      {...testForm.register(`answers.${questionIndex}.optionId` as const)}
                      className="mt-1"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
              <FieldError message={testForm.formState.errors.answers?.[questionIndex]?.optionId?.message} />
            </div>
          ))}
        </fieldset>

        <FieldError message={testError ?? undefined} />

        {testResult ? (
          <div
            className={
              testResult.passed
                ? "mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                : "mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            }
          >
            Skorun {testResult.score}. {testResult.passed ? "Onboarding formuna geçebilirsin." : "Geçmek için tekrar deneyebilirsin."}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          {testResult && !testResult.passed ? (
            <Button type="button" variant="outline" onClick={resetTest}>
              <RotateCcwIcon data-icon="inline-start" aria-hidden="true" />
              Tekrar Dene
            </Button>
          ) : null}
          {!passedAnswers ? (
            <Button type="submit" className="bg-brand-orange text-white hover:bg-brand-orange/90" disabled={testForm.formState.isSubmitting}>
              <ShieldCheckIcon data-icon="inline-start" aria-hidden="true" />
              {testForm.formState.isSubmitting ? "Kontrol ediliyor" : "Testi Tamamla"}
            </Button>
          ) : null}
        </div>
      </form>

      {passedAnswers ? (
        <form onSubmit={onboardingForm.handleSubmit(submitOnboarding)} className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-950/10 ring-1 ring-slate-200 sm:p-7">
          <div>
            <p className="text-sm font-semibold text-brand-orange">2. Öğretmen Profili</p>
            <h2 className="mt-1 text-2xl font-bold text-brand-navy">Hesabını ve ilanını oluştur</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Bu MVP akışında uygun öğretmenler admin onayı beklemeden yayına alınır.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-brand-navy">
              Ad soyad
              <input {...onboardingForm.register("fullName")} className="h-11 rounded-lg border border-slate-200 px-3 text-sm" />
              <FieldError message={onboardingForm.formState.errors.fullName?.message} />
            </label>
            <label className="grid gap-2 text-sm font-medium text-brand-navy">
              Telefon
              <input {...onboardingForm.register("phone")} className="h-11 rounded-lg border border-slate-200 px-3 text-sm" />
              <FieldError message={onboardingForm.formState.errors.phone?.message} />
            </label>
            <label className="grid gap-2 text-sm font-medium text-brand-navy">
              Email
              <input type="email" {...onboardingForm.register("email")} className="h-11 rounded-lg border border-slate-200 px-3 text-sm" />
              <FieldError message={onboardingForm.formState.errors.email?.message} />
            </label>
            <label className="grid gap-2 text-sm font-medium text-brand-navy">
              Şifre
              <input type="password" {...onboardingForm.register("password")} className="h-11 rounded-lg border border-slate-200 px-3 text-sm" />
              <FieldError message={onboardingForm.formState.errors.password?.message} />
            </label>
            <label className="grid gap-2 text-sm font-medium text-brand-navy">
              Konum
              <select {...onboardingForm.register("locationSlug")} className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm">
                {lessonRequestLocationOptions.map((location) => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </select>
              <FieldError message={onboardingForm.formState.errors.locationSlug?.message} />
            </label>
            <label className="grid gap-2 text-sm font-medium text-brand-navy">
              Saatlik ücret
              <input
                type="number"
                min={1}
                {...onboardingForm.register("hourlyPrice", { valueAsNumber: true })}
                className="h-11 rounded-lg border border-slate-200 px-3 text-sm"
              />
              <FieldError message={onboardingForm.formState.errors.hourlyPrice?.message} />
            </label>
            <label className="grid gap-2 text-sm font-medium text-brand-navy">
              Profil başlığı
              <input {...onboardingForm.register("title")} placeholder="Matematik Öğretmeni" className="h-11 rounded-lg border border-slate-200 px-3 text-sm" />
              <FieldError message={onboardingForm.formState.errors.title?.message} />
            </label>
            <label className="grid gap-2 text-sm font-medium text-brand-navy">
              Eğitim
              <input {...onboardingForm.register("education")} placeholder="Atatürk Üniversitesi" className="h-11 rounded-lg border border-slate-200 px-3 text-sm" />
              <FieldError message={onboardingForm.formState.errors.education?.message} />
            </label>
            <label className="grid gap-2 text-sm font-medium text-brand-navy">
              Deneyim yılı
              <input
                type="number"
                min={0}
                {...onboardingForm.register("experienceYears", { valueAsNumber: true })}
                className="h-11 rounded-lg border border-slate-200 px-3 text-sm"
              />
              <FieldError message={onboardingForm.formState.errors.experienceYears?.message} />
            </label>
            <label className="grid gap-2 text-sm font-medium text-brand-navy">
              Ders türü
              <select {...onboardingForm.register("deliveryMode")} className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm">
                {teacherOnboardingDeliveryModeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <FieldError message={onboardingForm.formState.errors.deliveryMode?.message} />
            </label>
          </div>

          <label className="mt-4 grid gap-2 text-sm font-medium text-brand-navy">
            Biyografi
            <textarea
              {...onboardingForm.register("bio")}
              rows={5}
              placeholder="Ders yaklaşımını, hangi seviyelere destek verdiğini ve öğrencilerle nasıl çalıştığını anlat."
              className="rounded-lg border border-slate-200 px-3 py-3 text-sm"
            />
            <FieldError message={onboardingForm.formState.errors.bio?.message} />
          </label>

          <div className="mt-5">
            <p className="text-sm font-medium text-brand-navy">Vereceğin dersler</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {lessonRequestLessonOptions.map((lesson) => (
                <label key={lesson.value} className="flex gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm text-brand-navy">
                  <input type="checkbox" value={lesson.value} {...onboardingForm.register("lessonSlugs")} className="mt-1" />
                  {lesson.label}
                </label>
              ))}
            </div>
            <FieldError message={onboardingForm.formState.errors.lessonSlugs?.message} />
          </div>

          <div className="mt-5 grid gap-3">
            <label className="flex gap-3 rounded-xl border border-slate-200 p-4 text-sm text-brand-navy">
              <input type="checkbox" {...onboardingForm.register("termsAccepted")} className="mt-1" />
              Kullanım koşullarını kabul ediyorum.
            </label>
            <FieldError message={onboardingForm.formState.errors.termsAccepted?.message} />
            <label className="flex gap-3 rounded-xl border border-slate-200 p-4 text-sm text-brand-navy">
              <input type="checkbox" {...onboardingForm.register("privacyAccepted")} className="mt-1" />
              Gizlilik politikası ve KVKK aydınlatma metnini kabul ediyorum.
            </label>
            <FieldError message={onboardingForm.formState.errors.privacyAccepted?.message} />
          </div>

          <FieldError message={submitError ?? undefined} />

          <div className="mt-6 flex justify-end">
            <Button type="submit" className="bg-brand-orange text-white hover:bg-brand-orange/90" disabled={onboardingForm.formState.isSubmitting}>
              <SendIcon data-icon="inline-start" aria-hidden="true" />
              {onboardingForm.formState.isSubmitting ? "Kaydediliyor" : "Hesabı ve İlanı Oluştur"}
            </Button>
          </div>
        </form>
      ) : null}
    </div>
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
