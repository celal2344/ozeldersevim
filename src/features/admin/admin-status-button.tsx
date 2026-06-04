"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/shared/components/ui/button";

type AdminStatusButtonProps = {
  endpoint: string;
  status: string;
  label: string;
  variant?: "default" | "outline" | "destructive";
};

export function AdminStatusButton({ endpoint, status, label, variant = "outline" }: AdminStatusButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleClick() {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <Button size="sm" variant={variant} disabled={isPending} onClick={handleClick}>
      {label}
    </Button>
  );
}
