"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/shared/components/ui/button";

type RequestActionButtonsProps = {
  requestId: string;
};

export function RequestActionButtons({ requestId }: RequestActionButtonsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleAction(action: "accept" | "reject") {
    const res = await fetch(`/api/lesson-requests/${requestId}/${action}`, { method: "POST" });
    if (res.ok) {
      startTransition(() => {
        router.refresh();
      });
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        className="bg-brand-orange text-white hover:bg-brand-orange/90"
        disabled={isPending}
        onClick={() => handleAction("accept")}
      >
        Kabul Et
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={() => handleAction("reject")}
      >
        Reddet
      </Button>
    </div>
  );
}
