export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  date: string;
  readingMinutes: number;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "ozel-ders-nasil-etkin-kullanilir",
    title: "Özel Dersten En Yüksek Verimi Nasıl Alırsınız?",
    summary: "Birebir özel ders sürecini verimli hale getirmek için öğrenci ve ebeveynlerin bilmesi gereken pratik ipuçları.",
    category: "Öğrenci Rehberi",
    author: "ÖzelDersEvim Ekibi",
    date: "2026-05-20",
    readingMinutes: 5,
  },
  {
    slug: "tyt-ayt-matematik-calisma-plani",
    title: "TYT-AYT Matematik İçin 3 Aylık Çalışma Planı",
    summary: "Sınava 3 ay kala matematikte ne zaman hangi konuya odaklanmalısınız? Haftalık çalışma takvimi ve konu öncelikleri.",
    category: "Sınav Hazırlık",
    author: "ÖzelDersEvim Ekibi",
    date: "2026-05-12",
    readingMinutes: 7,
  },
  {
    slug: "ingilizce-konusma-pratigi-nasil-yapilir",
    title: "Evde İngilizce Konuşma Pratiği Yapmanın 5 Yolu",
    summary: "Öğretmeninizle ders dışı zamanlarda İngilizce konuşma becerilerini geliştirmek için uygulayabileceğiniz yöntemler.",
    category: "Yabancı Dil",
    author: "ÖzelDersEvim Ekibi",
    date: "2026-04-30",
    readingMinutes: 4,
  },
  {
    slug: "online-ozel-ders-avantajlari",
    title: "Online Özel Dersin 7 Avantajı",
    summary: "Yüz yüze derse alternatif olarak online özel dersin zaman, maliyet ve esneklik açısından sağladığı faydalar.",
    category: "Online Eğitim",
    author: "ÖzelDersEvim Ekibi",
    date: "2026-04-18",
    readingMinutes: 4,
  },
  {
    slug: "lgs-hazirliginda-ozel-ders",
    title: "LGS Hazırlığında Özel Ders Ne Zaman Başlamalı?",
    summary: "8. sınıf öğrencileri için LGS hazırlık sürecini özel destekle yönetmenin en doğru zamanı ve stratejisi.",
    category: "Sınav Hazırlık",
    author: "ÖzelDersEvim Ekibi",
    date: "2026-04-05",
    readingMinutes: 6,
  },
  {
    slug: "dogru-ozel-ders-ogretmeni-nasil-secilir",
    title: "Doğru Özel Ders Öğretmenini Nasıl Seçersiniz?",
    summary: "Öğretmen seçiminde dikkat edilmesi gereken kriterler: deneyim, referanslar, ders stili ve ilk ders denemeleri.",
    category: "Öğrenci Rehberi",
    author: "ÖzelDersEvim Ekibi",
    date: "2026-03-22",
    readingMinutes: 5,
  },
];

export const blogCategories = [...new Set(blogPosts.map((p) => p.category))];
