import Link from "next/link";
import { MapPinIcon, StarIcon } from "lucide-react";

import { FavoriteButton } from "@/features/favorites/favorite-button";
import { getStudentFavorites } from "@/features/favorites/service";
import { DashboardStateCard } from "@/features/dashboard/shared/dashboard-state-card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

const deliveryLabels = {
  online: "Online",
  face_to_face: "Yüz yüze",
  both: "Online / Yüz yüze",
} as const;

export async function StudentFavoritesView() {
  let favorites;
  try {
    favorites = await getStudentFavorites();
  } catch {
    return (
      <DashboardStateCard
        description="Lütfen sayfayı yenileyip tekrar dene. Sorun devam ederse daha sonra kontrol et."
        title="Favoriler yüklenirken bir hata oluştu."
        tone="error"
      />
    );
  }

  if (favorites.length === 0) {
    return (
      <DashboardStateCard
        actionHref="/ogretmen-bul"
        actionLabel="Öğretmen Bul"
        description="Öğretmen profilinde Favorile butonuna tıklayarak kayıt edebilirsin."
        title="Henüz favori öğretmen eklemedin."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {favorites.map((fav) => {
        const profile = fav.teacher_profiles;
        const listing = profile?.teacher_listings;
        const location = profile?.locations;

        if (!profile || !listing) return null;

        return (
          <Card key={fav.teacher_profile_id} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-base text-brand-navy leading-snug">
                    {listing.headline}
                  </CardTitle>
                  {location && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPinIcon className="size-3" aria-hidden="true" />
                      {location.city}{location.district ? ` / ${location.district}` : ""}
                    </span>
                  )}
                </div>
                <FavoriteButton teacherSlug={listing.slug} />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-0">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{deliveryLabels[profile.delivery_mode]}</Badge>
                {listing.review_count > 0 && (
                  <Badge variant="outline" className="gap-1">
                    <StarIcon className="size-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    {listing.rating_average.toFixed(1)} ({listing.review_count})
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-brand-orange">
                  {profile.hourly_price.toLocaleString("tr-TR")} TL/saat
                </span>
                <Button
                  size="sm"
                  className="bg-brand-orange text-white hover:bg-brand-orange/90"
                  nativeButton={false}
                  render={<Link href={`/ogretmen/${listing.slug}`} />}
                >
                  Profili Gör
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
