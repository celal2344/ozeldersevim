import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-white/65 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© 2026 Özel Ders Evim. Tüm hakları saklıdır.</p>
        <nav className="flex flex-wrap gap-4">
          <Link href="/kullanim-kosullari" className="hover:text-white">
            Kullanım Koşulları
          </Link>
          <Link href="/gizlilik-politikasi" className="hover:text-white">
            Gizlilik Politikası
          </Link>
          <Link href="/kvkk-aydinlatma-metni" className="hover:text-white">
            KVKK Aydınlatma Metni
          </Link>
        </nav>
      </div>
    </footer>
  );
}
