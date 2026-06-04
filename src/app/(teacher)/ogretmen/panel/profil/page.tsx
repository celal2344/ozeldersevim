import { DashboardRoute } from "@/features/dashboard/shared/dashboard-route";
import { TeacherProfileSettingsView } from "@/features/teachers/teacher-profile-settings-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Profilim | ÖzelDersEvim",
};

export default function TeacherProfilePage() {
  return (
    <DashboardRoute activePath="/ogretmen/panel/profil" pageId="teacher-profile" role="teacher">
      <TeacherProfileSettingsView />
    </DashboardRoute>
  );
}
