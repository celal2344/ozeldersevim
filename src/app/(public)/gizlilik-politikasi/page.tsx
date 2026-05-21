import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col gap-4 px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Gizlilik Politikası</h1>
      <p className="leading-7 text-muted-foreground">
        Bu sayfa MVP için yer tutucu metindir. Ders talebi, hesap oluşturma ve
        öğretmen başvuru akışlarında toplanan kişisel veriler için nihai metin
        yayına çıkmadan önce hukuk danışmanı ile tamamlanmalıdır.
      </p>
    </main>
  );
}
