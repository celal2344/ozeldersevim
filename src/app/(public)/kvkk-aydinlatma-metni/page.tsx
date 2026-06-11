import { kvkkMetadata } from "@/features/seo/constants";

export { kvkkMetadata as metadata };

export default function KvkkPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy">KVKK Aydınlatma Metni</h1>
      <p className="mt-2 text-sm text-muted-foreground">Son güncelleme: Haziran 2026</p>
      <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
        Bu metin kişisel veri işleme akışlarını açıklayan taslak aydınlatma metnidir. Yayın öncesinde hukuk danışmanı
        tarafından onaylanmalıdır.
      </p>

      <div className="mt-8 flex flex-col gap-8 text-sm leading-7 text-foreground/80">
        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">1. Veri Sorumlusu</h2>
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca veri sorumlusu sıfatıyla
            ÖzelDersEvim tarafından hazırlanmış bu aydınlatma metni, kişisel verilerinizin nasıl
            işlendiğini açıklamaktadır. İletişim: kvkk@ozeldersevim.com
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">2. İşlenen Kişisel Veriler</h2>
          <div className="overflow-x-auto">
            <table className="mt-2 w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold">Veri Kategorisi</th>
                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold">Veri Türleri</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Kimlik", "Ad, soyad"],
                  ["İletişim", "E-posta adresi, telefon numarası"],
                  ["Konum", "Şehir, ilçe (ders talebi veya ilan için)"],
                  ["Eğitim / Mesleki", "Öğretmenin eğitim geçmişi, deneyim yılı (öğretmen ilanı)"],
                  ["İşlem Güvenliği", "Oturum bilgileri, IP adresi"],
                  ["Kullanım", "Arama geçmişi, profil görüntüleme, talep geçmişi"],
                ].map(([cat, types]) => (
                  <tr key={cat}>
                    <td className="border border-slate-200 px-3 py-2 font-medium">{cat}</td>
                    <td className="border border-slate-200 px-3 py-2 text-muted-foreground">{types}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">3. İşleme Amaçları ve Hukuki Sebepleri</h2>
          <ul className="list-inside list-disc space-y-1">
            <li><strong>Sözleşmenin ifası (KVKK m.5/2-c):</strong> Üyelik, ilan ve ders talebi hizmetinin sunulması</li>
            <li><strong>Meşru menfaat (KVKK m.5/2-f):</strong> Güvenlik, doğrulama ve platform analizi</li>
            <li><strong>Açık rıza (KVKK m.5/1):</strong> Tercihlerinize göre önerilerin sunulması</li>
            <li><strong>Hukuki yükümlülük (KVKK m.5/2-ç):</strong> Yasal zorunlulukların yerine getirilmesi</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">4. Kimlere Aktarılıyor</h2>
          <ul className="list-inside list-disc space-y-1">
            <li><strong>Öğretmene:</strong> Öğrencinin iletişim bilgileri yalnızca ders talebi kabul edildikten sonra</li>
            <li><strong>Altyapı sağlayıcılarına:</strong> Hizmet sunumu kapsamında Supabase (veri tabanı) ve Vercel (barındırma)</li>
            <li><strong>Üçüncü taraf pazarlama:</strong> Kesinlikle paylaşılmaz</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">5. Saklama Süresi</h2>
          <p>
            Kişisel verileriniz hesap aktif olduğu sürece saklanır. Hesap kapatma talebinden itibaren 30 gün
            içinde silinir. Yasal zorunluluk halinde mevzuatta belirtilen süre kadar saklanabilir.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-brand-navy">6. KVKK Kapsamındaki Haklarınız</h2>
          <p>KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
            <li>Kişisel verilerin işlenme amacını öğrenme ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Yurt içi veya yurt dışında aktarıldığı üçüncü kişileri öğrenme</li>
            <li>Eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
            <li>KVKK ve ilgili mevzuat uyarınca silinmesini ya da yok edilmesini isteme</li>
            <li>Münhasıran otomatik sistemler ile analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
            <li>Kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
          </ul>
          <p className="mt-3">
            Başvurularınızı <strong>kvkk@ozeldersevim.com</strong> adresine iletebilirsiniz. Başvurular 30 gün
            içinde yanıtlanır.
          </p>
        </section>
      </div>
    </main>
  );
}
