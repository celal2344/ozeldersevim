import { weekdayOptions } from "@/features/availability/constants";
import type {
  AvailabilityException,
  AvailabilityFilter,
  AvailabilitySlot,
  TeacherAvailability,
  Weekday,
} from "@/features/availability/types";

export function formatHour(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

export function slotLabel(slot: Pick<AvailabilitySlot, "startHour" | "endHour">) {
  return `${formatHour(slot.startHour)} - ${formatHour(slot.endHour)}`;
}

export function weekdayLabel(weekday: Weekday) {
  return weekdayOptions.find((option) => option.weekday === weekday)?.label ?? "";
}

export function weekdayShortLabel(weekday: Weekday) {
  return weekdayOptions.find((option) => option.weekday === weekday)?.shortLabel ?? "";
}

export function dateToWeekday(date: Date): Weekday {
  const day = date.getDay();
  return (day === 0 ? 7 : day) as Weekday;
}

export function sortAvailabilitySlots(slots: AvailabilitySlot[]) {
  return [...slots].sort((a, b) => a.weekday - b.weekday || a.startHour - b.startHour || a.endHour - b.endHour);
}

export function sortAvailabilityExceptions(exceptions: AvailabilityException[]) {
  return [...exceptions].sort(
    (a, b) => a.date.localeCompare(b.date) || a.startHour - b.startHour || a.endHour - b.endHour
  );
}

export function slotsByWeekday(slots: AvailabilitySlot[]) {
  const grouped = new Map<Weekday, AvailabilitySlot[]>();

  for (const slot of sortAvailabilitySlots(slots)) {
    grouped.set(slot.weekday, [...(grouped.get(slot.weekday) ?? []), slot]);
  }

  return grouped;
}

export function hasWeeklyAvailability(availability: Pick<TeacherAvailability, "weeklySlots">) {
  return availability.weeklySlots.length > 0;
}

export function availabilityWeekdayOptions(availability: Pick<TeacherAvailability, "weeklySlots">) {
  const availableWeekdays = new Set(availability.weeklySlots.map((slot) => slot.weekday));

  return weekdayOptions
    .filter((option) => availableWeekdays.has(option.weekday))
    .map((option) => ({ value: option.value, label: option.label }));
}

export function availabilityStartHourOptions(
  availability: Pick<TeacherAvailability, "weeklySlots">,
  weekdayValue?: string
) {
  const weekday = weekdayValue ? Number(weekdayValue) : null;
  const slots = availability.weeklySlots.filter((slot) => !weekday || slot.weekday === weekday);
  const hours = [...new Set(slots.map((slot) => slot.startHour))].sort((a, b) => a - b);

  return hours.map((hour) => ({ value: String(hour), label: formatHour(hour) }));
}

export function rangesOverlap(
  a: Pick<AvailabilitySlot, "startHour" | "endHour">,
  b: Pick<AvailabilitySlot, "startHour" | "endHour">
) {
  return a.startHour < b.endHour && b.startHour < a.endHour;
}

export function validateAvailability(input: TeacherAvailability) {
  const errors: string[] = [];

  for (const slot of input.weeklySlots) {
    if (slot.weekday < 1 || slot.weekday > 7) errors.push("Hafta günü geçersiz.");
    if (slot.startHour < 0 || slot.startHour > 23) errors.push("Başlangıç saati geçersiz.");
    if (slot.endHour < 1 || slot.endHour > 24) errors.push("Bitiş saati geçersiz.");
    if (slot.startHour >= slot.endHour) errors.push("Bitiş saati başlangıçtan sonra olmalı.");
  }

  for (const exception of input.exceptions) {
    if (!exception.date) errors.push("İstisna tarihi zorunlu.");
    if (exception.startHour < 0 || exception.startHour > 23) errors.push("İstisna başlangıç saati geçersiz.");
    if (exception.endHour < 1 || exception.endHour > 24) errors.push("İstisna bitiş saati geçersiz.");
    if (exception.startHour >= exception.endHour) errors.push("İstisna bitiş saati başlangıçtan sonra olmalı.");
  }

  for (const weekday of weekdayOptions.map((option) => option.weekday)) {
    const slots = input.weeklySlots.filter((slot) => slot.weekday === weekday);
    for (let index = 0; index < slots.length; index += 1) {
      for (let nextIndex = index + 1; nextIndex < slots.length; nextIndex += 1) {
        if (rangesOverlap(slots[index], slots[nextIndex])) {
          errors.push(`${weekdayLabel(weekday)} için çakışan saat aralıkları var.`);
        }
      }
    }
  }

  const exceptionsByDateAndType = new Map<string, AvailabilityException[]>();
  for (const exception of input.exceptions) {
    const key = `${exception.date}:${exception.type}`;
    exceptionsByDateAndType.set(key, [...(exceptionsByDateAndType.get(key) ?? []), exception]);
  }

  for (const exceptions of exceptionsByDateAndType.values()) {
    for (let index = 0; index < exceptions.length; index += 1) {
      for (let nextIndex = index + 1; nextIndex < exceptions.length; nextIndex += 1) {
        if (rangesOverlap(exceptions[index], exceptions[nextIndex])) {
          errors.push("Aynı tarih için çakışan istisna saatleri var.");
        }
      }
    }
  }

  return [...new Set(errors)];
}

export function availabilityMatchesFilter(availability: TeacherAvailability, filter: AvailabilityFilter) {
  if (!filter.weekday) return true;

  const startHour = filter.startHour ?? 0;
  const endHour = filter.endHour ?? 24;
  const requested = { startHour, endHour };

  return availability.weeklySlots.some(
    (slot) => slot.weekday === filter.weekday && rangesOverlap(slot, requested)
  );
}

export function slotsForDate(availability: TeacherAvailability, date: Date) {
  const weekday = dateToWeekday(date);
  const dateKey = date.toISOString().slice(0, 10);
  const weeklySlots = availability.weeklySlots.filter((slot) => slot.weekday === weekday);
  const exceptions = availability.exceptions.filter((exception) => exception.date === dateKey);
  const unavailable = exceptions.filter((exception) => exception.type === "unavailable");
  const available = exceptions.filter((exception) => exception.type === "available");

  return sortAvailabilitySlots([
    ...weeklySlots.filter((slot) => !unavailable.some((blocked) => rangesOverlap(slot, blocked))),
    ...available.map((exception) => ({
      weekday,
      startHour: exception.startHour,
      endHour: exception.endHour,
    })),
  ]);
}

export function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(date);
}

export function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function monthCalendarDays(monthDate: Date) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const firstGridOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - firstGridOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
}
