import { BookOpenIcon, GraduationCapIcon, MapPinIcon, StarIcon, UsersIcon, VideoIcon } from "lucide-react";
import Link from "next/link";

import { teacherDeliveryLabels } from "@/features/search/constants";
import type { TeacherSearchResult } from "@/features/search/types";
import { distanceLabel, initialsFromTeacherName, reviewLabel } from "@/features/search/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/components/ui/card";

export function TeacherResultCard({ teacher }: { teacher: TeacherSearchResult }) {
  return (
    <Card className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
              {initialsFromTeacherName(teacher.fullName)}
            </div>
            <div>
              <p className="font-semibold text-brand-navy">{teacher.fullName}</p>
              <p className="text-sm text-muted-foreground">{teacher.headline}</p>
              <div className="mt-1 flex items-center gap-1">
                <StarIcon className="size-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                <span className="text-sm font-medium text-brand-navy">{reviewLabel(teacher)}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-brand-orange">₺{teacher.hourlyPrice}</p>
            <p className="text-xs text-muted-foreground">/ saat</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pb-3">
        {teacher.lessons.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {teacher.lessons.slice(0, 3).map((lesson) => (
              <Badge key={lesson} variant="secondary" className="text-xs">
                {lesson}
              </Badge>
            ))}
            {teacher.lessons.length > 3 ? (
              <Badge variant="outline" className="text-xs">
                +{teacher.lessons.length - 3} ders
              </Badge>
            ) : null}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPinIcon className="size-3.5 shrink-0 text-brand-orange" aria-hidden="true" />
            {teacher.city} / {teacher.district}
          </span>
          <span className="flex items-center gap-1.5">
            <VideoIcon className="size-3.5 shrink-0 text-brand-orange" aria-hidden="true" />
            {teacherDeliveryLabels[teacher.deliveryMode]}
          </span>
          <span className="flex items-center gap-1.5">
            <GraduationCapIcon className="size-3.5 shrink-0 text-brand-orange" aria-hidden="true" />
            {teacher.experienceYears} yıl deneyim
          </span>
          {teacher.completedLessons !== undefined && teacher.completedLessons > 0 ? (
            <span className="flex items-center gap-1.5">
              <BookOpenIcon className="size-3.5 shrink-0 text-brand-orange" aria-hidden="true" />
              {teacher.completedLessons} ders verdi
            </span>
          ) : null}
          {teacher.activeStudents !== undefined && teacher.activeStudents > 0 ? (
            <span className="flex items-center gap-1.5">
              <UsersIcon className="size-3.5 shrink-0 text-brand-orange" aria-hidden="true" />
              {teacher.activeStudents} öğrenci
            </span>
          ) : null}
          {teacher.distanceKm !== undefined ? (
            <span className="col-span-2 flex items-center gap-1.5">
              <MapPinIcon className="size-3.5 shrink-0" aria-hidden="true" />
              {distanceLabel(teacher.distanceKm)}
            </span>
          ) : null}
        </div>

        {teacher.shortBio ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {teacher.shortBio}
          </p>
        ) : null}
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-2 border-t bg-slate-50/60 pt-3">
        <Button
          className="h-9 bg-brand-orange text-white hover:bg-brand-orange/90"
          nativeButton={false}
          render={<Link href={`/ders-talebi?teacher=${teacher.slug}`} />}
        >
          Hızlı Talep Oluştur
        </Button>
        <Button
          variant="outline"
          className="h-9"
          nativeButton={false}
          render={<Link href={`/ogretmen/${teacher.slug}`} />}
        >
          Profili Gör
        </Button>
      </CardFooter>
    </Card>
  );
}
