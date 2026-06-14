import type { LucideIcon } from "lucide-react";

import type { AppRole } from "@/features/auth/types";

export type DashboardRole = Extract<AppRole, "student" | "teacher">;

export type DashboardPageId =
  | "student-home"
  | "student-requests"
  | "student-favorites"
  | "student-profile"
  | "teacher-home"
  | "teacher-requests"
  | "teacher-listing"
  | "teacher-calendar"
  | "teacher-students"
  | "teacher-reviews"
  | "teacher-profile"
  | "teacher-settings";

export type DashboardNavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  pageId: DashboardPageId;
};

export type DashboardPageContent = {
  ctaHref?: string;
  ctaLabel?: string;
  description: string;
  eyebrow: string;
  id: DashboardPageId;
  title: string;
};

export type DashboardRoleConfig = {
  homeHref: string;
  label: string;
  navItems: DashboardNavItem[];
  role: DashboardRole;
};
