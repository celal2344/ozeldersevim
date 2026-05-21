import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
};

export default function TermsPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col gap-4 px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Kullanım Koşulları</h1>
      <p className="leading-7 text-muted-foreground">
        Bu sayfa MVP için yer tutucu metindir. Öğretmen ilanı, ders talebi,
        yorumlar ve iletişim paylaşımı kuralları yayına çıkmadan önce nihai
        koşullara bağlanmalıdır.
      </p>
    </main>
  );
}
