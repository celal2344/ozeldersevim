import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { OgretmenOlFlow } from "@/features/teachers/onboarding-flow";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

export const metadata: Metadata = {
  title: "Öğretmen Ol | ÖzelDersEvim",
  description: "Öğretmenlik uygunluk testini geçin ve profilinizi oluşturun.",
};

export default async function OgretmenOlPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris?redirect=/ogretmen-ol");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "teacher") {
    redirect("/kayit");
  }

  const { data: existingTeacherProfile } = await supabase
    .from("teacher_profiles")
    .select("id, status, teacher_listings(slug)")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (existingTeacherProfile) {
    const slug = (existingTeacherProfile as { teacher_listings?: { slug: string }[] | null })
      .teacher_listings?.[0]?.slug;
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-2xl font-bold text-brand-navy">Profiliniz Zaten Var</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Öğretmen profiliniz{" "}
            <span className="font-medium">
              {existingTeacherProfile.status === "published" ? "yayında" : "taslak durumunda"}
            </span>
            .
          </p>
          {slug ? (
            <a
              href={`/ogretmen/${slug}`}
              className="mt-4 inline-block text-sm font-medium text-brand-orange underline"
            >
              Profilimi Görüntüle →
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  const { data: passedAttempt } = await supabase
    .from("teacher_eligibility_attempts")
    .select("id")
    .eq("profile_id", user.id)
    .eq("status", "passed")
    .maybeSingle();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-navy">Öğretmen Ol</h1>
        <p className="mt-2 text-muted-foreground">
          {!passedAttempt
            ? "Önce öğretmenlik uygunluk testini geçmen, ardından profilini oluşturman gerekiyor."
            : "Testi geçtiniz! Şimdi öğretmen profilinizi oluşturun."}
        </p>
        <div className="mt-4 flex gap-3">
          <StepBadge step={1} label="Uygunluk Testi" active={!passedAttempt} done={!!passedAttempt} />
          <StepBadge step={2} label="Profil Oluştur" active={!!passedAttempt} done={false} />
        </div>
      </div>

      <OgretmenOlFlow hasPassed={!!passedAttempt} />
    </div>
  );
}

function StepBadge({ step, label, active, done }: { step: number; label: string; active: boolean; done: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        done
          ? "bg-green-100 text-green-700"
          : active
          ? "bg-brand-orange text-white"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {step}. {label} {done ? "✓" : ""}
    </span>
  );
}
