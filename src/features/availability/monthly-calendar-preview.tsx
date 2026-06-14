"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";

import type { TeacherAvailability } from "@/features/availability/types";
import {
  addMonths,
  dateKey,
  monthCalendarDays,
  monthLabel,
  slotLabel,
  slotsForDate,
  weekdayShortLabel,
} from "@/features/availability/utils";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

export function MonthlyCalendarPreview({ availability }: { availability: TeacherAvailability }) {
  const [monthDate, setMonthDate] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const days = monthCalendarDays(monthDate);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Aylık önizleme</p>
          <h3 className="text-lg font-bold capitalize text-brand-navy">{monthLabel(monthDate)}</h3>
        </div>
        <div className="flex gap-2">
          <Button type="button" size="icon" variant="outline" onClick={() => setMonthDate((value) => addMonths(value, -1))}>
            <ChevronLeftIcon className="size-4" aria-hidden="true" />
          </Button>
          <Button type="button" size="icon" variant="outline" onClick={() => setMonthDate((value) => addMonths(value, 1))}>
            <ChevronRightIcon className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">
        {[1, 2, 3, 4, 5, 6, 7].map((weekday) => (
          <div key={weekday} className="py-1">
            {weekdayShortLabel(weekday as 1 | 2 | 3 | 4 | 5 | 6 | 7)}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const slots = slotsForDate(availability, day);
          const inMonth = day.getMonth() === monthDate.getMonth();

          return (
            <div
              key={dateKey(day)}
              className={cn(
                "min-h-24 rounded-lg border p-1.5 text-xs",
                inMonth ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 text-muted-foreground/60",
                slots.length > 0 && inMonth ? "ring-1 ring-orange-100" : ""
              )}
            >
              <div className="font-semibold text-brand-navy">{day.getDate()}</div>
              <div className="mt-1 flex flex-col gap-1">
                {slots.slice(0, 2).map((slot) => (
                  <span key={`${slot.weekday}-${slot.startHour}-${slot.endHour}`} className="truncate rounded bg-orange-50 px-1 py-0.5 text-[10px] text-brand-orange">
                    {slotLabel(slot)}
                  </span>
                ))}
                {slots.length > 2 ? <span className="text-[10px] text-muted-foreground">+{slots.length - 2}</span> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
