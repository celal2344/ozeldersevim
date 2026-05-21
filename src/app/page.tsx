import Link from "next/link";

import { Button } from "@/shared/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 py-16 text-center">
      <div className="flex max-w-2xl flex-col items-center gap-4">
        <p className="text-sm font-medium text-muted-foreground">
          Özel Ders Evim MVP
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Öğretmen arama ve ders talebi altyapısı hazırlanıyor.
        </h1>
        <p className="max-w-xl text-base leading-7 text-muted-foreground">
          Bu branch temel Next.js, shadcn/ui, Supabase, TanStack Query ve
          feature-based mimari kurulumunu sağlar.
        </p>
      </div>
      <Button nativeButton={false} render={<Link href="/ogretmen-bul" />}>
        Öğretmen Bul
      </Button>
    </main>
  );
}
