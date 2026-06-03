import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-semibold">
              ÖzelDers<span className="text-brand-orange">Evim</span>
            </p>
            <p className="mt-1 text-sm text-white/55">
              Türkiye&apos;nin özel ders platformu.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm text-white/65 sm:grid-cols-3">
            <Link href="/ogretmen-bul" className="hover:text-white">Öğretmen Bul</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <Link href="/sss" className="hover:text-white">SSS</Link>
            <Link href="/iletisim" className="hover:text-white">İletişim</Link>
            <Link href="/ogretmen-ol" className="hover:text-white">Öğretmen Ol</Link>
            <Link href="/kayit" className="hover:text-white">Kayıt Ol</Link>
          </div>
          <div className="flex flex-col gap-1 text-sm text-white/55">
            <Link href="/gizlilik-politikasi" className="hover:text-white">Gizlilik Politikası</Link>
            <Link href="/kullanim-kosullari" className="hover:text-white">Kullanım Koşulları</Link>
            <Link href="/kvkk-aydinlatma-metni" className="hover:text-white">KVKK</Link>
          </div>
        </div>
        <div className="mt-6 border-t border-white/10 pt-4 text-xs text-white/40">
          © 2026 Özel Ders Evim. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
