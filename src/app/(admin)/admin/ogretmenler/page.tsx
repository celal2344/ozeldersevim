import { AdminShell } from "@/features/admin/admin-shell";
import { AdminTeachersView } from "@/features/admin/admin-teachers-view";
import { requireAdminAccount } from "@/features/admin/admin-utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Öğretmenler | Admin",
};

export default async function AdminTeachersPage() {
  const account = await requireAdminAccount();

  return (
    <AdminShell account={account}>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-brand-navy">Öğretmenler</h1>
        <AdminTeachersView />
      </div>
    </AdminShell>
  );
}
