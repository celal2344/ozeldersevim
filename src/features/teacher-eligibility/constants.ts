import { z } from "zod";

export type EligibilityQuestion = {
  id: number;
  text: string;
  options: { value: string; label: string }[];
  correct: string;
};

export const eligibilityQuestions: EligibilityQuestion[] = [
  {
    id: 1,
    text: "Bir öğrenci konuyu anlayamadığında ilk yapmanız gereken nedir?",
    options: [
      { value: "a", label: "Aynı açıklamayı tekrar etmek" },
      { value: "b", label: "Farklı bir yöntem veya örnekle konuya yeniden yaklaşmak" },
      { value: "c", label: "Konuyu geçip ilerlemek" },
      { value: "d", label: "Öğrencinin daha fazla çalışmasını söylemek" },
    ],
    correct: "b",
  },
  {
    id: 2,
    text: "Etkili bir özel ders seansının temel özelliği nedir?",
    options: [
      { value: "a", label: "Olabildiğince çok konu işlemek" },
      { value: "b", label: "Öğrencinin ihtiyacına göre hedef belirlemek ve ilerlemeyi takip etmek" },
      { value: "c", label: "Yalnızca sınav sorularını çözmek" },
      { value: "d", label: "Öğrencinin tüm ödevlerini birlikte yapmak" },
    ],
    correct: "b",
  },
  {
    id: 3,
    text: "Öğrencinin motivasyonu düştüğünde ne yaparsınız?",
    options: [
      { value: "a", label: "Dersi biraz kısaltıp bitirmek" },
      { value: "b", label: "Öğrenciden daha çok çalışmasını istemek" },
      { value: "c", label: "Başarılarını hatırlatmak ve küçük, ulaşılabilir hedefler koymak" },
      { value: "d", label: "Daha kolay konulara geçmek" },
    ],
    correct: "c",
  },
  {
    id: 4,
    text: "Veli, öğrencinin ilerleme kaydetmediğini düşünüyorsa ne yapmalısınız?",
    options: [
      { value: "a", label: "Velinin kaygılarını görmezden gelmek" },
      { value: "b", label: "Öğrencinin başarısız olduğunu açıkça belirtmek" },
      { value: "c", label: "Mevcut durumu ve planlanan adımları şeffaf biçimde paylaşmak" },
      { value: "d", label: "Ders ücretini düşürmeyi önermek" },
    ],
    correct: "c",
  },
  {
    id: 5,
    text: "Öğrencinin güçlü ve zayıf yönlerini nasıl belirlersiniz?",
    options: [
      { value: "a", label: "Yalnızca öğrencinin sözüne güvenmek" },
      { value: "b", label: "Kısa bir ön değerlendirme veya tanıma soruları sormak" },
      { value: "c", label: "Başka öğrencilerle karşılaştırmak" },
      { value: "d", label: "Konuya direkt girmek ve sorunlar çıktıkça çözmek" },
    ],
    correct: "b",
  },
  {
    id: 6,
    text: "Ders sırasında öğrencinin dikkatinin dağıldığını fark ediyorsunuz. Ne yaparsınız?",
    options: [
      { value: "a", label: "Dersi bitirip eve göndermek" },
      { value: "b", label: "Kısa bir mola vermek veya konuya ilgi çekici bir soru yöneltmek" },
      { value: "c", label: "Daha yüksek sesle konuşmak" },
      { value: "d", label: "Öğrenciyi uyarmak ve sınav notunu hatırlatmak" },
    ],
    correct: "b",
  },
  {
    id: 7,
    text: "Öğrenciye yanlış bir bilgi verdiğinizi sonradan fark ettiniz. Ne yaparsınız?",
    options: [
      { value: "a", label: "Durumu görmezden gelmek" },
      { value: "b", label: "Bir sonraki derste sessizce düzeltmek" },
      { value: "c", label: "Hatayı kabul edip doğru bilgiyi mümkün olan en kısa sürede iletmek" },
      { value: "d", label: "Konuyu bir daha işlememek" },
    ],
    correct: "c",
  },
  {
    id: 8,
    text: "Öğrencinin bir dersi tekrar tekrar yanlış anlıyor olması ne anlama gelir?",
    options: [
      { value: "a", label: "Öğrenci çalışmıyordur" },
      { value: "b", label: "Öğrenci bu konuyu hiç öğrenemez" },
      { value: "c", label: "Kullandığınız öğretim yöntemi bu öğrenciye uymuyor olabilir" },
      { value: "d", label: "Konunun kendisi çok zordur" },
    ],
    correct: "c",
  },
  {
    id: 9,
    text: "İlk dersten önce öğrenciye hangi bilgiyi sormalısınız?",
    options: [
      { value: "a", label: "Hangi okula gittiğini" },
      { value: "b", label: "Ne öğrenmek istediğini, mevcut seviyesini ve hedeflerini" },
      { value: "c", label: "Ailesi hakkında genel bilgi" },
      { value: "d", label: "Daha önce kaç özel ders aldığını" },
    ],
    correct: "b",
  },
  {
    id: 10,
    text: "Öğrencinin öğrenme hızı beklediğinizden daha yavaş. Nasıl devam edersiniz?",
    options: [
      { value: "a", label: "Ders planını değiştirmeden devam etmek" },
      { value: "b", label: "Öğrenciye daha fazla ev ödevi vermek" },
      { value: "c", label: "Adımları daha küçük parçalara bölmek ve pekiştirme egzersizleri eklemek" },
      { value: "d", label: "Veliye öğrencinin ilgisiz olduğunu bildirmek" },
    ],
    correct: "c",
  },
];

export const ELIGIBILITY_PASSING_SCORE = 70;
export const ELIGIBILITY_QUESTION_COUNT = eligibilityQuestions.length;

export const submitEligibilitySchema = z.object({
  attemptId: z.string().uuid("Geçersiz deneme ID."),
  answers: z
    .record(z.string(), z.string())
    .refine(
      (answers) => Object.keys(answers).length === ELIGIBILITY_QUESTION_COUNT,
      { message: `Tüm ${ELIGIBILITY_QUESTION_COUNT} soruyu cevaplamalısın.` }
    ),
});
