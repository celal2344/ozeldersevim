frontend + backend = nextjs bff, server functions
database = posgresql, supabase
auth: supabase

frontend:
- shadcn
- React Hook Form
- Zod
- TanStack Query
- full turkish no i18n

### Deployment

- Frontend+backend: Vercel
- Database: Supabase Postgres
- SMS provider: İleti Merkezi or Netgsm

https://www.ozeldersalani.com/ bu siteyle neredeyse aynı olan bir özel ders sistemi
öğretmenler ve öğrenciler hesap oluşturabilecek,
öğretmenler ilan koyabilecek, öğrenciler ilana tıklayıp ilan detyalarını ve öğretmenin profili görebilecek
öğrencilerin istedikleri dersi bulabilemeleri için bir arama barı olucak buradan ilgili ders veren öğretmenleri bulabilecekler
öğretmenler için yorum yapma ve puanlama sistemleri olacak 
seo ve google görünürlüğü çok önemli olabildiğince googledan öğretmen veya ders ismi aratıldığında sitemiziin görünmesini istiyoruz
öğretmenlerin konumları, kazançları, verdiği dersler, tecrübe süresi vb. detaylar olmalı bu detaylar özeldersalani sitesindekine benzer olmalı
öğrenci öğretmene yapacağı ders isteği formu adımlarının bazılırının ekran görüntüleri mevcut image, image copy, image copy 2, bunlardan ilham alınabilir bu özel ders başvuru adımları
arama sonucu ekran görüntüsü paylaştım image copy 3 sonuç listesini, image copy 4 ilanı veren öğretmene tıklanınca açılan detay sayfasını gösteriyor, görsel kısımlarını şimdilik atlayabilirsin görsel eklemeyi daha sonraya bırakacağız
öğretmenler ve öğrenciler için farklı hesap oluşturma olması gerekiyor, öğrencilerin ve öğretmenlerin kendi dashboardları olucak, öğretmenler derslerini ve öğrencilerini dashboard üzerinden takip edebilecek, öğrenciler de aynı şekilde aldığı dersler vb. görebilecek, dashboard implementasyonu 2. aşama da ilk aşama arama arayüzü vb. olmalı
dashboard ve anasayfa için de klasör içine resim yükledim  örnek-anasayfa.png ve örnek-dashboardlar-ve-anasayfa 
öğretmenlerin ve öğrencilerin konumu önemli yakın konuma göre arama yapma, değerlendirme sırasına göre vb filtreler olmalı bu filtreler backend de handle edilmeli pagination ile eberaber burada tanstack query kullanılmalı
feature-based architecture kullan
tüm sayfalar mobil uyumlu dinamik olmalı
package lar için bun kullan
openapi api dökümantasyonu oluştur
projede ilerledikçe modellerin sürekli görüp takip edebileceği bir agent.md gibi bir context dosyası oluştur context dosyasına burdaki bilgiler ve genel yapısal bilgileri sürekli tut
