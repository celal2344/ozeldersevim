import { DashboardRoute } from "@/features/dashboard/shared/dashboard-route";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "İlanım | ÖzelDersEvim",
};

export default function TeacherListingPage() {
  return <DashboardRoute activePath="/ogretmen/panel/ilan" pageId="teacher-listing" role="teacher" />;
}
