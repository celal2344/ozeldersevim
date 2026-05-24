import { DashboardRoute } from "@/features/dashboard/shared/dashboard-route";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Yorumlar | ÖzelDersEvim",
};

export default function TeacherReviewsPage() {
  return <DashboardRoute activePath="/ogretmen/panel/yorumlar" pageId="teacher-reviews" role="teacher" />;
}
