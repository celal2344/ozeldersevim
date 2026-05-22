import { privacyMetadata } from "@/features/seo/constants";

export { privacyMetadata as metadata };

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col gap-4 px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Gizlilik PolitikasÄ±</h1>
      <p className="leading-7 text-muted-foreground">
        Bu sayfa MVP iÃ§in yer tutucu metindir. Ders talebi, hesap oluÅŸturma ve
        Ã¶ÄŸretmen baÅŸvuru akÄ±ÅŸlarÄ±nda toplanan kiÅŸisel veriler iÃ§in nihai metin
        yayÄ±na Ã§Ä±kmadan Ã¶nce hukuk danÄ±ÅŸmanÄ± ile tamamlanmalÄ±dÄ±r.
      </p>
    </main>
  );
}
