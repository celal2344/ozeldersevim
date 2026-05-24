import { GraduationCapIcon } from "lucide-react";
import Link from "next/link";

import { LogoutButton } from "@/features/auth/logout-button";
import type { AuthAccount } from "@/features/auth/types";
import type { DashboardPageContent, DashboardRoleConfig } from "@/features/dashboard/types";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";

type DashboardShellProps = {
  account: AuthAccount;
  activePath: string;
  config: DashboardRoleConfig;
  page: DashboardPageContent;
};

export function DashboardShell({ account, activePath, config, page }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <Link href={config.homeHref} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-sidebar-foreground">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-orange text-white">
              <GraduationCapIcon aria-hidden="true" />
            </span>
            <span className="truncate group-data-[collapsible=icon]:hidden">ÖzelDersEvim</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{config.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {config.navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={item.href === activePath}
                        render={<Link href={item.href} />}
                      >
                        <Icon aria-hidden="true" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <div className="grid gap-1 rounded-lg px-2 py-1 text-xs group-data-[collapsible=icon]:hidden">
            <span className="truncate font-medium text-sidebar-foreground">{account.fullName}</span>
            <span className="truncate text-sidebar-foreground/70">{account.email}</span>
          </div>
          <LogoutButton />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-slate-50">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-white px-4">
          <SidebarTrigger />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-brand-navy">{page.eyebrow}</p>
            <p className="truncate text-xs text-muted-foreground">{config.label}</p>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <section className="mx-auto flex max-w-5xl flex-col gap-5">
            <Card>
              <CardHeader>
                <CardDescription>{page.eyebrow}</CardDescription>
                <CardTitle className="text-2xl text-brand-navy">{page.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{page.description}</p>
                {page.ctaHref && page.ctaLabel ? (
                  <Button className="w-fit bg-brand-orange text-white hover:bg-brand-orange/90" nativeButton={false} render={<Link href={page.ctaHref} />}>
                    {page.ctaLabel}
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
