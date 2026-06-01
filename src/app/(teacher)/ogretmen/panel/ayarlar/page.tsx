import { DashboardRoute } from "@/features/dashboard/shared/dashboard-route";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ayarlar | ÖzelDersEvim",
};

export default function TeacherSettingsPage() {
  return <DashboardRoute activePath="/ogretmen/panel/ayarlar" pageId="teacher-settings" role="teacher" />;
}
