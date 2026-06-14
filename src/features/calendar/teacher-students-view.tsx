import { getTeacherCalendarResource } from "@/features/calendar/service";
import { DashboardStateCard } from "@/features/dashboard/shared/dashboard-state-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export async function TeacherStudentsView() {
  let resource;

  try {
    resource = await getTeacherCalendarResource("1970-01-01T00:00:00.000Z", "2999-12-31T23:59:59.999Z");
  } catch {
    return (
      <DashboardStateCard
        title="Öğrenciler yüklenemedi."
        description="Sayfayı yenileyip tekrar dene."
        tone="error"
      />
    );
  }

  if (resource.students.length === 0) {
    return (
      <DashboardStateCard
        title="Henüz öğrenci yok."
        description="Kabul ettiğin ders talepleri veya manuel eklediğin dersler burada öğrenci listesi oluşturur."
        actionHref="/ogretmen/panel/takvim"
        actionLabel="Takvime Git"
      />
    );
  }

  return (
    <div className="grid gap-3">
      {resource.students.map((student) => {
        const lessons = resource.lessons.filter((lesson) => lesson.teacherStudentId === student.id);
        const upcomingCount = lessons.filter((lesson) => lesson.status === "scheduled" && lesson.scheduledAt && new Date(lesson.scheduledAt) >= new Date()).length;

        return (
          <Card key={student.id}>
            <CardHeader>
              <CardDescription>{upcomingCount} gelecek ders</CardDescription>
              <CardTitle className="text-brand-navy">{student.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {student.phone ? <a className="text-brand-orange hover:underline" href={`tel:${student.phone}`}>{student.phone}</a> : null}
              {student.email ? <a className="text-brand-orange hover:underline" href={`mailto:${student.email}`}>{student.email}</a> : null}
              {!student.phone && !student.email ? <span>İletişim bilgisi yok.</span> : null}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
