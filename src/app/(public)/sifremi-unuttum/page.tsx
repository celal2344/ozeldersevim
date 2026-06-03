"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? "Bir hata oluştu.");
      return;
    }

    setDone(true);
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-2xl font-bold text-brand-navy">Şifreni Sıfırla</p>
          <p className="mt-2 text-sm text-muted-foreground">
            E-posta adresini gir, sıfırlama bağlantısı gönderelim.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          {done ? (
            <div className="flex flex-col gap-4 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-green-100 mx-auto">
                <span className="text-2xl">✉️</span>
              </div>
              <p className="font-medium text-brand-navy">Email gönderildi!</p>
              <p className="text-sm text-muted-foreground">
                <strong>{email}</strong> adresine şifre sıfırlama bağlantısı gönderdik.
                Spam kutunu da kontrol et.
              </p>
              <Link href="/giris" className="text-sm font-medium text-brand-orange hover:underline">
                Giriş sayfasına dön
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-brand-navy" htmlFor="email">
                  E-posta adresin
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="h-11 bg-white"
                  required
                  autoComplete="email"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-brand-orange text-white hover:bg-brand-orange/90"
              >
                {loading ? "Gönderiliyor…" : "Sıfırlama Bağlantısı Gönder"}
              </Button>
              <Link href="/giris" className="text-center text-sm text-muted-foreground hover:text-brand-orange">
                ← Giriş sayfasına dön
              </Link>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
