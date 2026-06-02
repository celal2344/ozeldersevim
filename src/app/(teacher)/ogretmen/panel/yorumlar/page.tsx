import { DashboardRoute } from "@/features/dashboard/shared/dashboard-route";
import { TeacherReviewsView } from "@/features/reviews/teacher-reviews-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Yorumlar | ÖzelDersEvim",
};

export default function TeacherReviewsPage() {
  return (
    <DashboardRoute activePath="/ogretmen/panel/yorumlar" pageId="teacher-reviews" role="teacher">
      <TeacherReviewsView />
    </DashboardRoute>
  );
}
