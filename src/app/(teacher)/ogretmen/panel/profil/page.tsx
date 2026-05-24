import { DashboardRoute } from "@/features/dashboard/shared/dashboard-route";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Öğretmen Profili | ÖzelDersEvim",
};

export default function TeacherProfilePage() {
  return <DashboardRoute activePath="/ogretmen/panel/profil" pageId="teacher-profile" role="teacher" />;
}
