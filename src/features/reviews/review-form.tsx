"use client";

import { StarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

type ReviewFormProps = {
  lessonRequestId: string;
  lessonCategoryName: string;
};

export function ReviewForm({ lessonRequestId, lessonCategoryName }: ReviewFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="text-sm font-medium text-green-700">
        Yorumun alındı. Teşekkürler!
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Lütfen bir puan ver.");
      return;
    }
    setError(null);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonRequestId, rating, comment: comment.trim() || undefined }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? "Yorum gönderilemedi.");
      return;
    }

    setSubmitted(true);
    startTransition(() => {
      router.refresh();
    });
  }

  const displayRating = hovered || rating;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {lessonCategoryName} dersi için yorum yaz
      </p>
      <div
        className="flex gap-1"
        onMouseLeave={() => setHovered(0)}
        role="group"
        aria-label="Puan seç"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${star} yıldız`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            className="p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <StarIcon
              className={cn(
                "size-6 transition-colors",
                star <= displayRating ? "fill-yellow-400 text-yellow-400" : "fill-none text-muted-foreground"
              )}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Öğretmen hakkındaki deneyimini paylaş (isteğe bağlı)"
        maxLength={1000}
        rows={3}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      <Button
        type="submit"
        size="sm"
        disabled={isPending || rating === 0}
        className="w-fit bg-brand-orange text-white hover:bg-brand-orange/90"
      >
        Yorumu Gönder
      </Button>
    </form>
  );
}
