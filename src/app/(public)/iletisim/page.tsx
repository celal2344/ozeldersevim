import type { Metadata } from "next";
import Link from "next/link";
import { MailIcon, MessageCircleIcon, FileTextIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

export const metadata: Metadata = {
  title: "İletişim | ÖzelDersEvim",
  description: "ÖzelDersEvim ile iletişime geçin. Sorularınız, önerileriniz ve destek talepleriniz için bize ulaşın.",
};

const contactChannels = [
  {
    icon: MailIcon,
    title: "E-posta",
    description: "Genel sorular ve destek talepleri için",
    value: "destek@ozeldersevim.com",
    href: "mailto:destek@ozeldersevim.com",
    cta: "E-posta Gönder",
  },
  {
    icon: FileTextIcon,
    title: "Sık Sorulan Sorular",
    description: "Cevabınızı SSS sayfasında bulabilirsiniz",
    value: "ozeldersevim.com/sss",
    href: "/sss",
    cta: "SSS'e Git",
  },
  {
    icon: MessageCircleIcon,
    title: "Gizlilik ve KVKK",
    description: "Kişisel veri talepleriniz için",
    value: "kvkk@ozeldersevim.com",
    href: "mailto:kvkk@ozeldersevim.com",
    cta: "E-posta Gönder",
  },
];

export default function IletisimSayfasi() {
  return (
    <main className="bg-slate-50">
      <section className="bg-brand-navy px-4 py-14 text-white sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold">İletişim</h1>
          <p className="mt-4 text-white/72">
            Sorularınız, önerileriniz ve destek talepleriniz için aşağıdaki kanallardan ulaşabilirsiniz.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-3">
          {contactChannels.map((channel) => {
            const Icon = channel.icon;
            const isExternal = channel.href.startsWith("mailto:");

            return (
              <Card key={channel.title} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-brand-orange/10">
                    <Icon className="size-5 text-brand-orange" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-base text-brand-navy">{channel.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{channel.description}</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-4">
                  <p className="text-sm font-medium text-brand-navy">{channel.value}</p>
                  {isExternal ? (
                    <a
                      href={channel.href}
                      className="inline-flex h-9 items-center justify-center rounded-lg bg-brand-orange px-3 text-sm font-medium text-white hover:bg-brand-orange/90 transition-colors"
                    >
                      {channel.cta}
                    </a>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-brand-orange text-white hover:bg-brand-orange/90"
                      nativeButton={false}
                      render={<Link href={channel.href} />}
                    >
                      {channel.cta}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-brand-navy">Yanıt Süremiz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="font-medium text-brand-navy">Genel Destek</p>
                <p className="mt-1 text-muted-foreground">E-postalara genellikle 1–2 iş günü içinde dönüş yapılır.</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="font-medium text-brand-navy">Acil Durumlar</p>
                <p className="mt-1 text-muted-foreground">Hesap güvenliği ile ilgili acil sorunlarda konu satırına "ACİL" yazınız.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
