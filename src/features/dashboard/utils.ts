import { redirect } from "next/navigation";

import { getCurrentAccount } from "@/features/auth/service";
import type { AuthAccount } from "@/features/auth/types";
import { loginPathWithNext, panelPathForRole } from "@/features/auth/utils";
import { studentDashboardConfig, studentDashboardPages } from "@/features/dashboard/student/constants";
import { teacherDashboardConfig, teacherDashboardPages } from "@/features/dashboard/teacher/constants";
import type { DashboardPageContent, DashboardPageId, DashboardRole, DashboardRoleConfig } from "@/features/dashboard/types";

export async function requireDashboardAccount(role: DashboardRole, nextPath: string): Promise<AuthAccount> {
  const account = await getCurrentAccount();

  if (!account) redirect(loginPathWithNext(nextPath));
  if (account.role !== role) redirect(panelPathForRole(account.role));

  return account;
}

export function dashboardConfigForRole(role: DashboardRole): DashboardRoleConfig {
  return role === "student" ? studentDashboardConfig : teacherDashboardConfig;
}

export function dashboardPageForId(pageId: DashboardPageId): DashboardPageContent {
  const page = studentDashboardPages[pageId] ?? teacherDashboardPages[pageId];

  if (!page) {
    throw new Error(`Dashboard page not configured: ${pageId}`);
  }

  return page;
}
