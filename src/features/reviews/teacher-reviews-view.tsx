import { StarIcon } from "lucide-react";
import Link from "next/link";

import { getTeacherReviews } from "@/features/reviews/service";
import { DashboardStateCard } from "@/features/dashboard/shared/dashboard-state-card";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} üzerinden 5 puan`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={star <= rating ? "size-4 fill-yellow-400 text-yellow-400" : "size-4 fill-none text-muted-foreground"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export async function TeacherReviewsView() {
  let reviews;
  try {
    reviews = await getTeacherReviews();
  } catch {
    return (
      <DashboardStateCard
        description="Lütfen sayfayı yenileyip tekrar dene. Sorun devam ederse daha sonra kontrol et."
        title="Yorumlar yüklenirken bir hata oluştu."
        tone="error"
      />
    );
  }

  if (reviews.length === 0) {
    return (
      <DashboardStateCard
        actionHref="/ogretmen/panel/talepler"
        actionLabel="Taleplere Git"
        description="Bir ders talebini kabul ettiğinde ve öğrenci yorum yazdığında buraya düşer."
        title="Henüz yorum yok."
      />
    );
  }

  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = totalRating / reviews.length;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex items-center gap-4 pt-5">
          <span className="text-4xl font-bold text-brand-navy">{avgRating.toFixed(1)}</span>
          <div className="flex flex-col gap-1">
            <StarRating rating={Math.round(avgRating)} />
            <span className="text-xs text-muted-foreground">{reviews.length} yorum</span>
          </div>
          <Button
            className="ml-auto hidden bg-brand-orange text-white hover:bg-brand-orange/90 sm:inline-flex"
            nativeButton={false}
            render={<Link href="/ogretmen/panel/talepler" />}
            size="sm"
          >
            Taleplere Git
          </Button>
        </CardContent>
      </Card>

      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>
                <span className="text-sm font-medium text-brand-navy">
                  {review.lesson_requests?.lesson_categories?.name ?? "Bilinmiyor"} dersi
                </span>
              </div>
              <StarRating rating={review.rating} />
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
