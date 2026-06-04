import { DashboardRoute } from "@/features/dashboard/shared/dashboard-route";
import { AccountProfileView } from "@/features/profiles/account-profile-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hesap Ayarları | ÖzelDersEvim",
};

export default function TeacherSettingsPage() {
  return (
    <DashboardRoute activePath="/ogretmen/panel/ayarlar" pageId="teacher-settings" role="teacher">
      <AccountProfileView />
    </DashboardRoute>
  );
}
