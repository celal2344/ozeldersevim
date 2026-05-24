import { DashboardRoute } from "@/features/dashboard/shared/dashboard-route";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ders Talepleri | ÖzelDersEvim",
};

export default function TeacherRequestsPage() {
  return <DashboardRoute activePath="/ogretmen/panel/talepler" pageId="teacher-requests" role="teacher" />;
}
