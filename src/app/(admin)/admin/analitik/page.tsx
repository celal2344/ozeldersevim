import { AdminShell } from "@/features/admin/admin-shell";
import { requireAdminAccount } from "@/features/admin/admin-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Analitik | Admin",
};

const eventLabels: Record<string, string> = {
  user_registered: "Kayıt",
  search_submitted: "Arama",
  teacher_profile_viewed: "Profil Görüntüleme",
  lesson_request_submitted: "Ders Talebi",
  review_submitted: "Yorum",
  favorite_toggled: "Favori",
};

async function getAnalytics() {
  const supabase = await createSupabaseServerClient();

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const { data, error } = await supabase
    .from("analytics_events")
    .select("name, created_at")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false });

  if (error || !data) return { totals: {}, recent: [], total: 0 };

  const totals: Record<string, number> = {};
  for (const row of data) {
    totals[row.name] = (totals[row.name] ?? 0) + 1;
  }

  return { totals, recent: data.slice(0, 20), total: data.length };
}

export default async function AdminAnalyticsPage() {
  const account = await requireAdminAccount();
  const { totals, recent, total } = await getAnalytics();

  return (
    <AdminShell account={account}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Analitik</h1>
          <p className="mt-1 text-sm text-muted-foreground">Son 30 günde {total} event.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(eventLabels).map(([name, label]) => (
            <Card key={name}>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-brand-navy">{totals[name] ?? 0}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {recent.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Son Eventler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {recent.map((event, i) => (
                  <div key={i} className="flex items-center justify-between py-2 text-sm">
                    <span className="font-medium text-foreground">
                      {eventLabels[event.name] ?? event.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.created_at).toLocaleString("tr-TR")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminShell>
  );
}
