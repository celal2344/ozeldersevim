import { privacyMetadata } from "@/features/seo/constants";

export { privacyMetadata as metadata };

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy">Gizlilik Politikası</h1>
      <p className="mt-2 text-sm text-muted-foreground">Son güncelleme: Haziran 2026</p>

      <div className="mt-8 flex flex-col gap-8 text-sm leading-7 text-foreground/80">
        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">1. Veri Sorumlusu</h2>
          <p>
            ÖzelDersEvim ("Platform"), kişisel verilerinizi 6698 sayılı KVKK kapsamında veri sorumlusu sıfatıyla
            işlemektedir. İletişim: kvkk@ozeldersevim.com
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">2. Toplanan Veriler</h2>
          <ul className="list-inside list-disc space-y-1">
            <li><strong>Hesap bilgileri:</strong> Ad soyad, e-posta, telefon, hesap rolü</li>
            <li><strong>Ders talebi:</strong> Ders türü, konum, seviye, hedef, bütçe</li>
            <li><strong>Öğretmen ilanı:</strong> Eğitim, deneyim, ücret, konum, ders türü</li>
            <li><strong>Kullanım verileri:</strong> Arama, görüntüleme ve talep gönderme davranışları</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">3. İşleme Amaçları</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Öğrenci-öğretmen eşleşmesi ve ders talebi sürecinin yürütülmesi</li>
            <li>Hesap doğrulama ve güvenliğin sağlanması</li>
            <li>Platform hizmetinin iyileştirilmesi</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">4. İletişim Bilgilerinin Paylaşımı</h2>
          <p>
            Öğrencinin telefon, e-posta ve ad-soyad bilgileri <strong>yalnızca</strong> öğretmen ders talebini kabul
            ettiğinde ilgili öğretmenle paylaşılır. Talep beklemedeyken veya reddedildiğinde bu bilgiler öğretmene
            görünmez. Platform, kişisel verileri üçüncü taraf pazarlama amacıyla kesinlikle paylaşmaz.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">5. Saklama Süresi</h2>
          <p>
            Veriler hesap aktif olduğu sürece ve hesap kapatma talebinden itibaren 30 gün boyunca tutulur.
            Yasal zorunluluk halinde mevzuatta öngörülen süre boyunca saklanabilir.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">6. Haklarınız (KVKK m. 11)</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenen verilerinize ilişkin bilgi talep etme</li>
            <li>Yanlış verilerin düzeltilmesini isteme</li>
            <li>Koşullar dahilinde verilerin silinmesini talep etme</li>
            <li>İşlemeye itiraz etme</li>
          </ul>
          <p className="mt-2">Talepleriniz için: <strong>kvkk@ozeldersevim.com</strong></p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">7. Güvenlik</h2>
          <p>
            Verileriniz şifreli bağlantı (TLS) ve güvenli veritabanı altyapısı üzerinde saklanmaktadır.
            Yetkisiz erişimi önlemek için endüstri standardı önlemler uygulanmaktadır.
          </p>
        </section>
      </div>
    </main>
  );
}
