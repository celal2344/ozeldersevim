import { getCurrentAccount } from "@/features/auth/service";
import type { AuthAccount } from "@/features/auth/types";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

export class AdminActionError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

async function requireAdmin(): Promise<AuthAccount> {
  const account = await getCurrentAccount();

  if (!account || account.role !== "admin") {
    throw new AdminActionError("Yetkisiz erişim.", 403);
  }

  return account;
}

async function writeAdminAuditLog({
  action,
  actorProfileId,
  entityId,
  entityTable,
  metadata,
}: {
  action: string;
  actorProfileId: string;
  entityId: string;
  entityTable: string;
  metadata: Record<string, unknown>;
}) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("admin_audit_logs").insert({
    actor_profile_id: actorProfileId,
    action,
    entity_table: entityTable,
    entity_id: entityId,
    metadata,
  });

  if (error) {
    throw new AdminActionError(error.message, 500);
  }
}

export async function updateTeacherProfileModerationStatus(
  teacherProfileId: string,
  status: "published" | "suspended" | "draft"
) {
  const account = await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data: current, error: fetchError } = await supabase
    .from("teacher_profiles")
    .select("id,status")
    .eq("id", teacherProfileId)
    .maybeSingle();

  if (fetchError) {
    throw new AdminActionError(fetchError.message, 500);
  }

  if (!current) {
    throw new AdminActionError("Öğretmen profili bulunamadı.", 404);
  }

  const { error: updateProfileError } = await supabase
    .from("teacher_profiles")
    .update({ status })
    .eq("id", teacherProfileId);

  if (updateProfileError) {
    throw new AdminActionError(updateProfileError.message, 500);
  }

  const { error: updateListingError } = await supabase
    .from("teacher_listings")
    .update({ is_published: status === "published" })
    .eq("teacher_profile_id", teacherProfileId);

  if (updateListingError) {
    throw new AdminActionError(updateListingError.message, 500);
  }

  await writeAdminAuditLog({
    action: "teacher_profile.status_changed",
    actorProfileId: account.id,
    entityId: teacherProfileId,
    entityTable: "teacher_profiles",
    metadata: { from: current.status, to: status },
  });

  return { id: teacherProfileId, status };
}

export async function updateReviewModerationStatus(
  reviewId: string,
  status: "published" | "rejected"
) {
  const account = await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data: current, error: fetchError } = await supabase
    .from("reviews")
    .select("id,status")
    .eq("id", reviewId)
    .maybeSingle();

  if (fetchError) {
    throw new AdminActionError(fetchError.message, 500);
  }

  if (!current) {
    throw new AdminActionError("Yorum bulunamadı.", 404);
  }

  const { error: updateError } = await supabase.from("reviews").update({ status }).eq("id", reviewId);

  if (updateError) {
    throw new AdminActionError(updateError.message, 500);
  }

  await writeAdminAuditLog({
    action: "review.status_changed",
    actorProfileId: account.id,
    entityId: reviewId,
    entityTable: "reviews",
    metadata: { from: current.status, to: status },
  });

  return { id: reviewId, status };
}
