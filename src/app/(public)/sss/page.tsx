import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular | ÖzelDersEvim",
  description: "ÖzelDersEvim hakkında merak edilen sorular ve cevapları.",
};

const faqItems = [
  {
    category: "Genel",
    color: "from-brand-orange to-orange-400",
    questions: [
      { q: "ÖzelDersEvim nedir?", a: "ÖzelDersEvim, öğrencilerin özel ders öğretmenlerini bulmasını ve ders taleplerini kolayca göndermesini sağlayan Türkiye'ye özgü bir platformdur." },
      { q: "Platform kullanımı ücretsiz mi?", a: "Evet. Kayıt olmak, öğretmen aramak ve ders talebi göndermek tamamen ücretsizdir. Platform herhangi bir komisyon almaz; ödeme öğrenci ile öğretmen arasında doğrudan gerçekleşir." },
      { q: "Ücretler nasıl belirleniyor?", a: "Saatlik ücretleri her öğretmen kendisi belirler. Arama sayfasında fiyat filtresi kullanarak bütçenize uygun öğretmenleri bulabilirsiniz." },
      { q: "Hangi dersler için öğretmen bulabilirim?", a: "Matematik, Fizik, Kimya, Biyoloji, İngilizce, Türkçe, Yazılım, LGS ve TYT/AYT hazırlığı başta olmak üzere pek çok ders kategorisinde öğretmen bulabilirsiniz." },
    ],
  },
  {
    category: "Öğrenciler İçin",
    color: "from-violet-500 to-purple-600",
    questions: [
      { q: "Nasıl ders talebi gönderebilirim?", a: "Önce ücretsiz öğrenci hesabı oluşturun. Bir öğretmenin profilinden 'Hızlı Talep Oluştur' veya 'Ders Talep Et' butonuna tıklayın ve formu doldurun. Öğretmen talebinizi inceleyip kabul ya da reddeder." },
      { q: "Öğretmen talebimi kabul edince ne olur?", a: "Öğretmen talebinizi kabul ettiğinde iletişim bilgileriniz öğretmenle paylaşılır ve öğretmen sizinle doğrudan iletişime geçer." },
      { q: "Birden fazla öğretmene talep gönderebilir miyim?", a: "Evet, farklı öğretmenlere ayrı ayrı ders talebi gönderebilirsiniz." },
      { q: "Öğretmenlerin yorumlarına güvenebilir miyim?", a: "Tüm yorumlar yalnızca ders talebi kabul edilmiş öğrenciler tarafından yazılabilmektedir. Bu sayede sahte yorum riski en aza indirilir." },
    ],
  },
  {
    category: "Öğretmenler İçin",
    color: "from-emerald-500 to-teal-600",
    questions: [
      { q: "Öğretmen olarak nasıl kayıt olabilirim?", a: "Kayıt Ol sayfasından 'Öğretmen Hesabı Aç' seçeneğini seçin ve formu doldurun. Hesabınız oluşturulduktan sonra ilan oluşturma adımına geçebilirsiniz." },
      { q: "İlan oluşturmak için öğretmenlik testi şart mı?", a: "Evet. İlan yayınlayabilmek için kısa bir uygunluk testini geçmeniz gerekir. Hesabı açmak için test gerekmez; yalnızca ilan yayınlama adımında uygulanır." },
      { q: "Platform komisyon alıyor mu?", a: "Hayır. ÖzelDersEvim herhangi bir komisyon almaz. Ücretlendirme tamamen öğrenci ile öğretmen arasında gerçekleşir." },
      { q: "Online ders verebilir miyim?", a: "Evet. İlanınızda 'Online', 'Yüz Yüze' ya da her ikisini birden seçebilirsiniz. Platform video görüşme aracı sağlamaz; Zoom veya Meet gibi araçları kendiniz kullanabilirsiniz." },
    ],
  },
  {
    category: "Gizlilik ve Güvenlik",
    color: "from-blue-500 to-cyan-600",
    questions: [
      { q: "İletişim bilgilerim güvende mi?", a: "Öğrencinin telefon ve e-posta bilgileri yalnızca öğretmen ders talebini kabul ettikten sonra öğretmenle paylaşılır. Talep reddedilirse veya beklemedeyse bu bilgiler öğretmene görünmez." },
      { q: "Hesabımı nasıl silebilirim?", a: "Hesap silme taleplerini destek@ozeldersevim.com adresine e-posta göndererek iletebilirsiniz. Talebiniz en geç 7 iş günü içinde işleme alınır." },
    ],
  },
];

export default function SSSPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0f1e] px-4 py-20 text-white sm:px-6">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(251,115,22,0.2),transparent)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Yardım Merkezi</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Sık Sorulan Sorular</h1>
          <p className="mt-4 text-white/55">Platformumuzla ilgili merak ettiğiniz her şey burada.</p>
        </div>
      </section>

      {/* İçerik */}
      <section
        className="px-4 py-16 sm:px-6"
        style={{ background: "linear-gradient(180deg, #f8f9fe 0%, #f0f4ff 100%)" }}
      >
        <div className="mx-auto max-w-3xl flex flex-col gap-12">
          {faqItems.map((section) => (
            <div key={section.category}>
              {/* Kategori başlığı */}
              <div className="mb-6 flex items-center gap-3">
                <div className={`h-8 w-1.5 rounded-full bg-gradient-to-b ${section.color}`} />
                <h2 className="text-xl font-bold text-brand-navy">{section.category}</h2>
              </div>

              {/* Sorular */}
              <div className="flex flex-col gap-3">
                {section.questions.map((item, i) => (
                  <div
                    key={item.q}
                    className="group rounded-2xl border border-white bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-4">
                      <span className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${section.color} text-xs font-bold text-white`}>
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-brand-navy">{item.q}</p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mx-auto mt-16 max-w-3xl">
          <div className="relative overflow-hidden rounded-2xl bg-[#0a0f1e] p-8 text-center text-white">
            <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,rgba(251,115,22,0.2),transparent)]" />
            <div className="relative">
              <p className="text-lg font-bold">Sorunuzun cevabını bulamadınız mı?</p>
              <p className="mt-2 text-sm text-white/50">İletişim sayfamızdan bize ulaşabilirsiniz.</p>
              <Link
                href="/iletisim"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-orange px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition-all hover:bg-orange-400 hover:scale-[1.02]"
              >
                İletişime Geç <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
