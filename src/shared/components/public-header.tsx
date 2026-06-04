import { GraduationCapIcon, LogInIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { siteConfig } from "@/features/seo/site";
import { MobileMenu } from "@/shared/components/mobile-menu";
import { Button } from "@/shared/components/ui/button";

export function PublicHeader({ actions }: { actions?: ReactNode }) {
  return (
    <header className="relative border-b border-white/10 bg-brand-navy text-white">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-10 items-center justify-center rounded-lg bg-brand-orange text-white shadow-sm">
            <GraduationCapIcon aria-hidden="true" />
          </span>
          <span className="text-xl">
            ÖzelDers<span className="text-brand-orange">Evim</span>
          </span>
        </Link>
        <nav className="hidden h-full items-center gap-7 text-sm font-medium text-white/75 md:flex">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex h-full items-center border-b-2 border-transparent hover:border-brand-orange hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {actions ?? (
            <>
              <Button
                variant="outline"
                className="hidden border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white sm:inline-flex"
                nativeButton={false}
                render={<Link href="/giris" />}
              >
                <LogInIcon data-icon="inline-start" aria-hidden="true" />
                Giriş Yap
              </Button>
              <Button className="hidden bg-brand-orange text-white hover:bg-brand-orange/90 md:inline-flex" nativeButton={false} render={<Link href="/kayit" />}>
                <UserPlusIcon data-icon="inline-start" aria-hidden="true" />
                Kayıt Ol
              </Button>
            </>
          )}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
