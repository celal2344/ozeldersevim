import {
  deliveryModeLabels,
  lessonRequestStatusLabels,
  lessonRequestStatusVariant,
} from "@/features/requests/constants";
import { getStudentLessonRequests } from "@/features/requests/service";
import { formatHour, weekdayLabel } from "@/features/availability/utils";
import { ReviewForm } from "@/features/reviews/review-form";
import { DashboardStateCard } from "@/features/dashboard/shared/dashboard-state-card";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export async function StudentRequestsView() {
  let requests;
  try {
    requests = await getStudentLessonRequests();
  } catch {
    return (
      <DashboardStateCard
        description="Lütfen sayfayı yenileyip tekrar dene. Sorun devam ederse daha sonra kontrol et."
        title="Talepler yüklenirken bir hata oluştu."
        tone="error"
      />
    );
  }

  if (requests.length === 0) {
    return (
      <DashboardStateCard
        actionHref="/ogretmen-bul"
        actionLabel="Öğretmen Bul"
        description="Bir öğretmenin profilinden ders talebi gönderdiğinde talebin burada görünecek."
        title="Henüz ders talebi göndermedin."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {requests.map((req) => {
        const isAccepted = req.status === "accepted";
        const hasReview = Array.isArray(req.reviews) ? req.reviews.length > 0 : Boolean(req.reviews);
        const categoryName = req.lesson_categories?.name ?? "Bilinmiyor";

        return (
          <Card key={req.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">{formatDate(req.created_at)}</span>
                  <CardTitle className="text-base text-brand-navy">
                    {categoryName} dersi talebi
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {deliveryModeLabels[req.delivery_mode]}
                    {req.student_level ? ` · ${req.student_level}` : ""}
                  </span>
                </div>
                <Badge variant={lessonRequestStatusVariant[req.status]}>
                  {lessonRequestStatusLabels[req.status]}
                </Badge>
              </div>
            </CardHeader>

            {req.goal && (
              <CardContent className="pb-3 pt-0">
                <p className="text-sm leading-relaxed text-foreground/80">{req.goal}</p>
                {req.preferred_weekday && req.preferred_start_hour !== null ? (
                  <p className="mt-2 text-xs font-medium text-brand-orange">
                    Tercih edilen zaman: {weekdayLabel(req.preferred_weekday as 1 | 2 | 3 | 4 | 5 | 6 | 7)} {formatHour(req.preferred_start_hour)}
                  </p>
                ) : null}
              </CardContent>
            )}

            {isAccepted && (
              <>
                <Separator />
                <CardContent className="pt-4">
                  {hasReview ? (
                    <p className="text-sm font-medium text-green-700">
                      Bu talep için yorumunu zaten yazdın.
                    </p>
                  ) : (
                    <ReviewForm lessonRequestId={req.id} lessonCategoryName={categoryName} />
                  )}
                </CardContent>
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
}
