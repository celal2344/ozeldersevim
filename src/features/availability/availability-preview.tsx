import { CalendarDaysIcon } from "lucide-react";

import { weekdayOptions } from "@/features/availability/constants";
import type { TeacherAvailability } from "@/features/availability/types";
import { slotLabel, slotsByWeekday } from "@/features/availability/utils";
import { cn } from "@/shared/lib/utils";

type AvailabilityPreviewProps = {
  availability: TeacherAvailability;
  compact?: boolean;
  className?: string;
};

export function AvailabilityPreview({ availability, compact = false, className }: AvailabilityPreviewProps) {
  const groupedSlots = slotsByWeekday(availability.weeklySlots);
  const hasAvailability = availability.weeklySlots.length > 0;
  const visibleWeekdays = compact
    ? weekdayOptions.filter((weekday) => (groupedSlots.get(weekday.weekday) ?? []).length > 0)
    : weekdayOptions;

  if (!hasAvailability) {
    return (
      <div className={cn("rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-muted-foreground", className)}>
        <div className="flex items-center gap-2 font-medium text-brand-navy">
          <CalendarDaysIcon className="size-4 text-brand-orange" aria-hidden="true" />
          Müsaitlik henüz eklenmedi.
        </div>
        {!compact ? <p className="mt-1 text-xs">Öğretmen takvimini güncellediğinde saatleri burada görünür.</p> : null}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-2", compact ? "grid-cols-1" : "sm:grid-cols-2", className)}>
      {visibleWeekdays.map((weekday) => {
        const slots = groupedSlots.get(weekday.weekday) ?? [];

        return (
          <div
            key={weekday.value}
            className={cn(
              "rounded-xl border px-3 py-2 text-sm",
              slots.length > 0 ? "border-orange-100 bg-orange-50/70" : "border-slate-100 bg-slate-50 text-muted-foreground"
            )}
          >
            <span className="font-semibold text-brand-navy">{compact ? weekday.shortLabel : weekday.label}</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {slots.length > 0 ? (
                slots.map((slot) => (
                  <span key={`${slot.weekday}-${slot.startHour}-${slot.endHour}`} className="rounded-full bg-white px-2 py-0.5 text-xs text-brand-navy ring-1 ring-orange-100">
                    {slotLabel(slot)}
                  </span>
                ))
              ) : (
                <span className="text-xs">Kapalı</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
