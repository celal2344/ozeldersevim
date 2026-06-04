import {
  studentLoginRedirect,
  studentPanelPath,
  studentSignupRedirect,
  teacherPanelPath,
} from "@/features/auth/constants";
import type { AppRole } from "@/features/auth/types";

export function safeNextPath(next: string | null | undefined) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return null;
  return next;
}

export function defaultLoginRedirectForRole(role: AppRole) {
  if (role === "student") return studentLoginRedirect;
  if (role === "teacher") return teacherPanelPath;
  return "/";
}

export function defaultSignupRedirectForRole(role: AppRole) {
  if (role === "student") return studentSignupRedirect;
  if (role === "teacher") return teacherPanelPath;
  return "/";
}

export function panelPathForRole(role: AppRole) {
  if (role === "admin") return "/admin";
  if (role === "student") return studentPanelPath;
  if (role === "teacher") return teacherPanelPath;
  return "/";
}

export function redirectForAuthResult(role: AppRole, next: string | null | undefined, mode: "login" | "signup") {
  const safeNext = safeNextPath(next);
  if (safeNext) return safeNext;

  return mode === "login" ? defaultLoginRedirectForRole(role) : defaultSignupRedirectForRole(role);
}

export function loginPathWithNext(next: string) {
  return `/giris?next=${encodeURIComponent(next)}`;
}

export function registerPathWithNext(next: string) {
  return `/kayit?next=${encodeURIComponent(next)}`;
}

export function authApiErrorMessage(payload: unknown, fallback: string) {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  return fallback;
}
