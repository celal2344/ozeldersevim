import { kvkkMetadata } from "@/features/seo/constants";

export { kvkkMetadata as metadata };

export default function KvkkPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col gap-4 px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">KVKK AydÄ±nlatma Metni</h1>
      <p className="leading-7 text-muted-foreground">
        Bu sayfa MVP iÃ§in yer tutucu metindir. Ad, soyad, telefon, email, konum
        ve ders ihtiyacÄ± verileri iÃ§in nihai KVKK aydÄ±nlatmasÄ± hazÄ±rlanmalÄ±dÄ±r.
      </p>
    </main>
  );
}
