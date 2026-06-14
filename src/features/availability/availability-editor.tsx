"use client";

import { PlusIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import {
  availabilityExceptionTypeOptions,
  endHourOptions,
  hourOptions,
  weekdayOptions,
} from "@/features/availability/constants";
import { AvailabilityPreview } from "@/features/availability/availability-preview";
import { MonthlyCalendarPreview } from "@/features/availability/monthly-calendar-preview";
import type {
  AvailabilityException,
  AvailabilityExceptionType,
  AvailabilitySlot,
  TeacherAvailability,
  Weekday,
} from "@/features/availability/types";
import { sortAvailabilityExceptions, sortAvailabilitySlots, validateAvailability } from "@/features/availability/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { PremiumSelect } from "@/shared/components/ui/premium-select";

type AvailabilityEditorProps = {
  initialAvailability: TeacherAvailability;
};

export function AvailabilityEditor({ initialAvailability }: AvailabilityEditorProps) {
  const [availability, setAvailability] = useState<TeacherAvailability>(initialAvailability);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const validationErrors = validateAvailability(availability);

  function updateSlot(index: number, patch: Partial<AvailabilitySlot>) {
    setAvailability((current) => ({
      ...current,
      weeklySlots: current.weeklySlots.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, ...patch } : slot
      ),
    }));
  }

  function removeSlot(index: number) {
    setAvailability((current) => ({
      ...current,
      weeklySlots: current.weeklySlots.filter((_, slotIndex) => slotIndex !== index),
    }));
  }

  function addSlot(weekday: Weekday) {
    setAvailability((current) => ({
      ...current,
      weeklySlots: sortAvailabilitySlots([
        ...current.weeklySlots,
        { weekday, startHour: 9, endHour: 10 },
      ]),
    }));
  }

  function updateException(index: number, patch: Partial<AvailabilityException>) {
    setAvailability((current) => ({
      ...current,
      exceptions: current.exceptions.map((exception, exceptionIndex) =>
        exceptionIndex === index ? { ...exception, ...patch } : exception
      ),
    }));
  }

  function removeException(index: number) {
    setAvailability((current) => ({
      ...current,
      exceptions: current.exceptions.filter((_, exceptionIndex) => exceptionIndex !== index),
    }));
  }

  function addException() {
    setAvailability((current) => ({
      ...current,
      exceptions: sortAvailabilityExceptions([
        ...current.exceptions,
        {
          date: new Date().toISOString().slice(0, 10),
          type: "unavailable",
          startHour: 9,
          endHour: 10,
          note: "",
        },
      ]),
    }));
  }

  async function saveAvailability() {
    setMessage(null);
    setIsError(false);

    if (validationErrors.length > 0) {
      setIsError(true);
      setMessage(validationErrors[0]);
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/teachers/me/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(availability),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setIsError(true);
        setMessage(
          payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
            ? payload.message
            : "Müsaitlik kaydedilemedi."
        );
        return;
      }

      setAvailability(payload as TeacherAvailability);
      setMessage("Müsaitlik kaydedildi.");
      setIsError(false);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-5">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Haftalık müsaitlik</p>
            <h2 className="text-xl font-bold text-brand-navy">Ders verebileceğin saatleri seç.</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Öğrenciler bu saatleri profilinde görür ve aramada filtreleyebilir.
            </p>
          </div>
          <Button type="button" className="bg-brand-orange text-white hover:bg-brand-orange/90" disabled={isSaving} onClick={saveAvailability}>
            <SaveIcon data-icon="inline-start" aria-hidden="true" />
            Kaydet
          </Button>
        </div>

        {message ? (
          <div className={`mt-4 rounded-lg border px-3 py-2 text-sm ${isError ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
            {message}
          </div>
        ) : null}

        <div className="mt-5 grid gap-3">
          {weekdayOptions.map((weekday) => {
            const weekdaySlots = availability.weeklySlots
              .map((slot, index) => ({ slot, index }))
              .filter(({ slot }) => slot.weekday === weekday.weekday);

            return (
              <div key={weekday.value} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-brand-navy">{weekday.label}</h3>
                  <Button type="button" size="sm" variant="outline" onClick={() => addSlot(weekday.weekday)}>
                    <PlusIcon data-icon="inline-start" aria-hidden="true" />
                    Saat Ekle
                  </Button>
                </div>
                <div className="mt-3 grid gap-2">
                  {weekdaySlots.length > 0 ? (
                    weekdaySlots.map(({ slot, index }) => (
                      <div key={`${slot.weekday}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                        <PremiumSelect
                          value={String(slot.startHour)}
                          onChange={(value) => updateSlot(index, { startHour: Number(value) })}
                          options={hourOptions}
                        />
                        <PremiumSelect
                          value={String(slot.endHour)}
                          onChange={(value) => updateSlot(index, { endHour: Number(value) })}
                          options={endHourOptions}
                        />
                        <Button type="button" variant="outline" size="icon" onClick={() => removeSlot(index)}>
                          <Trash2Icon className="size-4" aria-hidden="true" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Bu gün için saat eklenmedi.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">İstisnalar</p>
            <h2 className="text-xl font-bold text-brand-navy">Tek seferlik değişiklikler</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Normalde müsait olduğun saatleri kapatabilir veya ekstra saat ekleyebilirsin.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={addException}>
            <PlusIcon data-icon="inline-start" aria-hidden="true" />
            İstisna Ekle
          </Button>
        </div>

        <div className="mt-5 grid gap-2">
          {availability.exceptions.length > 0 ? (
            availability.exceptions.map((exception, index) => (
              <div key={`${exception.date}-${index}`} className="grid gap-2 rounded-xl border border-slate-200 p-3 lg:grid-cols-[170px_180px_1fr_1fr_1fr_auto]">
                <Input
                  type="date"
                  value={exception.date}
                  onChange={(event) => updateException(index, { date: event.target.value })}
                />
                <PremiumSelect
                  value={exception.type}
                  onChange={(value) => updateException(index, { type: value as AvailabilityExceptionType })}
                  options={availabilityExceptionTypeOptions}
                />
                <PremiumSelect
                  value={String(exception.startHour)}
                  onChange={(value) => updateException(index, { startHour: Number(value) })}
                  options={hourOptions}
                />
                <PremiumSelect
                  value={String(exception.endHour)}
                  onChange={(value) => updateException(index, { endHour: Number(value) })}
                  options={endHourOptions}
                />
                <Input
                  value={exception.note ?? ""}
                  placeholder="Not"
                  onChange={(event) => updateException(index, { note: event.target.value })}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => removeException(index)}>
                  <Trash2Icon className="size-4" aria-hidden="true" />
                </Button>
              </div>
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-muted-foreground">
              Henüz istisna eklenmedi.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Haftalık önizleme</p>
          <h2 className="mb-4 text-xl font-bold text-brand-navy">Profilde görünecek özet</h2>
          <AvailabilityPreview availability={availability} />
        </div>
        <MonthlyCalendarPreview availability={availability} />
      </div>
    </div>
  );
}
