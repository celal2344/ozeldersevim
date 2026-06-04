"use client";

import { HeartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { cn } from "@/shared/lib/utils";

type FavoriteButtonProps = {
  teacherSlug: string;
};

export function FavoriteButton({ teacherSlug }: FavoriteButtonProps) {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch(`/api/favorites/check?slug=${encodeURIComponent(teacherSlug)}`)
      .then((r) => r.json())
      .then((data) => setIsFavorited(Boolean(data.isFavorited)))
      .catch(() => setIsFavorited(false));
  }, [teacherSlug]);

  async function handleToggle() {
    const res = await fetch("/api/favorites/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: teacherSlug }),
    });

    if (res.status === 401) {
      router.push(`/giris?next=/ogretmen/${teacherSlug}`);
      return;
    }

    if (res.ok) {
      const data = await res.json();
      setIsFavorited(Boolean(data.isFavorited));
      startTransition(() => {
        router.refresh();
      });
    }
  }

  const filled = isFavorited === true;

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending || isFavorited === null}
      aria-label={filled ? "Favorilerden çıkar" : "Favorilere ekle"}
      className={cn(
        "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
        filled
          ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
          : "border-border bg-white text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <HeartIcon
        className={cn("size-4", filled ? "fill-red-500 text-red-500" : "fill-none")}
        aria-hidden="true"
      />
      {filled ? "Favorilendi" : "Favorile"}
    </button>
  );
}
