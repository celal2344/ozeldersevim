import { DashboardShell } from "@/features/dashboard/shared/dashboard-shell";
import type { DashboardPageId, DashboardRole } from "@/features/dashboard/types";
import { dashboardConfigForRole, dashboardPageForId, requireDashboardAccount } from "@/features/dashboard/utils";

type DashboardRouteProps = {
  activePath: string;
  pageId: DashboardPageId;
  role: DashboardRole;
  children?: React.ReactNode;
};

export async function DashboardRoute({ activePath, pageId, role, children }: DashboardRouteProps) {
  const account = await requireDashboardAccount(role, activePath);
  const config = dashboardConfigForRole(role);
  const page = dashboardPageForId(pageId);

  return <DashboardShell account={account} activePath={activePath} config={config} page={page}>{children}</DashboardShell>;
}
