import { getOwnTeacherAvailability } from "@/features/availability/service";
import { TeacherCalendarWorkspace } from "@/features/calendar/teacher-calendar-workspace";
import { DashboardStateCard } from "@/features/dashboard/shared/dashboard-state-card";

export async function TeacherCalendarView() {
  let availability;

  try {
    availability = await getOwnTeacherAvailability();
  } catch {
    return (
      <DashboardStateCard
        title="Takvim yüklenirken bir hata oluştu."
        description="Sayfayı yenileyip tekrar dene. Sorun devam ederse daha sonra kontrol et."
        tone="error"
      />
    );
  }

  return <TeacherCalendarWorkspace initialAvailability={availability} />;
}
