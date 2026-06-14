import { TeacherStudentsView } from "@/features/calendar/teacher-students-view";
import { DashboardRoute } from "@/features/dashboard/shared/dashboard-route";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Öğrenciler | ÖzelDersEvim",
};

export default function TeacherStudentsPage() {
  return (
    <DashboardRoute activePath="/ogretmen/panel/ogrenciler" pageId="teacher-students" role="teacher">
      <TeacherStudentsView />
    </DashboardRoute>
  );
}
