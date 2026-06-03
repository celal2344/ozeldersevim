import { DashboardRoute } from "@/features/dashboard/shared/dashboard-route";
import { StudentFavoritesView } from "@/features/favorites/student-favorites-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Favoriler | ÖzelDersEvim",
};

export default function StudentFavoritesPage() {
  return (
    <DashboardRoute activePath="/ogrenci/panel/favoriler" pageId="student-favorites" role="student">
      <StudentFavoritesView />
    </DashboardRoute>
  );
}
