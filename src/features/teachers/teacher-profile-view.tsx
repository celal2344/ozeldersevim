import Link from "next/link";
import {
  BookOpenIcon,
  CheckCircle2Icon,
  GraduationCapIcon,
  MapPinIcon,
  MessageCircleIcon,
  StarIcon,
  VideoIcon,
} from "lucide-react";

import type { TeacherProfile } from "@/features/teachers/types";
import {
  teacherDeliveryLabel,
  teacherInitials,
  teacherPriceLabel,
  teacherProfileStats,
  teacherRatingLabel,
  teacherRequestHref,
} from "@/features/teachers/utils";
import { FavoriteButton } from "@/features/favorites/favorite-button";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function TeacherProfileView({ teacher }: { teacher: TeacherProfile }) {
  return (
    <main className="bg-slate-50">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(251,115,22,0.28),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
              <Link href="/ogretmen-bul" className="text-brand-orange hover:text-brand-orange/80">
                Öğretmenler
              </Link>
              <span>/</span>
              <span>{teacher.fullName}</span>
            </div>
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="flex size-24 shrink-0 items-center justify-center rounded-3xl bg-white/10 text-3xl font-bold ring-1 ring-white/15">
                {teacherInitials(teacher.fullName)}
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  {teacher.isVerified ? (
                    <Badge className="bg-brand-orange text-white hover:bg-brand-orange">
                      <CheckCircle2Icon data-icon="inline-start" aria-hidden="true" />
                      Doğrulanmış öğretmen
                    </Badge>
                  ) : null}
                  <Badge className="bg-white/10 text-white hover:bg-white/10">
                    {teacherDeliveryLabel(teacher.deliveryMode)}
                  </Badge>
                </div>
                <div>
                  <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                    {teacher.fullName}
                  </h1>
                  <p className="mt-2 text-lg text-white/75">{teacher.headline}</p>
                </div>
              </div>
            </div>
            <p className="max-w-3xl text-base leading-7 text-white/72">{teacher.shortBio}</p>
            <div className="grid gap-3 text-sm text-white/72 sm:grid-cols-2 lg:grid-cols-4">
              <span className="inline-flex items-center gap-2">
                <MapPinIcon aria-hidden="true" className="text-brand-orange" />
                {teacher.city} / {teacher.district}
              </span>
              <span className="inline-flex items-center gap-2">
                <StarIcon aria-hidden="true" className="text-brand-orange" />
                {teacherRatingLabel(teacher)}
              </span>
              <span className="inline-flex items-center gap-2">
                <GraduationCapIcon aria-hidden="true" className="text-brand-orange" />
                {teacher.experienceYears} yıl deneyim
              </span>
              <span className="inline-flex items-center gap-2">
                <VideoIcon aria-hidden="true" className="text-brand-orange" />
                {teacherDeliveryLabel(teacher.deliveryMode)}
              </span>
            </div>
          </div>

          <Card className="self-start rounded-2xl border-white/10 bg-white text-brand-navy shadow-2xl shadow-black/20">
            <CardHeader>
              <CardTitle>Ders Talebi</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div>
                <p className="text-3xl font-bold text-brand-orange">{teacherPriceLabel(teacher)}</p>
                <p className="mt-1 text-sm text-muted-foreground">Öğretmen kabul edince iletişim bilgilerin paylaşılır.</p>
              </div>
              <Button
                size="lg"
                className="h-11 bg-brand-orange text-white hover:bg-brand-orange/90"
                nativeButton={false}
                render={<Link href={teacherRequestHref(teacher)} />}
              >
                Ders Talep Et
              </Button>
              <FavoriteButton teacherSlug={teacher.slug} />
              <div className="grid gap-2 text-sm text-muted-foreground">
                <span>Platform içi ödeme yok.</span>
                <span>Online ders linkini taraflar kendileri oluşturur.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="flex flex-col gap-6">
          <Card className="rounded-2xl bg-white">
            <CardHeader>
              <CardTitle>Öğretmen Hakkında</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm leading-7 text-muted-foreground">{teacher.longBio}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-muted-foreground">Eğitim</p>
                  <p className="mt-1 font-medium text-brand-navy">{teacher.education}</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-muted-foreground">Ders Türü</p>
                  <p className="mt-1 font-medium text-brand-navy">{teacherDeliveryLabel(teacher.deliveryMode)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-white">
            <CardHeader>
              <CardTitle>Verdiği Dersler</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {teacher.lessons.map((lesson) => (
                <Badge key={lesson} className="bg-brand-navy text-white hover:bg-brand-navy">
                  <BookOpenIcon data-icon="inline-start" aria-hidden="true" />
                  {lesson}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-white">
            <CardHeader>
              <CardTitle>Yorumlar</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {teacher.reviews.length > 0 ? (
                teacher.reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-brand-navy">{review.studentName}</p>
                      <span className="inline-flex items-center gap-1 text-sm text-brand-orange">
                        <StarIcon aria-hidden="true" className="size-4 fill-current" />
                        {review.rating}.0
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-muted-foreground">
                  Bu öğretmen için henüz yayınlanan yorum yok. Yorumlar, öğretmen ders talebini kabul ettikten sonra yapılabilir.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="flex flex-col gap-6">
          <Card className="rounded-2xl bg-brand-navy text-white">
            <CardHeader>
              <CardTitle>Profil Özeti</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {teacherProfileStats(teacher).map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/8 p-4">
                  <p className="text-xs text-white/55">{stat.label}</p>
                  <p className="mt-1 font-semibold">{stat.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-white">
            <CardHeader>
              <CardTitle>İletişim Kuralı</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                Öğrenci iletişim bilgileri öğretmene sadece ders talebi kabul edildikten sonra açılır.
              </p>
              <p className="inline-flex items-center gap-2 text-brand-navy">
                <MessageCircleIcon aria-hidden="true" className="text-brand-orange" />
                Platform içi chat sonraki fazdadır.
              </p>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}
