import Link from "next/link";
import { GraduationCapIcon } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-brand-navy">
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-orange text-white shadow-sm">
              <GraduationCapIcon aria-hidden="true" />
            </span>
            <span className="text-lg">
              ÖzelDers<span className="text-brand-orange">Evim</span>
            </span>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-md px-4 py-12 sm:px-6">{children}</main>
    </div>
  );
}
