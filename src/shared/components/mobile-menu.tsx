"use client";

import Link from "next/link";
import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";

import { siteConfig } from "@/features/seo/site";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        onClick={() => setOpen((v) => !v)}
        className="flex size-9 items-center justify-center rounded-lg text-white/80 hover:text-white md:hidden"
      >
        {open ? <XIcon className="size-5" aria-hidden="true" /> : <MenuIcon className="size-5" aria-hidden="true" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-16 z-50 border-t border-white/10 bg-brand-navy px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-white/10 pt-2 flex flex-col gap-2">
              <Link
                href="/giris"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
              >
                Giriş Yap
              </Link>
              <Link
                href="/kayit"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-brand-orange px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-brand-orange/90"
              >
                Kayıt Ol
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
