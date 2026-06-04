import Link from "next/link";
import { ListChecksIcon, StarIcon } from "lucide-react";

import { AdminShell } from "@/features/admin/admin-shell";
import { requireAdminAccount } from "@/features/admin/admin-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Paneli | ÖzelDersEvim",
};

const adminSections = [
  {
    href: "/admin/ogretmenler",
    icon: ListChecksIcon,
    title: "Öğretmenler",
    description: "Öğretmen profillerini görüntüle, yayınla veya askıya al.",
  },
  {
    href: "/admin/yorumlar",
    icon: StarIcon,
    title: "Yorumlar",
    description: "Gelen yorumları onayla veya reddet.",
  },
] as const;

export default async function AdminOverviewPage() {
  const account = await requireAdminAccount();

  return (
    <AdminShell account={account}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Genel Bakış</h1>
          <p className="mt-1 text-sm text-muted-foreground">Hoş geldin, {account.fullName}.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {adminSections.map((section) => {
            const Icon = section.icon;

            return (
              <Link key={section.href} href={section.href} className="group">
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="size-5 text-brand-orange" aria-hidden="true" />
                      <CardTitle className="text-base text-brand-navy">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}
