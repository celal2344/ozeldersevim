import Link from "next/link";
import { GraduationCapIcon, LogInIcon, UserPlusIcon } from "lucide-react";

import { siteConfig } from "@/features/seo/site";
import { Button } from "@/shared/components/ui/button";

export function PublicHeader() {
  return (
    <header className="border-b bg-background/95">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCapIcon aria-hidden="true" />
          </span>
          <span>Özel Ders Evim</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {siteConfig.navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" nativeButton={false} render={<Link href="/giris" />}>
            <LogInIcon data-icon="inline-start" aria-hidden="true" />
            Giriş Yap
          </Button>
          <Button nativeButton={false} render={<Link href="/kayit" />}>
            <UserPlusIcon data-icon="inline-start" aria-hidden="true" />
            Kayıt Ol
          </Button>
        </div>
      </div>
    </header>
  );
}
