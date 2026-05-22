export const siteConfig = {
  name: "Özel Ders Evim",
  url: "https://www.ozeldersevim.com",
  description:
    "Türkiye'de özel ders öğretmeni bulmak ve öğretmenlere ders talebi göndermek için geliştirilmiş özel ders platformu.",
  navItems: [
    { href: "/", label: "Ana Sayfa" },
    { href: "/dersler", label: "Dersler" },
    { href: "/ogretmen-bul", label: "Öğretmenler" },
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/sss", label: "SSS" },
    { href: "/iletisim", label: "İletişim" },
  ],
};

export function absoluteUrl(path: string) {
  return `${siteConfig.url}${path}`;
}
