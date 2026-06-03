import { getCurrentAccount } from "@/features/auth/service";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";
import { TeacherProfileForm } from "@/features/teachers/teacher-profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export async function TeacherProfileSettingsView() {
  const account = await getCurrentAccount();
  if (!account || account.role !== "teacher") return null;

  const supabase = await createSupabaseServerClient();

  const { data: tp } = await supabase
    .from("teacher_profiles")
    .select("title, bio, education, experience_years, hourly_price, delivery_mode")
    .eq("profile_id", account.id)
    .maybeSingle();

  return (
    <Card>
      <CardHeader>
        <CardDescription>İlan Bilgileri</CardDescription>
        <CardTitle className="text-xl text-brand-navy">Profil Düzenle</CardTitle>
      </CardHeader>
      <CardContent>
        {tp ? (
          <TeacherProfileForm
            defaultValues={{
              title: tp.title ?? "",
              bio: tp.bio ?? "",
              education: tp.education ?? "",
              experienceYears: tp.experience_years ?? 0,
              hourlyPrice: Number(tp.hourly_price),
              deliveryMode: tp.delivery_mode,
            }}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Öğretmen profili henüz oluşturulmamış. İlan akışını tamamladıktan sonra burada düzenleyebilirsin.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
