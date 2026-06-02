import Link from "next/link";

import {
  deliveryModeLabels,
  lessonRequestStatusLabels,
  lessonRequestStatusVariant,
} from "@/features/requests/constants";
import { getStudentLessonRequests } from "@/features/requests/service";
import { ReviewForm } from "@/features/reviews/review-form";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
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
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">Talepler yüklenirken bir hata oluştu.</p>
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-brand-navy">Henüz ders talebi göndermedin.</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Bir öğretmenin profilinden ders talebi gönderdiğinde talebin burada görünecek.
          </p>
          <Button
            className="mt-4 w-fit bg-brand-orange text-white hover:bg-brand-orange/90"
            nativeButton={false}
            render={<Link href="/ogretmen-bul" />}
          >
            Öğretmen Bul
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {requests.map((req) => {
        const isAccepted = req.status === "accepted";
        const hasReview = Boolean(req.reviews);
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
