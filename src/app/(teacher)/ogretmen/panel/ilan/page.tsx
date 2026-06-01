import { DashboardShell } from "@/features/dashboard/shared/dashboard-shell";
import { dashboardConfigForRole, dashboardPageForId, requireDashboardAccount } from "@/features/dashboard/utils";
import { TeacherListingManager } from "@/features/teacher-listings/teacher-listing-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "İlanım | ÖzelDersEvim",
};

export default async function TeacherListingPage() {
  const activePath = "/ogretmen/panel/ilan";
  const account = await requireDashboardAccount("teacher", activePath);

  return (
    <DashboardShell
      account={account}
      activePath={activePath}
      config={dashboardConfigForRole("teacher")}
      page={dashboardPageForId("teacher-listing")}
    >
      <TeacherListingManager />
    </DashboardShell>
  );
}
