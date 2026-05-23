"use client";

import { LogOutIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";

export function LogoutButton({ className, redirectTo = "/" }: { className?: string; redirectTo?: string }) {
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    window.location.assign(redirectTo);
  }

  return (
    <Button type="button" variant="outline" className={className} onClick={logout} disabled={pending}>
      <LogOutIcon data-icon="inline-start" aria-hidden="true" />
      {pending ? "Çıkış yapılıyor" : "Çıkış Yap"}
    </Button>
  );
}
