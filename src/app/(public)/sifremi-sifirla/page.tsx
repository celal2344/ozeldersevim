"use client";

import Link from "next/link";
import { useState } from "react";

import { createSupabaseBrowserClient } from "@/shared/db/supabase/browser";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır.");
      return;
    }

    if (password !== confirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setDone(true);
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-2xl font-bold text-brand-navy">Yeni Şifre Belirle</p>
          <p className="mt-2 text-sm text-muted-foreground">
            E-postanızdaki linkten geldiyseniz yeni şifrenizi girebilirsiniz.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          {done ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="text-4xl">✅</span>
              <p className="font-medium text-brand-navy">Şifreniz başarıyla güncellendi!</p>
              <Link href="/giris" className="mt-2 text-sm font-medium text-brand-orange hover:underline">
                Giriş sayfasına git
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
                <label className="text-sm font-medium text-brand-navy" htmlFor="password">
                  Yeni şifre
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 8 karakter"
                  className="h-11 bg-white"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-brand-navy" htmlFor="confirm">
                  Şifre tekrar
                </label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Şifreyi tekrar girin"
                  className="h-11 bg-white"
                  required
                  autoComplete="new-password"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-brand-orange text-white hover:bg-brand-orange/90"
              >
                {loading ? "Kaydediliyor…" : "Şifremi Güncelle"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
