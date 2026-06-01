import { DashboardRoute } from "@/features/dashboard/shared/dashboard-route";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Öğrenci Paneli | ÖzelDersEvim",
};

export default function StudentDashboardPage() {
  return <DashboardRoute activePath="/ogrenci/panel" pageId="student-home" role="student" />;
}
