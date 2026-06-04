import { createSupabaseServerClient } from "@/shared/db/supabase/server";
import { AdminStatusButton } from "@/features/admin/admin-status-button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";

const statusVariant = {
  published: "default",
  draft: "secondary",
  suspended: "destructive",
} as const;

const statusLabel = {
  published: "Yayında",
  draft: "Taslak",
  suspended: "Askıda",
} as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

export async function AdminTeachersView() {
  const supabase = await createSupabaseServerClient();

  const { data: profiles, error } = await supabase
    .from("teacher_profiles")
    .select(
      "id, status, hourly_price, delivery_mode, created_at, profiles!profile_id(full_name, phone), teacher_listings!teacher_profile_id(slug, headline, is_published)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-sm text-destructive">Öğretmenler yüklenemedi: {error.message}</p>;
  }

  if (!profiles || profiles.length === 0) {
    return <p className="text-sm text-muted-foreground">Henüz kayıtlı öğretmen yok.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {(profiles as unknown as Array<{
        id: string;
        status: "published" | "draft" | "suspended";
        hourly_price: number;
        delivery_mode: string;
        created_at: string;
        profiles: { full_name: string; phone: string | null } | null;
        teacher_listings: { slug: string; headline: string; is_published: boolean } | null;
      }>).map((tp) => (
        <Card key={tp.id}>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-brand-navy">
                  {tp.profiles?.full_name ?? "İsimsiz"}
                </span>
                <Badge variant={statusVariant[tp.status]}>{statusLabel[tp.status]}</Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {tp.teacher_listings?.headline ?? "İlan yok"} · {tp.hourly_price.toLocaleString("tr-TR")} ₺/saat · {formatDate(tp.created_at)}
              </span>
              {tp.profiles?.phone && (
                <span className="text-xs text-muted-foreground">{tp.profiles.phone}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {tp.status !== "published" && (
                <AdminStatusButton
                  endpoint={`/api/admin/teacher-profiles/${tp.id}/status`}
                  status="published"
                  label="Yayınla"
                  variant="default"
                />
              )}
              {tp.status !== "suspended" && (
                <AdminStatusButton
                  endpoint={`/api/admin/teacher-profiles/${tp.id}/status`}
                  status="suspended"
                  label="Askıya Al"
                  variant="destructive"
                />
              )}
              {tp.status === "suspended" && (
                <AdminStatusButton
                  endpoint={`/api/admin/teacher-profiles/${tp.id}/status`}
                  status="draft"
                  label="Taslağa Al"
                  variant="outline"
                />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
