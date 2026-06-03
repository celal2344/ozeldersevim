import { DashboardRoute } from "@/features/dashboard/shared/dashboard-route";
import { AccountProfileView } from "@/features/profiles/account-profile-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Profilim | ÖzelDersEvim",
};

export default function StudentProfilePage() {
  return (
    <DashboardRoute activePath="/ogrenci/panel/profil" pageId="student-profile" role="student">
      <AccountProfileView />
    </DashboardRoute>
  );
}
