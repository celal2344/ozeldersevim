import Link from "next/link";
import { MapPinIcon, StarIcon, VideoIcon } from "lucide-react";

import {
  distanceLabel,
  initialsFromTeacherName,
  reviewLabel,
} from "@/features/search/utils";
import { teacherDeliveryLabels } from "@/features/search/constants";
import type { TeacherSearchResult } from "@/features/search/types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function TeacherResultCard({ teacher }: { teacher: TeacherSearchResult }) {
  return (
    <Card className="rounded-2xl bg-brand-navy text-white shadow-lg shadow-slate-950/10 ring-0">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{teacher.fullName}</CardTitle>
            <p className="mt-1 text-sm text-white/58">{teacher.headline}</p>
          </div>
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10 font-semibold">
            {initialsFromTeacherName(teacher.fullName)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm leading-6 text-white/65">{teacher.shortBio}</p>
        <div className="flex flex-wrap gap-2">
          {teacher.lessons.map((lesson) => (
            <Badge key={lesson} className="bg-white/10 text-white hover:bg-white/15">
              {lesson}
            </Badge>
          ))}
        </div>
        <div className="grid gap-2 text-sm text-white/62 sm:grid-cols-2">
          <span className="inline-flex items-center gap-2">
            <MapPinIcon aria-hidden="true" />
            {teacher.city} / {teacher.district}
          </span>
          <span className="inline-flex items-center gap-2">
            <VideoIcon aria-hidden="true" />
            {teacherDeliveryLabels[teacher.deliveryMode]}
          </span>
          <span className="inline-flex items-center gap-2">
            <StarIcon aria-hidden="true" className="text-brand-orange" />
            {reviewLabel(teacher)}
          </span>
          <span>{teacher.experienceYears} yÄ±l deneyim</span>
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-3 border-white/10 bg-white/5">
        <div>
          <p className="text-lg font-semibold text-brand-orange">â‚º{teacher.hourlyPrice}</p>
          <p className="text-xs text-white/55">60 dakikalÄ±k ders</p>
          {teacher.distanceKm !== undefined ? (
            <p className="text-xs text-white/55">{distanceLabel(teacher.distanceKm)}</p>
          ) : null}
        </div>
        <Button
          className="bg-brand-orange text-white hover:bg-brand-orange/90"
          nativeButton={false}
          render={<Link href={`/ogretmen/${teacher.slug}`} />}
        >
          Profili GÃ¶r
        </Button>
      </CardFooter>
    </Card>
  );
}
