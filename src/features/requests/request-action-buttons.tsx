"use client";

import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/shared/components/ui/button";

type RequestActionButtonsProps = {
  requestId: string;
};

export function RequestActionButtons({ requestId }: RequestActionButtonsProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isBusy = isSubmitting || isPending;

  async function handleAction(action: "accept" | "reject") {
    if (isBusy) return;

    setError(null);
    setIsSubmitting(true);

    const response = await fetch(`/api/lesson-requests/${requestId}/${action}`, { method: "POST" });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setIsSubmitting(false);
      setError(
        payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
          ? payload.message
          : "Talep güncellenemedi."
      );
      return;
    }

    startTransition(() => {
      router.refresh();
    });
    setIsSubmitting(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          size="sm"
          className="bg-brand-orange text-white hover:bg-brand-orange/90"
          disabled={isBusy}
          onClick={() => handleAction("accept")}
        >
          {isBusy ? <Loader2Icon data-icon="inline-start" aria-hidden="true" /> : null}
          Kabul Et
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={isBusy}
          onClick={() => handleAction("reject")}
        >
          Reddet
        </Button>
      </div>
      {error ? (
        <span className="inline-flex items-start gap-1 text-xs text-destructive">
          <AlertCircleIcon className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
          {error}
        </span>
      ) : null}
    </div>
  );
}
