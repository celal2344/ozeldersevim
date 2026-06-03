import { AdminShell } from "@/features/admin/admin-shell";
import { AdminReviewsView } from "@/features/admin/admin-reviews-view";
import { requireAdminAccount } from "@/features/admin/admin-utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Yorumlar | Admin",
};

export default async function AdminReviewsPage() {
  const account = await requireAdminAccount();

  return (
    <AdminShell account={account}>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-brand-navy">Yorumlar</h1>
        <AdminReviewsView />
      </div>
    </AdminShell>
  );
}
