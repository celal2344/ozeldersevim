"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

type AccountProfileFormProps = {
  defaultValues: {
    fullName: string;
    phone: string;
    email: string | null;
  };
};

export function AccountProfileForm({ defaultValues }: AccountProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fullName, setFullName] = useState(defaultValues.fullName);
  const [phone, setPhone] = useState(defaultValues.phone ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    const res = await fetch("/api/profiles/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, phone }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? "Kaydedilemedi.");
      return;
    }

    setSaved(true);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground" htmlFor="fullName">Ad Soyad</label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => { setFullName(e.target.value); setSaved(false); }}
          required
          minLength={2}
          maxLength={120}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground" htmlFor="phone">Telefon</label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setSaved(false); }}
          required
          minLength={10}
          maxLength={30}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-muted-foreground" htmlFor="email">E-posta (değiştirilemez)</label>
        <Input id="email" value={defaultValues.email ?? ""} disabled />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && <p className="text-sm font-medium text-green-700">Değişiklikler kaydedildi.</p>}
      <Button
        type="submit"
        disabled={isPending}
        className="w-fit bg-brand-orange text-white hover:bg-brand-orange/90"
      >
        Kaydet
      </Button>
    </form>
  );
}
