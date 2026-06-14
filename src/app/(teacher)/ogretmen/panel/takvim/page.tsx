import { TeacherCalendarView } from "@/features/availability/teacher-calendar-view";
import { DashboardShell } from "@/features/dashboard/shared/dashboard-shell";
import { dashboardConfigForRole, dashboardPageForId, requireDashboardAccount } from "@/features/dashboard/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Takvim | ÖzelDersEvim",
};

export default async function TeacherCalendarPage() {
  const activePath = "/ogretmen/panel/takvim";
  const account = await requireDashboardAccount("teacher", activePath);

  return (
    <DashboardShell
      account={account}
      activePath={activePath}
      config={dashboardConfigForRole("teacher")}
      page={dashboardPageForId("teacher-calendar")}
    >
      <TeacherCalendarView />
    </DashboardShell>
  );
}
