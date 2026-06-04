import { termsMetadata } from "@/features/seo/constants";

export { termsMetadata as metadata };

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy">Kullanım Koşulları</h1>
      <p className="mt-2 text-sm text-muted-foreground">Son güncelleme: Haziran 2026</p>

      <div className="mt-8 flex flex-col gap-8 text-sm leading-7 text-foreground/80">
        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">1. Hizmet Tanımı</h2>
          <p>
            ÖzelDersEvim, öğrencilerin özel ders öğretmenlerini bulmasını ve ders talebi göndermesini sağlayan
            bir aracı platformdur. Platform, öğrenci ile öğretmen arasında herhangi bir ücret tahsil etmez ve
            ders sürecinin içinde yer almaz.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">2. Hesap Oluşturma</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Kayıt için en az 18 yaşında olmanız veya ebeveyn onayı bulunması gerekir.</li>
            <li>Doğru ve güncel bilgi sağlamakla yükümlüsünüz.</li>
            <li>Hesap güvenliğinden siz sorumlusunuzdur; şifrenizi kimseyle paylaşmayınız.</li>
            <li>Her kişi yalnızca bir hesap oluşturabilir.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">3. Öğretmen İlanı Kuralları</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>İlan oluşturmak için öğretmenlik uygunluk testini geçmek zorunludur.</li>
            <li>İlan bilgileri gerçek ve güncel olmalıdır; yanıltıcı içerik yasaktır.</li>
            <li>Platform, uygunsuz ilanları bildirimsiz kaldırma hakkını saklı tutar.</li>
            <li>Her öğretmen yalnızca bir ilan oluşturabilir.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">4. Ders Talebi Kuralları</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Ders talebi yalnızca kayıtlı öğrenci hesaplarıyla gönderilebilir.</li>
            <li>Talep formunda gerçek iletişim bilgileri girilmesi zorunludur.</li>
            <li>Öğretmen talebi kabul ettiğinde öğrencinin iletişim bilgileri paylaşılır.</li>
            <li>Spam amaçlı toplu talep gönderimi yasaktır.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">5. Yorum Kuralları</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Yorum yalnızca talebi kabul edilmiş öğrenciler tarafından yazılabilir.</li>
            <li>Hakaret veya iftira içeren yorumlar kaldırılır; hesap askıya alınabilir.</li>
            <li>Gerçeğe dayanmayan sahte yorum oluşturmak yasaktır.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">6. Yasaklı Davranışlar</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Platform altyapısına zarar verecek her türlü teknik saldırı</li>
            <li>Başkasına ait hesabı kullanmak veya hesap bilgilerini paylaşmak</li>
            <li>Platform üzerinden ticari reklam ya da spam içerik yaymak</li>
            <li>Diğer kullanıcıları taciz etmek veya kandırmak</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">7. Sorumluluk Sınırlaması</h2>
          <p>
            ÖzelDersEvim yalnızca aracı platformdur. Öğretmen ile öğrenci arasındaki ders ilişkisinden,
            ödeme anlaşmazlıklarından veya ders kalitesinden platformun doğrudan sorumluluğu bulunmamaktadır.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">8. Değişiklikler</h2>
          <p>
            Bu koşullar zaman zaman güncellenebilir. Devam eden kullanım, güncel koşulları kabul ettiğiniz
            anlamına gelir.
          </p>
        </section>
      </div>
    </main>
  );
}
