"use client";

import { useMemo, useState } from "react";
import { CalendarPlusIcon, ChevronLeftIcon, ChevronRightIcon, SaveIcon, XCircleIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AvailabilityEditor } from "@/features/availability/availability-editor";
import { monthCalendarDays, monthLabel } from "@/features/availability/utils";
import { calendarLessonStatusOptions, lessonDurationOptions, lessonStatusLabels } from "@/features/calendar/constants";
import type { CalendarLesson, CreateCalendarLessonInput, TeacherCalendarResource } from "@/features/calendar/types";
import {
  calendarDayKey,
  calendarMonthRange,
  formatCurrency,
  formatDateTime,
  fromDateInputValue,
  toDateInputValue,
} from "@/features/calendar/utils";
import { deliveryModeLabels } from "@/features/requests/constants";
import type { TeacherAvailability } from "@/features/availability/types";
import type { LessonCategoryOption } from "@/features/teacher-listings/types";
import { fetchJson } from "@/features/teacher-listings/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { PremiumSelect } from "@/shared/components/ui/premium-select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet";
import { cn } from "@/shared/lib/utils";

type TeacherCalendarWorkspaceProps = {
  initialAvailability: TeacherAvailability;
};

type LessonFormState = {
  teacherStudentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  lessonSlug: string;
  scheduledAt: string;
  durationMinutes: string;
  priceAmount: string;
  deliveryMode: "online" | "face_to_face" | "both";
  notes: string;
};

export function TeacherCalendarWorkspace({ initialAvailability }: TeacherCalendarWorkspaceProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"lessons" | "availability">("lessons");
  const [monthDate, setMonthDate] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedLesson, setSelectedLesson] = useState<CalendarLesson | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const range = calendarMonthRange(monthDate);
  const calendarQuery = useQuery({
    queryKey: ["teacher-calendar", range.from, range.to],
    queryFn: () => fetchJson<TeacherCalendarResource>(`/api/teachers/me/calendar?from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}`),
  });
  const categoriesQuery = useQuery({
    queryKey: ["lesson-categories"],
    queryFn: async () => (await fetchJson<{ categories: LessonCategoryOption[] }>("/api/lesson-categories")).categories,
  });
  const lessonsByDay = useMemo(() => {
    const grouped = new Map<string, CalendarLesson[]>();
    for (const lesson of calendarQuery.data?.lessons ?? []) {
      if (!lesson.scheduledAt) continue;
      const key = calendarDayKey(lesson.scheduledAt);
      grouped.set(key, [...(grouped.get(key) ?? []), lesson]);
    }
    return grouped;
  }, [calendarQuery.data?.lessons]);
  const days = monthCalendarDays(monthDate);
  const summary = calendarQuery.data?.summary;
  const createMutation = useMutation({
    mutationFn: (input: CreateCalendarLessonInput) =>
      fetchJson<{ id: string }>("/api/teachers/me/calendar/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: async () => {
      setMessage("Ders takvime eklendi.");
      setIsCreateOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["teacher-calendar"] });
    },
    onError: (error) => setMessage(error instanceof Error ? error.message : "Ders eklenemedi."),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Record<string, unknown> }) =>
      fetchJson<{ id: string }>(`/api/teachers/me/calendar/lessons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: async () => {
      setMessage("Ders güncellendi.");
      setSelectedLesson(null);
      await queryClient.invalidateQueries({ queryKey: ["teacher-calendar"] });
    },
    onError: (error) => setMessage(error instanceof Error ? error.message : "Ders güncellenemedi."),
  });

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant={activeTab === "lessons" ? "default" : "outline"} onClick={() => setActiveTab("lessons")}>
          Ders Takvimi
        </Button>
        <Button type="button" variant={activeTab === "availability" ? "default" : "outline"} onClick={() => setActiveTab("availability")}>
          Müsaitlik
        </Button>
      </div>

      {activeTab === "availability" ? (
        <AvailabilityEditor initialAvailability={initialAvailability} />
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-4">
            <SummaryCard label="Gelecek Ders" value={String(summary?.futureLessonCount ?? 0)} />
            <SummaryCard label="Aktif Öğrenci" value={String(summary?.activeStudentCount ?? 0)} />
            <SummaryCard label="Bu Ay" value={formatCurrency(summary?.thisMonthIncome ?? 0)} />
            <SummaryCard label="Gelecek Gelir" value={formatCurrency(summary?.futureProjectedIncome ?? 0)} />
          </div>

          {message ? <div className="rounded-lg border border-orange-100 bg-orange-50 px-3 py-2 text-sm text-brand-navy">{message}</div> : null}

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardDescription>Ders takvimi</CardDescription>
                  <CardTitle className="capitalize text-brand-navy">{monthLabel(monthDate)}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="icon" onClick={() => setMonthDate((value) => new Date(value.getFullYear(), value.getMonth() - 1, 1))}>
                    <ChevronLeftIcon className="size-4" aria-hidden="true" />
                  </Button>
                  <Button type="button" variant="outline" size="icon" onClick={() => setMonthDate((value) => new Date(value.getFullYear(), value.getMonth() + 1, 1))}>
                    <ChevronRightIcon className="size-4" aria-hidden="true" />
                  </Button>
                  <Button type="button" className="bg-brand-orange text-white hover:bg-brand-orange/90" onClick={() => setIsCreateOpen(true)}>
                    <CalendarPlusIcon data-icon="inline-start" aria-hidden="true" />
                    Ders Ekle
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">
                {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => (
                  <div key={day} className="py-1">{day}</div>
                ))}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const dayLessons = lessonsByDay.get(calendarDayKey(day)) ?? [];
                  const inMonth = day.getMonth() === monthDate.getMonth();

                  return (
                    <div key={calendarDayKey(day)} className={cn("min-h-28 rounded-lg border p-1.5 text-xs", inMonth ? "bg-white" : "bg-slate-50 text-muted-foreground/70")}>
                      <div className="mb-1 font-semibold text-brand-navy">{day.getDate()}</div>
                      <div className="flex flex-col gap-1">
                        {dayLessons.slice(0, 3).map((lesson) => (
                          <button
                            key={lesson.id}
                            type="button"
                            className={cn(
                              "rounded px-1.5 py-1 text-left text-[11px] leading-tight ring-1",
                              lesson.status === "cancelled" ? "bg-slate-50 text-muted-foreground ring-slate-200" : "bg-orange-50 text-brand-navy ring-orange-100"
                            )}
                            onClick={() => setSelectedLesson(lesson)}
                          >
                            <span className="block truncate font-semibold">{lesson.studentName}</span>
                            <span className="block truncate">{new Date(lesson.scheduledAt as string).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
                          </button>
                        ))}
                        {dayLessons.length > 3 ? <span className="text-[11px] text-muted-foreground">+{dayLessons.length - 3} ders</span> : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {calendarQuery.data && calendarQuery.data.lessons.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Bu ay için takvimde planlanmış ders yok. Kabul edilen talepler tercih edilen saat içeriyorsa otomatik eklenir; ayrıca takvimden manuel ders ekleyebilirsin.
            </div>
          ) : null}

          {calendarQuery.data?.unscheduledRequests.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-brand-navy">Planlanmamış kabul edilen talepler</CardTitle>
                <CardDescription>Bu talepler kabul edildi ama takvimde ilk ders saati yok.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {calendarQuery.data.unscheduledRequests.map((request) => (
                  <div key={request.id} className="rounded-lg border p-3 text-sm">
                    <p className="font-semibold text-brand-navy">{request.studentName} · {request.lessonName}</p>
                    <p className="text-muted-foreground">{request.studentPhone || request.studentEmail}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </>
      )}

      <CreateLessonSheet
        categories={categoriesQuery.data ?? []}
        isOpen={isCreateOpen}
        isSaving={createMutation.isPending}
        resource={calendarQuery.data}
        onOpenChange={setIsCreateOpen}
        onSubmit={(input) => createMutation.mutate(input)}
      />
      <LessonDetailSheet
        isSaving={updateMutation.isPending}
        lesson={selectedLesson}
        onOpenChange={(open) => {
          if (!open) setSelectedLesson(null);
        }}
        onUpdate={(lesson, input) => updateMutation.mutate({ id: lesson.id, input })}
      />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl text-brand-navy">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function CreateLessonSheet({
  categories,
  isOpen,
  isSaving,
  resource,
  onOpenChange,
  onSubmit,
}: {
  categories: LessonCategoryOption[];
  isOpen: boolean;
  isSaving: boolean;
  resource?: TeacherCalendarResource;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CreateCalendarLessonInput) => void;
}) {
  const [form, setForm] = useState<LessonFormState>({
    teacherStudentId: "",
    studentName: "",
    studentEmail: "",
    studentPhone: "",
    lessonSlug: "",
    scheduledAt: "",
    durationMinutes: "60",
    priceAmount: "0",
    deliveryMode: "both",
    notes: "",
  });
  const studentOptions = [
    { value: "", label: "Yeni öğrenci" },
    ...(resource?.students ?? []).map((student) => ({ value: student.id, label: student.name })),
  ];
  const categoryOptions = categories.map((category) => ({ value: category.slug, label: category.name }));

  function submit() {
    onSubmit({
      teacherStudentId: form.teacherStudentId || null,
      studentName: form.teacherStudentId ? undefined : form.studentName,
      studentEmail: form.studentEmail,
      studentPhone: form.studentPhone,
      lessonSlug: form.lessonSlug,
      scheduledAt: fromDateInputValue(form.scheduledAt),
      durationMinutes: Number(form.durationMinutes),
      priceAmount: Number(form.priceAmount),
      deliveryMode: form.deliveryMode,
      notes: form.notes,
    });
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Ders Ekle</SheetTitle>
          <SheetDescription>Mevcut bir öğrenciye veya yeni bir isme ders planla.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-3 px-4">
          <PremiumSelect value={form.teacherStudentId} options={studentOptions} onChange={(value) => setForm((current) => ({ ...current, teacherStudentId: value }))} />
          {!form.teacherStudentId ? (
            <>
              <Input placeholder="Öğrenci adı" value={form.studentName} onChange={(event) => setForm((current) => ({ ...current, studentName: event.target.value }))} />
              <Input placeholder="Email" value={form.studentEmail} onChange={(event) => setForm((current) => ({ ...current, studentEmail: event.target.value }))} />
              <Input placeholder="Telefon" value={form.studentPhone} onChange={(event) => setForm((current) => ({ ...current, studentPhone: event.target.value }))} />
            </>
          ) : null}
          <PremiumSelect value={form.lessonSlug} options={categoryOptions} onChange={(value) => setForm((current) => ({ ...current, lessonSlug: value }))} />
          <Input type="datetime-local" value={form.scheduledAt} onChange={(event) => setForm((current) => ({ ...current, scheduledAt: event.target.value }))} />
          <PremiumSelect value={form.durationMinutes} options={lessonDurationOptions} onChange={(value) => setForm((current) => ({ ...current, durationMinutes: value }))} />
          <Input type="number" min="0" value={form.priceAmount} onChange={(event) => setForm((current) => ({ ...current, priceAmount: event.target.value }))} />
          <PremiumSelect
            value={form.deliveryMode}
            options={[
              { value: "both", label: deliveryModeLabels.both },
              { value: "online", label: deliveryModeLabels.online },
              { value: "face_to_face", label: deliveryModeLabels.face_to_face },
            ]}
            onChange={(value) => setForm((current) => ({ ...current, deliveryMode: value as LessonFormState["deliveryMode"] }))}
          />
          <Input placeholder="Not" value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
          <Button type="button" className="bg-brand-orange text-white hover:bg-brand-orange/90" disabled={isSaving} onClick={submit}>
            <SaveIcon data-icon="inline-start" aria-hidden="true" />
            Kaydet
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function LessonDetailSheet({
  isSaving,
  lesson,
  onOpenChange,
  onUpdate,
}: {
  isSaving: boolean;
  lesson: CalendarLesson | null;
  onOpenChange: (open: boolean) => void;
  onUpdate: (lesson: CalendarLesson, input: Record<string, unknown>) => void;
}) {
  function close(open: boolean) {
    onOpenChange(open);
  }

  return (
    <Sheet open={Boolean(lesson)} onOpenChange={close}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        {lesson ? (
          <LessonDetailForm
            key={lesson.id}
            isSaving={isSaving}
            lesson={lesson}
            onUpdate={onUpdate}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function LessonDetailForm({
  isSaving,
  lesson,
  onUpdate,
}: {
  isSaving: boolean;
  lesson: CalendarLesson;
  onUpdate: (lesson: CalendarLesson, input: Record<string, unknown>) => void;
}) {
  const [scheduledAt, setScheduledAt] = useState(toDateInputValue(lesson.scheduledAt));
  const [durationMinutes, setDurationMinutes] = useState(String(lesson.durationMinutes));
  const [priceAmount, setPriceAmount] = useState(String(lesson.priceAmount));
  const [status, setStatus] = useState(lesson.status);
  const [notes, setNotes] = useState(lesson.notes ?? "");
  const [cancellationReason, setCancellationReason] = useState(lesson.cancellationReason ?? "");

  function save() {
    onUpdate(lesson, {
      scheduledAt: fromDateInputValue(scheduledAt),
      durationMinutes: Number(durationMinutes),
      priceAmount: Number(priceAmount),
      status,
      notes,
      cancellationReason,
    });
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle>{lesson.studentName}</SheetTitle>
        <SheetDescription>{lesson.lessonName} · {formatDateTime(lesson.scheduledAt)}</SheetDescription>
      </SheetHeader>
      <div className="grid gap-3 px-4">
        <div className="flex flex-wrap gap-2">
          <Badge>{lessonStatusLabels[lesson.status]}</Badge>
          <Badge variant="secondary">{deliveryModeLabels[lesson.deliveryMode]}</Badge>
        </div>
        {lesson.studentPhone ? <a className="text-sm text-brand-orange hover:underline" href={`tel:${lesson.studentPhone}`}>{lesson.studentPhone}</a> : null}
        {lesson.studentEmail ? <a className="text-sm text-brand-orange hover:underline" href={`mailto:${lesson.studentEmail}`}>{lesson.studentEmail}</a> : null}
        <Input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} />
        <PremiumSelect value={durationMinutes} options={lessonDurationOptions} onChange={setDurationMinutes} />
        <Input type="number" min="0" value={priceAmount} onChange={(event) => setPriceAmount(event.target.value)} />
        <PremiumSelect value={status} options={calendarLessonStatusOptions} onChange={(value) => setStatus(value as CalendarLesson["status"])} />
        <Input placeholder="Not" value={notes} onChange={(event) => setNotes(event.target.value)} />
        {status === "cancelled" ? (
          <Input placeholder="İptal sebebi" value={cancellationReason} onChange={(event) => setCancellationReason(event.target.value)} />
        ) : null}
        <Button type="button" className="bg-brand-orange text-white hover:bg-brand-orange/90" disabled={isSaving} onClick={save}>
          <SaveIcon data-icon="inline-start" aria-hidden="true" />
          Kaydet
        </Button>
        {lesson.status !== "cancelled" ? (
          <Button type="button" variant="outline" disabled={isSaving} onClick={() => onUpdate(lesson, { status: "cancelled", cancellationReason: "Öğretmen tarafından iptal edildi." })}>
            <XCircleIcon data-icon="inline-start" aria-hidden="true" />
            Dersi İptal Et
          </Button>
        ) : null}
      </div>
    </>
  );
}
