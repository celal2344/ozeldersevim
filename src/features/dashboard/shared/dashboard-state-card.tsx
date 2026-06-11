import type { LucideIcon } from "lucide-react";
import { AlertCircleIcon, InboxIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

type DashboardStateCardProps = {
  actionHref?: string;
  actionLabel?: string;
  description: string;
  icon?: LucideIcon;
  tone?: "default" | "error" | "warning";
  title: string;
};

export function DashboardStateCard({
  actionHref,
  actionLabel,
  description,
  icon,
  tone = "default",
  title,
}: DashboardStateCardProps) {
  const Icon = icon ?? (tone === "error" ? AlertCircleIcon : InboxIcon);
  const iconClass =
    tone === "error"
      ? "bg-red-50 text-red-600"
      : tone === "warning"
        ? "bg-orange-50 text-brand-orange"
        : "bg-slate-100 text-brand-navy";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <CardTitle className="text-lg text-brand-navy">{title}</CardTitle>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardHeader>
      {actionHref && actionLabel ? (
        <CardContent className="pt-2">
          <Button
            className="w-fit bg-brand-orange text-white hover:bg-brand-orange/90"
            nativeButton={false}
            render={<Link href={actionHref} />}
          >
            {actionLabel}
          </Button>
        </CardContent>
      ) : null}
    </Card>
  );
}
