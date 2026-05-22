import { termsMetadata } from "@/features/seo/constants";

export { termsMetadata as metadata };

export default function TermsPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col gap-4 px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">KullanÄ±m KoÅŸullarÄ±</h1>
      <p className="leading-7 text-muted-foreground">
        Bu sayfa MVP iÃ§in yer tutucu metindir. Ã–ÄŸretmen ilanÄ±, ders talebi,
        yorumlar ve iletiÅŸim paylaÅŸÄ±mÄ± kurallarÄ± yayÄ±na Ã§Ä±kmadan Ã¶nce nihai
        koÅŸullara baÄŸlanmalÄ±dÄ±r.
      </p>
    </main>
  );
}
