import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular | ÖzelDersEvim",
  description: "ÖzelDersEvim hakkında merak edilen sorular ve cevapları.",
};

const faqItems = [
  {
    category: "Genel",
    questions: [
      {
        q: "ÖzelDersEvim nedir?",
        a: "ÖzelDersEvim, öğrencilerin uygun özel ders öğretmenlerini bulmasını ve ders taleplerini kolayca göndermesini sağlayan Türkiye'ye özgü bir özel ders platformudur.",
      },
      {
        q: "Platform kullanımı ücretsiz mi?",
        a: "Evet. Platforma kayıt olmak, öğretmen aramak ve ders talebi göndermek tamamen ücretsizdir. Ödeme, öğrenci ile öğretmen arasında doğrudan gerçekleşir; platform herhangi bir komisyon almaz.",
      },
      {
        q: "Hangi dersler için öğretmen bulabilirim?",
        a: "Matematik, Fizik, Kimya, Biyoloji, İngilizce, Türkçe, Yazılım, LGS hazırlık, TYT/AYT hazırlığı başta olmak üzere yüzlerce farklı ders kategorisinde öğretmen bulabilirsiniz.",
      },
    ],
  },
  {
    category: "Öğrenciler İçin",
    questions: [
      {
        q: "Nasıl ders talebi gönderebilirim?",
        a: "Önce ücretsiz öğrenci hesabı oluşturun. Ardından bir öğretmenin profilinden 'Ders Talep Et' butonuna tıklayın ve talep formunu doldurun. Öğretmen talebinizi inceleyip kabul ya da reddeder.",
      },
      {
        q: "Öğretmen talebimi kabul edince ne olur?",
        a: "Öğretmen talebinizi kabul ettiğinde iletişim bilgileriniz öğretmenle paylaşılır. Bu noktadan sonra ders programınızı doğrudan öğretmeninizle planlayabilirsiniz.",
      },
      {
        q: "Birden fazla öğretmene talep gönderebilir miyim?",
        a: "Evet, farklı öğretmenlere ayrı ayrı ders talebi gönderebilirsiniz.",
      },
      {
        q: "Öğretmenlerin yorumlarına güvenebilir miyim?",
        a: "Tüm yorumlar yalnızca ders talebi kabul edilmiş öğrenciler tarafından yazılabilmektedir. Bu sayede sahte yorum riski en aza indirilir.",
      },
    ],
  },
  {
    category: "Öğretmenler İçin",
    questions: [
      {
        q: "Öğretmen olarak nasıl kayıt olabilirim?",
        a: "Kayıt Ol sayfasından 'Öğretmen Hesabı Aç' seçeneğini seçin ve formu doldurun. Hesabınız oluşturulduktan sonra ilan oluşturma adımına geçebilirsiniz.",
      },
      {
        q: "İlan oluşturmak için öğretmenlik testi şart mı?",
        a: "Evet. İlan oluşturabilmek için kısa bir öğretmenlik uygunluk testini geçmeniz gerekir. Hesabı açmak için test gerekmez; sadece ilan yayınlama adımında sorulur.",
      },
      {
        q: "Platform benden komisyon alıyor mu?",
        a: "Hayır. ÖzelDersEvim herhangi bir komisyon almaz. Ücretlendirme tamamen öğrenci ile öğretmen arasında gerçekleşir.",
      },
      {
        q: "Online ders verebilir miyim?",
        a: "Evet. İlanınızda 'Online', 'Yüz Yüze' ya da her ikisini birden seçebilirsiniz. Online dersler için platform bir video görüşme aracı sağlamaz; Zoom, Meet gibi araçları kendiniz kullanabilirsiniz.",
      },
    ],
  },
  {
    category: "Gizlilik ve Güvenlik",
    questions: [
      {
        q: "İletişim bilgilerim güvende mi?",
        a: "Öğrencinin telefon ve e-posta bilgileri yalnızca öğretmen ders talebini kabul ettikten sonra öğretmenle paylaşılır. Talep reddedilirse veya beklemedeyse bilgileriniz öğretmene görünmez.",
      },
      {
        q: "Hesabımı nasıl silebilirim?",
        a: "Hesap silme taleplerini iletisim@ozeldersevim.com adresine e-posta göndererek iletebilirsiniz. Talebiniz en geç 7 iş günü içinde işleme alınır.",
      },
    ],
  },
];

export default function SSSSayfasi() {
  return (
    <main className="bg-slate-50">
      <section className="bg-brand-navy px-4 py-14 text-white sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold">Sık Sorulan Sorular</h1>
          <p className="mt-4 text-white/72">
            Platformumuzla ilgili merak ettiğiniz her şey burada.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10">
          {faqItems.map((section) => (
            <div key={section.category}>
              <h2 className="mb-4 text-lg font-bold text-brand-navy">{section.category}</h2>
              <div className="flex flex-col gap-4">
                {section.questions.map((item) => (
                  <div key={item.q} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="font-semibold text-brand-navy">{item.q}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-brand-navy p-8 text-center text-white">
          <p className="text-lg font-semibold">Sorunuzun cevabını bulamadınız mı?</p>
          <p className="mt-2 text-sm text-white/72">İletişim sayfamızdan bize ulaşabilirsiniz.</p>
          <Button
            className="mt-4 bg-brand-orange text-white hover:bg-brand-orange/90"
            nativeButton={false}
            render={<Link href="/iletisim" />}
          >
            İletişime Geç
          </Button>
        </div>
      </section>
    </main>
  );
}
