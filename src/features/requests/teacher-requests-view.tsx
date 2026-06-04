import { MailIcon, PhoneIcon } from "lucide-react";

import {
  deliveryModeLabels,
  lessonRequestStatusLabels,
  lessonRequestStatusVariant,
} from "@/features/requests/constants";
import { RequestActionButtons } from "@/features/requests/request-action-buttons";
import { getTeacherLessonRequests } from "@/features/requests/service";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import Link from "next/link";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export async function TeacherRequestsView() {
  let requests;
  try {
    requests = await getTeacherLessonRequests();
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
          <CardTitle className="text-lg text-brand-navy">Henüz gelen talep yok.</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            İlanın yayınlandıktan sonra öğrenciler sana ders talebi gönderebilir.
          </p>
          <Button
            className="mt-4 w-fit bg-brand-orange text-white hover:bg-brand-orange/90"
            nativeButton={false}
            render={<Link href="/ogretmen/panel/ilan" />}
          >
            İlanımı Gör
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {requests.map((req) => {
        const contact = req.lesson_request_contacts;
        const isAccepted = req.status === "accepted";
        const isSubmitted = req.status === "submitted";

        return (
          <Card key={req.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">{formatDate(req.created_at)}</span>
                  <CardTitle className="text-base text-brand-navy">
                    {req.lesson_categories?.name ?? "Bilinmiyor"} dersi talebi
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

            {isAccepted && contact && (
              <>
                <Separator />
                <CardContent className="pt-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Öğrenci iletişim bilgileri
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-brand-navy">
                      {contact.student_name}
                    </span>
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-1.5 text-sm text-brand-orange hover:underline"
                    >
                      <PhoneIcon className="size-3.5" aria-hidden="true" />
                      {contact.phone}
                    </a>
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-1.5 text-sm text-brand-orange hover:underline"
                    >
                      <MailIcon className="size-3.5" aria-hidden="true" />
                      {contact.email}
                    </a>
                  </div>
                </CardContent>
              </>
            )}

            {isSubmitted && (
              <CardContent className="pt-0">
                <RequestActionButtons requestId={req.id} />
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
