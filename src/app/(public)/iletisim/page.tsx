import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, ClockIcon, FileTextIcon, MailIcon, MessageCircleIcon, ZapIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "İletişim | ÖzelDersEvim",
  description: "ÖzelDersEvim ile iletişime geçin.",
};

const channels = [
  { icon: MailIcon, title: "Genel Destek", description: "Sorular ve destek talepleri", value: "destek@ozeldersevim.com", href: "mailto:destek@ozeldersevim.com", cta: "E-posta Gönder", color: "from-brand-orange to-orange-500", isLink: false },
  { icon: FileTextIcon, title: "Sık Sorulan Sorular", description: "Cevabınızı hızlıca bulun", value: "SSS sayfasını incele", href: "/sss", cta: "SSS'e Git", color: "from-violet-500 to-purple-600", isLink: true },
  { icon: MessageCircleIcon, title: "Gizlilik & KVKK", description: "Kişisel veri talepleri", value: "kvkk@ozeldersevim.com", href: "mailto:kvkk@ozeldersevim.com", cta: "E-posta Gönder", color: "from-emerald-500 to-teal-600", isLink: false },
];

export default function IletisimPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-[#0a0f1e] px-4 py-20 text-white sm:px-6">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(251,115,22,0.2),transparent)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Bize Ulaşın</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">İletişim</h1>
          <p className="mt-4 text-white/55">Sorularınız ve önerileriniz için buradayız.</p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6" style={{ background: "linear-gradient(180deg, #f8f9fe 0%, #f0f4ff 100%)" }}>
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-5 sm:grid-cols-3">
            {channels.map((ch) => {
              const Icon = ch.icon;
              return (
                <div key={ch.title} className="group flex flex-col overflow-hidden rounded-2xl border border-white bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/60">
                  <div className={`h-1.5 w-full bg-gradient-to-r ${ch.color}`} />
                  <div className="flex flex-1 flex-col p-6">
                    <div className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${ch.color} shadow-lg`}>
                      <Icon className="size-5 text-white" aria-hidden="true" />
                    </div>
                    <h2 className="mt-4 font-bold text-brand-navy">{ch.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">{ch.description}</p>
                    <p className="mt-3 text-sm font-medium text-brand-navy">{ch.value}</p>
                    <div className="mt-auto pt-5">
                      {ch.isLink ? (
                        <Link href={ch.href} className={`inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r ${ch.color} px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02]`}>
                          {ch.cta} <ArrowRightIcon className="size-3.5" />
                        </Link>
                      ) : (
                        <a href={ch.href} className={`inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r ${ch.color} px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02]`}>
                          {ch.cta} <ArrowRightIcon className="size-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-0 overflow-hidden rounded-2xl border border-white bg-white shadow-sm sm:grid-cols-2">
            {[
              { icon: ClockIcon, color: "bg-brand-orange/10 text-brand-orange", title: "Genel Destek", text: "E-postalara genellikle 1–2 iş günü içinde dönüş yapılır." },
              { icon: ZapIcon, color: "bg-red-50 text-red-500", title: "Acil Durumlar", text: 'Hesap güvenliği sorunlarında konu satırına "ACİL" yazınız.' },
            ].map(({ icon: Icon, color, title, text }, i) => (
              <div key={title} className={`p-6 ${i > 0 ? "border-t border-slate-100 sm:border-l sm:border-t-0" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className={`flex size-10 items-center justify-center rounded-xl ${color}`}>
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-navy">{title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
