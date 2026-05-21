import Link from "next/link";
import {
  CalendarClockIcon,
  CheckCircle2Icon,
  MapPinIcon,
  SearchIcon,
  ShieldCheckIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";

const popularLessons = [
  "Matematik",
  "Fizik",
  "Kimya",
  "İngilizce",
  "Türkçe",
  "Yazılım",
];

const stats = [
  { label: "Popüler ders kategorisi", value: "8+" },
  { label: "Test öğretmen profili", value: "3" },
  { label: "Konumlu arama desteği", value: "81 il" },
  { label: "MVP puan hedefi", value: "4.8/5" },
];

export default function HomePage() {
  return (
    <main>
      <section className="bg-background">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div className="flex flex-col gap-7">
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ShieldCheckIcon aria-hidden="true" />
                Onaylı başvuru akışı
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPinIcon aria-hidden="true" />
                İl, ilçe ve konum bazlı arama
              </span>
            </div>
            <div className="flex flex-col gap-5">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                Özel Ders Evim
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Öğrenciler için doğru öğretmeni bulmayı, öğretmenler için ders
                taleplerini yönetmeyi kolaylaştıran Türkçe özel ders platformu.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" nativeButton={false} render={<Link href="/ogretmen-bul" />}>
                <SearchIcon data-icon="inline-start" aria-hidden="true" />
                Öğretmen Bul
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<Link href="/kayit" />}
              >
                <UsersIcon data-icon="inline-start" aria-hidden="true" />
                Öğretmen Ol
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="rounded-lg border bg-card p-4">
                  <p className="text-2xl font-semibold">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="flex items-center justify-between gap-3 border-b pb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Öğretmen Arama
                  </p>
                  <p className="text-2xl font-semibold">Erzurum Matematik</p>
                </div>
                <span className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
                  18 sonuç
                </span>
              </div>
              <div className="grid gap-3 py-4 sm:grid-cols-3">
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Ders</p>
                  <p className="font-medium">Matematik</p>
                </div>
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Konum</p>
                  <p className="font-medium">Yakutiye</p>
                </div>
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Ders türü</p>
                  <p className="font-medium">Online + Yüz yüze</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  ["Ayşe Demir", "Matematik Öğretmeni", "₺650 / saat", "4.9"],
                  ["Burak Çelik", "Kimya ve TYT / AYT", "₺700 / saat", "4.3"],
                  ["Zeynep Acar", "İngilizce Öğretmeni", "₺450 / saat", "4.6"],
                ].map(([name, title, price, rating]) => (
                  <div
                    key={name}
                    className="grid gap-3 rounded-lg border bg-background p-4 sm:grid-cols-[1fr_auto]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-11 items-center justify-center rounded-lg bg-muted font-semibold">
                        {name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold">{name}</p>
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <span className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground">
                          <CheckCircle2Icon aria-hidden="true" />
                          Başvuru sonrası iletişim paylaşımı
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end">
                      <span className="font-semibold">{price}</span>
                      <span className="inline-flex items-center gap-1 text-sm">
                        <StarIcon aria-hidden="true" />
                        {rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-muted-foreground">Popüler Dersler</p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Aramayı ders ve konuma göre başlat.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popularLessons.map((lesson) => (
              <Link
                key={lesson}
                href={`/ogretmen-bul?ders=${encodeURIComponent(lesson.toLowerCase())}`}
                className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
              >
                <span className="flex items-center gap-2 font-medium">
                  <StarIcon aria-hidden="true" />
                  {lesson}
                </span>
                <span className="mt-2 block text-sm text-muted-foreground">
                  Online veya yüz yüze öğretmenleri incele.
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="flex flex-col gap-3 rounded-lg border bg-card p-5">
            <SearchIcon aria-hidden="true" />
            <h3 className="font-semibold">Öğretmen ara</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Ders, şehir, ilçe, ücret ve ders türüne göre öğretmen listelerini filtrele.
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-lg border bg-card p-5">
            <CalendarClockIcon aria-hidden="true" />
            <h3 className="font-semibold">Talep gönder</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Form adımlarını tamamla, son adımda hesabını oluştur ve başvurunu gönder.
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-lg border bg-card p-5">
            <ShieldCheckIcon aria-hidden="true" />
            <h3 className="font-semibold">Güvenli paylaşım</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              İletişim bilgilerin öğretmen başvurunu kabul ettikten sonra açılır.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
