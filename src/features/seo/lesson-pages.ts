export type LessonPageConfig = {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  keywords: string[];
};

export const lessonPages: LessonPageConfig[] = [
  {
    slug: "matematik",
    name: "Matematik",
    title: "Matematik Özel Ders",
    description: "Türkiye'nin her şehrinde alanında uzman matematik özel ders öğretmenleri. LGS, TYT, AYT ve okul matematiği için online veya yüz yüze ders al.",
    intro: "Matematikte eksiklerinizi kapatmak, sınav hazırlığını güçlendirmek veya temel konuları pekiştirmek için alanında uzman matematik öğretmenlerimizden özel ders alabilirsiniz. İlkokul düzeyinden TYT/AYT'ya kadar her seviyede deneyimli öğretmenler sizin için hazır.",
    keywords: ["matematik özel ders", "matematik öğretmeni", "tyt matematik", "ayt matematik", "lgs matematik"],
  },
  {
    slug: "fizik",
    name: "Fizik",
    title: "Fizik Özel Ders",
    description: "Deneyimli fizik özel ders öğretmenleriyle TYT, AYT ve lise fiziğinde başarıya ulaş. Online ve yüz yüze seçenekleriyle Türkiye genelinde hizmet.",
    intro: "Fizik, soyut kavramları somutlaştıran doğru bir öğretmenle çok daha anlaşılır hale gelir. Lise fiziğinden üniversite giriş sınavlarına kadar uzanan geniş bir yelpazede deneyimli fizik öğretmenlerimizle kısa sürede ilerleyebilirsiniz.",
    keywords: ["fizik özel ders", "fizik öğretmeni", "tyt fizik", "ayt fizik", "lise fizik özel ders"],
  },
  {
    slug: "kimya",
    name: "Kimya",
    title: "Kimya Özel Ders",
    description: "Kimya özel ders öğretmenleriyle TYT, AYT ve okul kimyasında güçlü bir temel oluştur. Online ve yüz yüze ders seçenekleri.",
    intro: "Kimyada temel kavramlardan organik kimyaya, stokiyometriden elektrokimyaya kadar her konuyu deneyimli öğretmenlerimizle adım adım öğrenebilirsiniz. Sınav odaklı çalışma programlarıyla kısa sürede fark yaratın.",
    keywords: ["kimya özel ders", "kimya öğretmeni", "tyt kimya", "ayt kimya", "lise kimya özel ders"],
  },
  {
    slug: "ingilizce",
    name: "İngilizce",
    title: "İngilizce Özel Ders",
    description: "Konuşma, yazma, okuma ve dinleme becerilerini geliştirmek için uzman İngilizce özel ders öğretmenleri. Her yaş ve seviyeye uygun online ve yüz yüze dersler.",
    intro: "İngilizce öğrenmek artık hiç bu kadar kolay olmamıştı. Temel A1-A2 seviyesinden ileri C1-C2 seviyesine, okul İngilizcesinden IELTS ve TOEFL hazırlığına kadar uzman öğretmenlerimiz her ihtiyacınıza yanıt veriyor.",
    keywords: ["ingilizce özel ders", "ingilizce öğretmeni", "online ingilizce", "ielts hazırlık", "konuşma pratiği"],
  },
  {
    slug: "turkce",
    name: "Türkçe",
    title: "Türkçe Özel Ders",
    description: "Türkçe özel ders öğretmenleriyle okuma anlama, yazma ve dil bilgisi becerilerini güçlendir. LGS ve TYT Türkçe hazırlığı için uzman destek.",
    intro: "Türkçe derslerinde paragraf soruları, sözcük bilgisi veya yazılı anlatım konularında güçlenmek istiyorsanız deneyimli Türkçe öğretmenlerimiz size kişiselleştirilmiş bir çalışma programıyla destek olur.",
    keywords: ["türkçe özel ders", "türkçe öğretmeni", "tyt türkçe", "lgs türkçe", "yazı dili"],
  },
  {
    slug: "yazilim",
    name: "Yazılım",
    title: "Yazılım Özel Ders",
    description: "Python, JavaScript, web geliştirme, algoritma ve veri yapıları konularında yazılım özel ders öğretmenleri. Başlangıçtan uzmanlığa her seviye.",
    intro: "Yazılım dünyasına ilk adımı atmak veya mevcut becerilerinizi geliştirmek için alanında deneyimli yazılım öğretmenlerimizden birebir ders alabilirsiniz. Python, JavaScript, veri yapıları ve web geliştirme başta olmak üzere pek çok konuda destek alınabilir.",
    keywords: ["yazılım özel ders", "programlama öğren", "python özel ders", "javascript özel ders", "web geliştirme"],
  },
  {
    slug: "lgs",
    name: "LGS Hazırlık",
    title: "LGS Hazırlık Özel Ders",
    description: "LGS'ye hazırlık için deneyimli özel ders öğretmenleri. Matematik, Türkçe, Fen ve Sosyal Bilgiler konularında birebir destek.",
    intro: "Liselere Giriş Sınavı'na (LGS) hazırlık sürecinde doğru rehberlik kritik fark yaratır. Matematik, Türkçe, Fen Bilimleri ve Sosyal Bilgiler alanlarında uzman LGS öğretmenlerimizle sınavda hedeflediğiniz puana ulaşın.",
    keywords: ["lgs özel ders", "lgs hazırlık", "lgs matematik", "lgs türkçe", "8. sınıf özel ders"],
  },
  {
    slug: "tyt-ayt",
    name: "TYT / AYT Hazırlık",
    title: "TYT ve AYT Özel Ders",
    description: "Üniversite sınav hazırlığı için TYT ve AYT özel ders öğretmenleri. Matematik, Türkçe, Fizik, Kimya, Biyoloji ve Edebiyat alanlarında uzman destek.",
    intro: "Üniversite sınav sürecini daha verimli ve özgüvenli geçirmek için alanında uzman TYT/AYT öğretmenlerimizle çalışın. Konu anlatımı, soru çözümü ve deneme analizi ile sınav stratejinizi birlikte oluşturun.",
    keywords: ["tyt özel ders", "ayt özel ders", "üniversite hazırlık", "yks hazırlık", "tyt matematik", "ayt fizik"],
  },
];

export const lessonPageSlugs = lessonPages.map((p) => p.slug);

export function getLessonPage(slug: string): LessonPageConfig | undefined {
  return lessonPages.find((p) => p.slug === slug);
}
