import Link from "next/link";
import { ShieldIcon } from "lucide-react";

import { LogoutButton } from "@/features/auth/logout-button";
import type { AuthAccount } from "@/features/auth/types";

type AdminShellProps = {
  account: AuthAccount;
  children: React.ReactNode;
};

const adminNavItems = [
  { href: "/admin", label: "Genel Bakış" },
  { href: "/admin/ogretmenler", label: "Öğretmenler" },
  { href: "/admin/yorumlar", label: "Yorumlar" },
  { href: "/admin/analitik", label: "Analitik" },
];

export function AdminShell({ account, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white px-4 sm:px-6">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
              <span className="flex size-7 items-center justify-center rounded-lg bg-brand-navy text-white">
                <ShieldIcon className="size-4" aria-hidden="true" />
              </span>
              Admin Paneli
            </Link>
            <nav className="hidden gap-1 sm:flex">
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
                  key="/"
                  href="/"
                  className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  Siteye dön
                </Link>
            <span className="hidden text-xs text-muted-foreground sm:block">{account.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  );
}
