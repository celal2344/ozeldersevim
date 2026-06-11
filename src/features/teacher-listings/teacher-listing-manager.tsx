"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2Icon, Loader2Icon, LockIcon, PlayCircleIcon, SaveIcon, SendIcon, XCircleIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch, type UseFormRegister } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  emptyTeacherListingDefaults,
  teacherListingDeliveryOptions,
  teacherListingSchema,
} from "@/features/teacher-listings/constants";
import type {
  LessonCategoryOption,
  LocationOption,
  TeacherListingInput,
  TeacherListingResource,
} from "@/features/teacher-listings/types";
import {
  fetchJson,
  firstListingFormError,
  isTeacherListingMessageError,
  listingInputFromResource,
  listingStatusLabel,
} from "@/features/teacher-listings/utils";
import type { TeacherEligibilityTest } from "@/features/teacher-eligibility/types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { PremiumSelect } from "@/shared/components/ui/premium-select";
import { Separator } from "@/shared/components/ui/separator";

export function TeacherListingManager() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | { text: string; isError?: boolean } | null>(null);
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({});
  const [testStarted, setTestStarted] = useState(false);
  const resourceQuery = useQuery({
    queryKey: ["teacher-listing"],
    queryFn: () => fetchJson<TeacherListingResource>("/api/teachers/me/listing"),
  });
  const eligibility = resourceQuery.data?.eligibility;
  const listing = resourceQuery.data?.listing;
  const canManageListing = eligibility?.status === "passed";
  const categoryQuery = useQuery({
    queryKey: ["lesson-categories"],
    queryFn: async () => (await fetchJson<{ categories: LessonCategoryOption[] }>("/api/lesson-categories")).categories,
    enabled: canManageListing,
  });
  const locationQuery = useQuery({
    queryKey: ["locations"],
    queryFn: async () => (await fetchJson<{ locations: LocationOption[] }>("/api/locations")).locations,
    enabled: canManageListing,
  });
  const testQuery = useQuery({
    queryKey: ["teacher-eligibility-test"],
    queryFn: async () => (await fetchJson<{ test: TeacherEligibilityTest }>("/api/teacher-eligibility/test")).test,
    enabled: !canManageListing && testStarted,
    retry: false,
  });
  const form = useForm<TeacherListingInput>({
    resolver: zodResolver(teacherListingSchema),
    defaultValues: emptyTeacherListingDefaults,
  });
  const selectedLessonSlugs = useWatch({ control: form.control, name: "lessonSlugs" }) ?? [];
  const selectedLocationSlug = useWatch({ control: form.control, name: "locationSlug" }) ?? "";
  const selectedDeliveryMode = useWatch({ control: form.control, name: "deliveryMode" }) ?? "both";
  const formError = firstListingFormError(form.formState.errors);
  const isFormDataLoading = canManageListing && (categoryQuery.isLoading || locationQuery.isLoading);

  useEffect(() => {
    if (!listing || !canManageListing) return;
    form.reset(listingInputFromResource(listing));
  }, [canManageListing, form, listing]);

  const saveMutation = useMutation({
    mutationFn: (input: TeacherListingInput) =>
      fetchJson<TeacherListingResource>("/api/teachers/me/listing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: (resource, variables) => {
      queryClient.setQueryData(["teacher-listing"], resource);
      setMessage(variables.status === "published" ? "İlan yayına alındı." : "İlan taslak olarak kaydedildi.");
    },
    onError: (error) => setMessage(error instanceof Error ? error.message : "İlan kaydedilemedi."),
  });
  const testMutation = useMutation({
    mutationFn: (payload: { testId: string; answers: { questionId: string; choiceId: string }[] }) =>
      fetchJson<{ status: "passed" | "failed"; score: number }>("/api/teacher-eligibility/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    onSuccess: async (result) => {
      setMessage(
        result.status === "passed"
          ? `Test geçildi. Puan: ${result.score}. Artık ilanını oluşturabilirsin.`
          : `Test geçilemedi. Puan: ${result.score}. Tekrar deneyebilirsin.`
      );
      await queryClient.invalidateQueries({ queryKey: ["teacher-listing"] });
      await queryClient.invalidateQueries({ queryKey: ["teacher-eligibility-test"] });
      if (result.status === "failed") {
        setTestAnswers({});
      }
    },
    onError: (error) => setMessage(error instanceof Error ? error.message : "Test gönderilemedi."),
  });
  const selectedLocationLabel = useMemo(() => {
    if (!canManageListing) return "Konum: testten sonra seçilecek";
    const selected = locationQuery.data?.find((location) => location.slug === selectedLocationSlug);
    return selected ? `${selected.city} / ${selected.district ?? "Merkez"}` : "Konum seçilmedi";
  }, [canManageListing, locationQuery.data, selectedLocationSlug]);
  const messageText = typeof message === "string" ? message : message?.text;
  const messageIsError =
    typeof message === "string" ? isTeacherListingMessageError(message) : message?.isError;

  function toggleLesson(slug: string) {
    const current = form.getValues("lessonSlugs");
    const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
    form.setValue("lessonSlugs", next, { shouldDirty: true, shouldValidate: true });
  }

  function setListingSelectValue(field: "deliveryMode" | "locationSlug", value: string) {
    form.setValue(field, value as TeacherListingInput[typeof field], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  function submitListing(status: "draft" | "published") {
    form.handleSubmit((values) => saveMutation.mutate({ ...values, status }))();
  }

  function submitTest() {
    if (!testQuery.data) return;
    const answers = testQuery.data.questions.flatMap((question) => {
      const choiceId = testAnswers[question.id];
      return choiceId ? [{ questionId: question.id, choiceId }] : [];
    });

    if (answers.length !== testQuery.data.questions.length) {
      setMessage({ text: "Tüm soruları cevaplamalısın.", isError: true });
      return;
    }

    testMutation.mutate({ testId: testQuery.data.id, answers });
  }

  if (resourceQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardDescription>İlanım</CardDescription>
          <CardTitle className="text-brand-navy">İlan bilgileri yükleniyor.</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardDescription>İlanım</CardDescription>
          <CardTitle className="text-2xl text-brand-navy">Öğretmen ilanını yönet.</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">İlan: {listingStatusLabel(listing?.status ?? "missing")}</Badge>
            <Badge variant={canManageListing ? "default" : "secondary"}>
              Test: {canManageListing ? "Geçildi" : "Bekliyor"}
            </Badge>
            <Badge variant="secondary">{selectedLocationLabel}</Badge>
          </div>
          {messageText ? <StatusMessage message={messageText} isError={messageIsError} /> : null}
          {resourceQuery.error || categoryQuery.error || locationQuery.error ? (
            <StatusMessage message="İlan ekranı için gerekli veriler alınamadı." isError />
          ) : null}
        </CardContent>
      </Card>

      {!canManageListing && !testStarted ? (
        <EligibilityGateCard
          onStart={() => {
            setMessage(null);
            setTestStarted(true);
          }}
        />
      ) : null}

      {!canManageListing && testStarted ? (
        <EligibilityTestCard
          answers={testAnswers}
          isLoading={testQuery.isLoading}
          isPending={testMutation.isPending}
          onAnswerChange={(questionId, choiceId) => {
            setMessage(null);
            setTestAnswers((current) => ({ ...current, [questionId]: choiceId }));
          }}
          onSubmit={submitTest}
          test={testQuery.data}
        />
      ) : null}

      {canManageListing ? (
        <ListingFormCard
          categoryQueryData={categoryQuery.data ?? []}
          formError={formError}
          isLoading={isFormDataLoading}
          isPending={saveMutation.isPending}
          locationQueryData={locationQuery.data ?? []}
          onSubmit={submitListing}
          onSelectValue={setListingSelectValue}
          onToggleLesson={toggleLesson}
          selectedDeliveryMode={selectedDeliveryMode}
          selectedLessonSlugs={selectedLessonSlugs}
          selectedLocationSlug={selectedLocationSlug}
          formRegister={form.register}
        />
      ) : null}
    </>
  );
}

function EligibilityGateCard({ onStart }: { onStart: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Öğretmenlik testi</CardDescription>
        <CardTitle className="text-brand-navy">İlan oluşturmadan önce testi geçmelisin.</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-brand-navy">
          <LockIcon data-icon="inline-start" aria-hidden="true" className="mt-0.5 text-brand-orange" />
          <p>
            Öğretmen hesabın hazır. Özel ders ilanı oluşturmak ve yayına almak için önce öğretmenlik uygunluk testini
            tamamlaman gerekiyor.
          </p>
        </div>
        <Button type="button" className="w-fit bg-brand-orange text-white hover:bg-brand-orange/90" onClick={onStart}>
          <PlayCircleIcon data-icon="inline-start" aria-hidden="true" />
          Teste Başla
        </Button>
      </CardContent>
    </Card>
  );
}

function EligibilityTestCard({
  answers,
  isLoading,
  isPending,
  onAnswerChange,
  onSubmit,
  test,
}: {
  answers: Record<string, string>;
  isLoading: boolean;
  isPending: boolean;
  onAnswerChange: (questionId: string, choiceId: string) => void;
  onSubmit: () => void;
  test?: TeacherEligibilityTest;
}) {
  if (isLoading || !test) {
    return (
      <Card>
        <CardHeader>
          <CardDescription>Öğretmenlik testi</CardDescription>
          <CardTitle className="text-brand-navy">Test hazırlanıyor.</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const allAnswered = test.questions.every((question) => answers[question.id]);

  return (
    <Card>
      <CardHeader>
        <CardDescription>Öğretmenlik testi</CardDescription>
        <CardTitle className="text-brand-navy">{test.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <p className="text-sm text-muted-foreground">
          İlan oluşturma formuna geçmek için testi tamamlamalısın. QA için her soruda ilk seçenek doğru olacak şekilde
          ayarlandı.
        </p>
        {test.questions.map((question) => (
          <div key={question.id} className="rounded-lg border p-4">
            <p className="font-medium text-brand-navy">{question.prompt}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {question.choices.map((choice) => (
                <label key={choice.id} className="flex items-center gap-3 rounded-lg border p-3 text-sm">
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[question.id] === choice.id}
                    onChange={() => onAnswerChange(question.id, choice.id)}
                  />
                  {choice.label}
                </label>
              ))}
            </div>
          </div>
        ))}
        <Button type="button" disabled={!allAnswered || isPending} onClick={onSubmit}>
          {isPending ? <Loader2Icon data-icon="inline-start" aria-hidden="true" /> : <CheckCircle2Icon data-icon="inline-start" aria-hidden="true" />}
          Testi Gönder
        </Button>
      </CardContent>
    </Card>
  );
}

function ListingFormCard({
  categoryQueryData,
  formError,
  formRegister,
  isLoading,
  isPending,
  locationQueryData,
  onSubmit,
  onSelectValue,
  onToggleLesson,
  selectedDeliveryMode,
  selectedLessonSlugs,
  selectedLocationSlug,
}: {
  categoryQueryData: LessonCategoryOption[];
  formError?: string;
  formRegister: UseFormRegister<TeacherListingInput>;
  isLoading: boolean;
  isPending: boolean;
  locationQueryData: LocationOption[];
  onSubmit: (status: "draft" | "published") => void;
  onSelectValue: (field: "deliveryMode" | "locationSlug", value: string) => void;
  onToggleLesson: (slug: string) => void;
  selectedDeliveryMode: TeacherListingInput["deliveryMode"];
  selectedLessonSlugs: string[];
  selectedLocationSlug: string;
}) {
  const locationOptions = [
    { value: "", label: "Konum seç" },
    ...locationQueryData.map((location) => ({
      value: location.slug,
      label: `${location.city} / ${location.district ?? "Merkez"}`,
    })),
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardDescription>Profil ve ilan bilgileri</CardDescription>
          <CardTitle className="text-brand-navy">Form verileri yükleniyor.</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>Profil ve ilan bilgileri</CardDescription>
        <CardTitle className="text-brand-navy">Ders ilanı</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-5">
          {formError ? <StatusMessage message={formError} isError /> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-brand-navy">
              İlan başlığı
              <Input {...formRegister("title")} placeholder="Matematik Öğretmeni" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-brand-navy">
              Saatlik fiyat
              <Input {...formRegister("hourlyPrice", { valueAsNumber: true })} type="number" min={1} placeholder="650" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-brand-navy">
              Deneyim yılı
              <Input {...formRegister("experienceYears", { valueAsNumber: true })} type="number" min={0} placeholder="5" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-brand-navy">
              Eğitim
              <Input {...formRegister("education")} placeholder="Atatürk Üniversitesi" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-brand-navy">
              Ders türü
              <PremiumSelect
                value={selectedDeliveryMode}
                onChange={(value) => onSelectValue("deliveryMode", value)}
                options={teacherListingDeliveryOptions}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-brand-navy">
              Konum
              <PremiumSelect
                value={selectedLocationSlug}
                onChange={(value) => onSelectValue("locationSlug", value)}
                options={locationOptions}
              />
            </label>
          </div>
          <label className="flex flex-col gap-2 text-sm font-medium text-brand-navy">
            Açıklama
            <textarea
              {...formRegister("bio")}
              className="min-h-32 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand-orange"
              placeholder="Ders yaklaşımını, uzmanlık alanlarını ve öğrenciye sağlayacağın desteği yaz."
            />
          </label>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-brand-navy">Verdiğin dersler</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {categoryQueryData.map((category) => (
                <label key={category.slug} className="flex items-center gap-3 rounded-lg border p-3 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedLessonSlugs.includes(category.slug)}
                    onChange={() => onToggleLesson(category.slug)}
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>
          <Separator />
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" disabled={isPending} onClick={() => onSubmit("draft")}>
              {isPending ? <Loader2Icon data-icon="inline-start" aria-hidden="true" /> : <SaveIcon data-icon="inline-start" aria-hidden="true" />}
              Taslak Kaydet
            </Button>
            <Button
              type="button"
              className="bg-brand-orange text-white hover:bg-brand-orange/90"
              disabled={isPending}
              onClick={() => onSubmit("published")}
            >
              {isPending ? <Loader2Icon data-icon="inline-start" aria-hidden="true" /> : <SendIcon data-icon="inline-start" aria-hidden="true" />}
              Yayına Al
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function StatusMessage({ isError = false, message }: { isError?: boolean; message: string }) {
  const Icon = isError ? XCircleIcon : CheckCircle2Icon;

  return (
    <div className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${isError ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
      <Icon data-icon="inline-start" aria-hidden="true" />
      {message}
    </div>
  );
}
