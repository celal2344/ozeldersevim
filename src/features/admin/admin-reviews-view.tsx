import { StarIcon } from "lucide-react";

import { createSupabaseServerClient } from "@/shared/db/supabase/server";
import { AdminStatusButton } from "@/features/admin/admin-status-button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";

const statusVariant = {
  published: "default",
  pending: "secondary",
  rejected: "destructive",
  reported: "outline",
} as const;

const statusLabel = {
  published: "Yayında",
  pending: "Bekliyor",
  rejected: "Reddedildi",
  reported: "Şikayet Var",
} as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

export async function AdminReviewsView() {
  const supabase = await createSupabaseServerClient();

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, status, created_at, lesson_requests!lesson_request_id(lesson_categories!lesson_category_id(name))")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return <p className="text-sm text-destructive">Yorumlar yüklenemedi: {error.message}</p>;
  }

  if (!reviews || reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">Henüz yorum yok.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {(reviews as unknown as Array<{
        id: string;
        rating: number;
        comment: string | null;
        status: "published" | "pending" | "rejected" | "reported";
        created_at: string;
        lesson_requests: { lesson_categories: { name: string } | null } | null;
      }>).map((review) => (
        <Card key={review.id}>
          <CardHeader className="pb-2 pt-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarIcon
                        key={s}
                        className={s <= review.rating ? "size-3.5 fill-yellow-400 text-yellow-400" : "size-3.5 fill-none text-muted-foreground"}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <Badge variant={statusVariant[review.status]}>{statusLabel[review.status]}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {review.lesson_requests?.lesson_categories?.name ?? "Bilinmiyor"} · {formatDate(review.created_at)}
                </span>
              </div>
              <div className="flex gap-2">
                {review.status !== "published" && (
                  <AdminStatusButton
                    endpoint={`/api/admin/reviews/${review.id}/status`}
                    status="published"
                    label="Onayla"
                    variant="default"
                  />
                )}
                {review.status !== "rejected" && (
                  <AdminStatusButton
                    endpoint={`/api/admin/reviews/${review.id}/status`}
                    status="rejected"
                    label="Reddet"
                    variant="destructive"
                  />
                )}
              </div>
            </div>
          </CardHeader>
          {review.comment && (
            <CardContent className="pt-0">
              <p className="text-sm leading-relaxed text-foreground/80">{review.comment}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
