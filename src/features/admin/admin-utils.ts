import { redirect } from "next/navigation";

import { getCurrentAccount } from "@/features/auth/service";
import type { AuthAccount } from "@/features/auth/types";

export async function requireAdminAccount(): Promise<AuthAccount> {
  const account = await getCurrentAccount();

  if (!account) redirect("/giris?next=/admin");
  if (account.role !== "admin") redirect("/");

  return account;
}
