"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { PremiumSelect } from "@/shared/components/ui/premium-select";

type DeliveryMode = "online" | "face_to_face" | "both";

type TeacherProfileFormProps = {
  defaultValues: {
    title: string;
    bio: string;
    education: string;
    experienceYears: number;
    hourlyPrice: number;
    deliveryMode: DeliveryMode;
  };
};

const deliveryModeOptions: { value: DeliveryMode; label: string }[] = [
  { value: "online", label: "Online" },
  { value: "face_to_face", label: "Yüz yüze" },
  { value: "both", label: "Online ve yüz yüze" },
];

export function TeacherProfileForm({ defaultValues }: TeacherProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState(defaultValues);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    const res = await fetch("/api/teacher-profiles/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: values.title || undefined,
        bio: values.bio || undefined,
        education: values.education || undefined,
        experienceYears: values.experienceYears || undefined,
        hourlyPrice: values.hourlyPrice,
        deliveryMode: values.deliveryMode,
      }),
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
        <label className="text-sm font-medium text-foreground" htmlFor="title">Profil Başlığı</label>
        <Input
          id="title"
          placeholder="örn. Matematik ve Fizik Öğretmeni"
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          maxLength={200}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground" htmlFor="bio">Hakkımda</label>
        <textarea
          id="bio"
          placeholder="Kendinizi ve ders verme tarzınızı tanıtın..."
          value={values.bio}
          onChange={(e) => update("bio", e.target.value)}
          maxLength={2000}
          rows={5}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground" htmlFor="education">Eğitim</label>
        <Input
          id="education"
          placeholder="örn. ODTÜ Matematik Bölümü"
          value={values.education}
          onChange={(e) => update("education", e.target.value)}
          maxLength={300}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground" htmlFor="experienceYears">Deneyim (yıl)</label>
          <Input
            id="experienceYears"
            type="number"
            min={0}
            max={60}
            value={values.experienceYears}
            onChange={(e) => update("experienceYears", Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground" htmlFor="hourlyPrice">Saatlik Ücret (₺)</label>
          <Input
            id="hourlyPrice"
            type="number"
            min={0}
            step={10}
            value={values.hourlyPrice}
            onChange={(e) => update("hourlyPrice", Number(e.target.value))}
            required
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Ders Türü</label>
        <PremiumSelect
          value={values.deliveryMode}
          onChange={(v) => update("deliveryMode", v as DeliveryMode)}
          options={deliveryModeOptions}
        />
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
