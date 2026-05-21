import Link from "next/link";
import { MapPinIcon, StarIcon, VideoIcon } from "lucide-react";

import type { TeacherSearchResult } from "@/features/search/types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";

const deliveryLabels = {
  online: "Online",
  face_to_face: "Yüz yüze",
  both: "Online + Yüz yüze",
};

export function TeacherResultCard({ teacher }: { teacher: TeacherSearchResult }) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{teacher.fullName}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{teacher.headline}</p>
          </div>
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted font-semibold">
            {teacher.fullName
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm leading-6 text-muted-foreground">{teacher.shortBio}</p>
        <div className="flex flex-wrap gap-2">
          {teacher.lessons.map((lesson) => (
            <Badge key={lesson} variant="secondary">
              {lesson}
            </Badge>
          ))}
        </div>
        <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <span className="inline-flex items-center gap-2">
            <MapPinIcon aria-hidden="true" />
            {teacher.city} / {teacher.district}
          </span>
          <span className="inline-flex items-center gap-2">
            <VideoIcon aria-hidden="true" />
            {deliveryLabels[teacher.deliveryMode]}
          </span>
          <span className="inline-flex items-center gap-2">
            <StarIcon aria-hidden="true" />
            {teacher.reviewCount > 0 ? `${teacher.ratingAverage.toFixed(1)} (${teacher.reviewCount})` : "Yeni öğretmen"}
          </span>
          <span>{teacher.experienceYears} yıl deneyim</span>
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <div>
          <p className="text-lg font-semibold">₺{teacher.hourlyPrice}</p>
          <p className="text-xs text-muted-foreground">60 dakikalık ders</p>
          {teacher.distanceKm !== undefined ? (
            <p className="text-xs text-muted-foreground">{teacher.distanceKm.toFixed(1)} km yakında</p>
          ) : null}
        </div>
        <Button nativeButton={false} render={<Link href={`/ogretmen/${teacher.slug}`} />}>
          Profili Gör
        </Button>
      </CardFooter>
    </Card>
  );
}
