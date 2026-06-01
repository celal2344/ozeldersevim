import { DashboardRoute } from "@/features/dashboard/shared/dashboard-route";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ders Taleplerim | ÖzelDersEvim",
};

export default function StudentRequestsPage() {
  return <DashboardRoute activePath="/ogrenci/panel/talepler" pageId="student-requests" role="student" />;
}
