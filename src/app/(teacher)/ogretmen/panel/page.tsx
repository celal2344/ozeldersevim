import { DashboardRoute } from "@/features/dashboard/shared/dashboard-route";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Öğretmen Paneli | ÖzelDersEvim",
};

export default function TeacherDashboardPage() {
  return <DashboardRoute activePath="/ogretmen/panel" pageId="teacher-home" role="teacher" />;
}
