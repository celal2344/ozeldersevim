import { DashboardRoute } from "@/features/dashboard/shared/dashboard-route";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Öğrenci Profili | ÖzelDersEvim",
};

export default function StudentProfilePage() {
  return <DashboardRoute activePath="/ogrenci/panel/profil" pageId="student-profile" role="student" />;
}
