import type { AvailabilityExceptionType, Weekday } from "@/features/availability/types";
import { z } from "zod";

export const weekdayOptions: { value: string; label: string; shortLabel: string; weekday: Weekday }[] = [
  { value: "1", label: "Pazartesi", shortLabel: "Pzt", weekday: 1 },
  { value: "2", label: "Salı", shortLabel: "Sal", weekday: 2 },
  { value: "3", label: "Çarşamba", shortLabel: "Çar", weekday: 3 },
  { value: "4", label: "Perşembe", shortLabel: "Per", weekday: 4 },
  { value: "5", label: "Cuma", shortLabel: "Cum", weekday: 5 },
  { value: "6", label: "Cumartesi", shortLabel: "Cmt", weekday: 6 },
  { value: "7", label: "Pazar", shortLabel: "Paz", weekday: 7 },
] as const;

export const hourOptions = Array.from({ length: 24 }, (_, hour) => ({
  value: String(hour),
  label: `${String(hour).padStart(2, "0")}:00`,
}));

export const endHourOptions = Array.from({ length: 24 }, (_, index) => {
  const hour = index + 1;
  return {
    value: String(hour),
    label: `${String(hour).padStart(2, "0")}:00`,
  };
});

export const availabilityExceptionTypeOptions: { value: AvailabilityExceptionType; label: string }[] = [
  { value: "unavailable", label: "Müsait değilim" },
  { value: "available", label: "Ek müsaitlik" },
];

export const emptyAvailability = {
  weeklySlots: [],
  exceptions: [],
};

export const availabilitySlotSchema = z.object({
  weekday: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
    z.literal(7),
  ]),
  startHour: z.number().int().min(0).max(23),
  endHour: z.number().int().min(1).max(24),
});

export const availabilityExceptionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.enum(["available", "unavailable"]),
  startHour: z.number().int().min(0).max(23),
  endHour: z.number().int().min(1).max(24),
  note: z.string().max(160).optional().nullable(),
});

export const teacherAvailabilityInputSchema = z.object({
  weeklySlots: z.array(availabilitySlotSchema).max(56),
  exceptions: z.array(availabilityExceptionSchema).max(120),
});
