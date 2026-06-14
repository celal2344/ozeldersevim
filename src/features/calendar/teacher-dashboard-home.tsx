import Link from "next/link";

import { getOwnTeacherDashboardCalendarResource } from "@/features/calendar/service";
import { formatCurrency, formatDateTime } from "@/features/calendar/utils";
import { DashboardStateCard } from "@/features/dashboard/shared/dashboard-state-card";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export async function TeacherDashboardHome() {
  let resource;

  try {
    resource = await getOwnTeacherDashboardCalendarResource();
  } catch {
    return (
      <DashboardStateCard
        title="Panel özeti yüklenemedi."
        description="Takvim ve gelir bilgilerini almak için sayfayı yenileyip tekrar dene."
        tone="error"
      />
    );
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-4">
        <DashboardMetric label="Gelecek Ders" value={String(resource.summary.futureLessonCount)} />
        <DashboardMetric label="Aktif Öğrenci" value={String(resource.summary.activeStudentCount)} />
        <DashboardMetric label="Bu Ay" value={formatCurrency(resource.summary.thisMonthIncome)} />
        <DashboardMetric label="Gelecek Gelir" value={formatCurrency(resource.summary.futureProjectedIncome)} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardDescription>Yaklaşan dersler</CardDescription>
            <CardTitle className="text-brand-navy">Takvimdeki sıradaki dersler</CardTitle>
          </div>
          <Button nativeButton={false} render={<Link href="/ogretmen/panel/takvim" />}>
            Takvime Git
          </Button>
        </CardHeader>
        <CardContent className="grid gap-2">
          {resource.nextLessons.length > 0 ? (
            resource.nextLessons.map((lesson) => (
              <div key={lesson.id} className="rounded-lg border p-3 text-sm">
                <p className="font-semibold text-brand-navy">{lesson.studentName} · {lesson.lessonName}</p>
                <p className="text-muted-foreground">{formatDateTime(lesson.scheduledAt)} · {formatCurrency(lesson.priceAmount)}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Yaklaşan ders bulunmuyor.</p>
          )}
        </CardContent>
      </Card>

      {resource.unscheduledRequests.length > 0 ? (
        <Card>
          <CardHeader>
            <CardDescription>Plan bekleyen talepler</CardDescription>
            <CardTitle className="text-brand-navy">Kabul edildi, takvime eklenmedi</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {resource.unscheduledRequests.slice(0, 4).map((request) => (
              <div key={request.id} className="rounded-lg border p-3 text-sm">
                <p className="font-semibold text-brand-navy">{request.studentName} · {request.lessonName}</p>
                <p className="text-muted-foreground">{request.studentPhone || request.studentEmail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function DashboardMetric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl text-brand-navy">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
