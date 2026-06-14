import type { CalendarLesson, TeacherCalendarSummary } from "@/features/calendar/types";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    currency: "TRY",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function formatDateTime(value: string | null) {
  if (!value) return "Planlanmadı";
  return new Date(value).toLocaleString("tr-TR", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "long",
  });
}

export function toDateInputValue(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return offsetDate.toISOString().slice(0, 16);
}

export function fromDateInputValue(value: string) {
  return value ? new Date(value).toISOString() : "";
}

export function calendarMonthRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

  return {
    from: start.toISOString(),
    to: end.toISOString(),
  };
}

export function calendarDayKey(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toISOString().slice(0, 10);
}

export function summarizeLessons(lessons: CalendarLesson[], activeStudentCount: number): TeacherCalendarSummary {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const billable = lessons.filter((lesson) => lesson.status !== "cancelled" && lesson.scheduledAt);

  return {
    activeStudentCount,
    futureLessonCount: billable.filter((lesson) => new Date(lesson.scheduledAt as string) >= now).length,
    futureProjectedIncome: billable
      .filter((lesson) => new Date(lesson.scheduledAt as string) >= now)
      .reduce((total, lesson) => total + lesson.priceAmount, 0),
    thisMonthIncome: billable
      .filter((lesson) => {
        const scheduledAt = new Date(lesson.scheduledAt as string);
        return scheduledAt >= monthStart && scheduledAt < monthEnd;
      })
      .reduce((total, lesson) => total + lesson.priceAmount, 0),
  };
}
