"use client";

import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { useState } from "react";

import {
  ELIGIBILITY_PASSING_SCORE,
  eligibilityQuestions,
} from "@/features/teacher-eligibility/constants";
import type { SubmitAttemptResponse } from "@/features/teacher-eligibility/types";
import { Button } from "@/shared/components/ui/button";

type Props = {
  onPassed: () => void;
};

export function EligibilityTest({ onPassed }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<SubmitAttemptResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const allAnswered = Object.keys(answers).length === eligibilityQuestions.length;

  async function startAndSubmit() {
    setError(null);
    setSubmitting(true);

    const startResponse = await fetch("/api/teacher-eligibility/attempts", { method: "POST" });
    const startPayload = await startResponse.json().catch(() => null);

    if (!startResponse.ok) {
      setError(startPayload?.message ?? "Test başlatılamadı.");
      setSubmitting(false);
      return;
    }

    const { attemptId } = startPayload as { attemptId: string };

    const submitResponse = await fetch(`/api/teacher-eligibility/attempts/${attemptId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId, answers }),
    });
    const submitPayload = await submitResponse.json().catch(() => null);

    if (!submitResponse.ok) {
      setError(submitPayload?.message ?? "Test gönderilemedi.");
      setSubmitting(false);
      return;
    }

    setResult(submitPayload as SubmitAttemptResponse);
    setSubmitting(false);
  }

  if (result) {
    if (result.passed) {
      return (
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex size-14 items-center justify-center rounded-full bg-green-500 text-white">
            <CheckCircle2Icon aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-brand-navy">Testi Geçtiniz!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Puanınız: <span className="font-semibold text-green-600">{result.score}/100</span> — Geçme puanı: {result.passingScore}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Şimdi öğretmen profilinizi oluşturabilirsiniz.
          </p>
          <Button
            className="mt-6 bg-brand-orange text-white hover:bg-brand-orange/90"
            onClick={onPassed}
          >
            Profil Oluşturmaya Devam Et
          </Button>
        </div>
      );
    }

    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="flex size-14 items-center justify-center rounded-full bg-red-500 text-white">
          <XCircleIcon aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-brand-navy">Testi Geçemediniz</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Puanınız: <span className="font-semibold text-red-600">{result.score}/100</span> — Geçme puanı: {result.passingScore}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Tekrar deneyebilirsiniz. Sayfayı yenileyin veya aşağıdan yeni denemeyi başlatın.
        </p>
        <Button
          className="mt-6 bg-brand-orange text-white hover:bg-brand-orange/90"
          onClick={() => {
            setResult(null);
            setAnswers({});
          }}
        >
          Tekrar Dene
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-2xl font-bold text-brand-navy">Öğretmenlik Uygunluk Testi</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {eligibilityQuestions.length} soruyu cevaplayın. Geçme puanı: %{ELIGIBILITY_PASSING_SCORE}
      </p>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="mt-8 grid gap-8">
        {eligibilityQuestions.map((question, index) => (
          <div key={question.id}>
            <p className="font-medium text-brand-navy">
              <span className="mr-2 text-muted-foreground">{index + 1}.</span>
              {question.text}
            </p>
            <div className="mt-3 grid gap-2">
              {question.options.map((option) => {
                const selected = answers[String(question.id)] === option.value;
                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors ${
                      selected
                        ? "border-brand-orange bg-orange-50 text-brand-navy"
                        : "border-slate-200 text-muted-foreground hover:border-brand-orange/50 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.value}
                      checked={selected}
                      onChange={() =>
                        setAnswers((prev) => ({ ...prev, [String(question.id)]: option.value }))
                      }
                      className="mt-0.5 accent-brand-orange"
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {Object.keys(answers).length}/{eligibilityQuestions.length} soru cevaplandı
        </p>
        <Button
          className="bg-brand-orange text-white hover:bg-brand-orange/90"
          onClick={startAndSubmit}
          disabled={!allAnswered || submitting}
        >
          {submitting ? "Gönderiliyor..." : "Testi Tamamla"}
        </Button>
      </div>
    </div>
  );
}
