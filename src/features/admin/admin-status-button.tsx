"use client";

import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/shared/components/ui/button";

type AdminStatusButtonProps = {
  endpoint: string;
  status: string;
  label: string;
  variant?: "default" | "outline" | "destructive";
};

export function AdminStatusButton({ endpoint, status, label, variant = "outline" }: AdminStatusButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isBusy = isSubmitting || isPending;

  async function handleClick() {
    if (isBusy) return;

    setError(null);
    setIsSubmitting(true);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setIsSubmitting(false);
      setError(
        payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
          ? payload.message
          : "İşlem tamamlanamadı."
      );
      return;
    }

    startTransition(() => {
      router.refresh();
    });
    setIsSubmitting(false);
  }

  return (
    <div className="flex flex-col gap-1">
      <Button size="sm" variant={variant} disabled={isBusy} onClick={handleClick}>
        {isBusy ? <Loader2Icon data-icon="inline-start" aria-hidden="true" /> : null}
        {label}
      </Button>
      {error ? (
        <span className="inline-flex max-w-48 items-start gap-1 text-xs text-destructive">
          <AlertCircleIcon className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
          {error}
        </span>
      ) : null}
    </div>
  );
}
