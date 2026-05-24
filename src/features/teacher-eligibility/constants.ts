import { z } from "zod";

export const teacherEligibilityPassingScore = 70;
export const teacherEligibilityQuestionCount = 10;
export const teacherEligibilityTestVersion = 1;

export const teacherEligibilityQuestions = [
  {
    id: "student-goal-assessment",
    prompt: "İlk ders görüşmesinde en doğru başlangıç hangisidir?",
    options: [
      { id: "promise-fast-result", label: "Öğrenciye hızlı başarı garantisi vermek" },
      { id: "assess-goals", label: "Seviye, hedef ve beklentiyi netleştirmek" },
      { id: "skip-plan", label: "Plan yapmadan doğrudan konu anlatmak" },
    ],
    correctOptionId: "assess-goals",
  },
  {
    id: "student-struggle",
    prompt: "Öğrenci bir konuyu anlamakta zorlanıyorsa öğretmen ne yapmalıdır?",
    options: [
      { id: "adapt-method", label: "Anlatımı değiştirip örnek ve pratikle ilerlemek" },
      { id: "blame-student", label: "Öğrencinin yeterince çalışmadığını söylemek" },
      { id: "move-on", label: "Konuyu hızlıca geçip sonraki üniteye başlamak" },
    ],
    correctOptionId: "adapt-method",
  },
  {
    id: "contact-privacy",
    prompt: "Öğrenci iletişim bilgileri ne zaman öğretmenle paylaşılır?",
    options: [
      { id: "always-public", label: "İlanı görüntüleyen herkesle" },
      { id: "after-acceptance", label: "Öğretmen ders talebini kabul ettikten sonra" },
      { id: "before-request", label: "Öğrenci talep oluşturmadan önce" },
    ],
    correctOptionId: "after-acceptance",
  },
  {
    id: "online-meeting",
    prompt: "Online derslerde toplantı linki için MVP kuralı nedir?",
    options: [
      { id: "external-link", label: "Taraflar kendi Meet/Zoom linkini oluşturur" },
      { id: "platform-required", label: "Platform otomatik link üretmek zorundadır" },
      { id: "no-online", label: "Online ders desteklenmez" },
    ],
    correctOptionId: "external-link",
  },
  {
    id: "pricing-clarity",
    prompt: "İlan fiyatı nasıl sunulmalıdır?",
    options: [
      { id: "hidden-price", label: "Öğrenci yazana kadar fiyat gizlenmelidir" },
      { id: "hourly-clear", label: "Saatlik ücret açık ve güncel olmalıdır" },
      { id: "varies-only", label: "Sadece 'değişir' yazmak yeterlidir" },
    ],
    correctOptionId: "hourly-clear",
  },
  {
    id: "reschedule",
    prompt: "Öğretmen planlanan derse katılamayacaksa ne yapmalıdır?",
    options: [
      { id: "early-notice", label: "Mümkün olduğunca erken haber verip yeni zaman önermelidir" },
      { id: "ignore", label: "Öğrencinin tekrar yazmasını beklemelidir" },
      { id: "last-minute", label: "Ders saatinde kısa bir mesaj atması yeterlidir" },
    ],
    correctOptionId: "early-notice",
  },
  {
    id: "professional-communication",
    prompt: "Öğrenciyle iletişimde temel beklenti nedir?",
    options: [
      { id: "professional", label: "Saygılı, yaşa uygun ve ders odağında kalmak" },
      { id: "casual-only", label: "Tamamen gündelik ve kayıtsız konuşmak" },
      { id: "pressure", label: "Hızlı karar vermesi için baskı kurmak" },
    ],
    correctOptionId: "professional",
  },
  {
    id: "realistic-claims",
    prompt: "Bir öğretmen başarı vaadi verirken hangi yaklaşımı seçmelidir?",
    options: [
      { id: "guarantee-score", label: "Kesin sınav puanı garantisi vermek" },
      { id: "realistic-plan", label: "Öğrencinin durumuna göre gerçekçi çalışma planı sunmak" },
      { id: "compare-students", label: "Öğrencileri birbirleriyle kıyaslamak" },
    ],
    correctOptionId: "realistic-plan",
  },
  {
    id: "feedback",
    prompt: "Ödev ve çalışma takibi için iyi uygulama hangisidir?",
    options: [
      { id: "structured-feedback", label: "Hataları açıklayıp bir sonraki çalışma adımını önermek" },
      { id: "grade-only", label: "Sadece doğru/yanlış sayısını söylemek" },
      { id: "no-feedback", label: "Ödev takibini tamamen öğrenciye bırakmak" },
    ],
    correctOptionId: "structured-feedback",
  },
  {
    id: "review-right",
    prompt: "Öğrenci hangi durumda öğretmene yorum yapabilmelidir?",
    options: [
      { id: "anytime", label: "Hiç ders talebi oluşturmadan" },
      { id: "after-accepted-request", label: "Öğretmen özel ders başvurusunu kabul ettikten sonra" },
      { id: "only-admin", label: "Sadece admin manuel izin verirse" },
    ],
    correctOptionId: "after-accepted-request",
  },
] as const;

export const teacherOnboardingDeliveryModeOptions = [
  { value: "both", label: "Online + yüz yüze" },
  { value: "online", label: "Online" },
  { value: "face_to_face", label: "Yüz yüze" },
] as const;

export const teacherOnboardingSteps = [
  { title: "Test", text: "10 soruluk uygunluk testini geç." },
  { title: "Profil", text: "Ad, telefon, konum ve fiyat bilgilerini gir." },
  { title: "İlan", text: "Dersleri seç ve ilanı hemen yayına al." },
] as const;

export const teacherEligibilityAnswerSchema = z.object({
  questionId: z.string().min(1, "Soru bilgisi eksik."),
  optionId: z.string().min(1, "Bu soruyu yanıtla."),
});

export const teacherEligibilityAttemptSchema = z.object({
  answers: z
    .array(teacherEligibilityAnswerSchema)
    .length(teacherEligibilityQuestionCount, `${teacherEligibilityQuestionCount} sorunun tamamını yanıtla.`),
});

export const teacherOnboardingSchema = z
  .object({
    eligibilityAnswers: z
      .array(teacherEligibilityAnswerSchema)
      .length(teacherEligibilityQuestionCount, "Öğretmenlik testini tamamlamalısın."),
    fullName: z.string().trim().min(2, "Ad soyad zorunlu.").max(120, "Ad soyad 120 karakteri geçemez."),
    email: z.email("Geçerli bir email gir."),
    password: z.string().min(8, "Şifre en az 8 karakter olmalı."),
    phone: z.string().trim().min(10, "Telefon zorunlu.").max(30, "Telefon 30 karakteri geçemez."),
    locationSlug: z.string().min(1, "Konum seçimi zorunlu."),
    hourlyPrice: z.number().min(1, "Saatlik ücret zorunlu.").max(100000, "Saatlik ücret çok yüksek."),
    title: z.string().trim().min(5, "Profil başlığı en az 5 karakter olmalı.").max(120, "Başlık 120 karakteri geçemez."),
    bio: z.string().trim().min(40, "Biyografi en az 40 karakter olmalı.").max(1000, "Biyografi 1000 karakteri geçemez."),
    lessonSlugs: z.array(z.string().min(1)).min(1, "En az bir ders seç.").max(6, "En fazla 6 ders seçebilirsin."),
    education: z.string().trim().min(2, "Eğitim bilgisi zorunlu.").max(160, "Eğitim bilgisi 160 karakteri geçemez."),
    experienceYears: z.number().min(0, "Deneyim yılı negatif olamaz.").max(60, "Deneyim yılı çok yüksek."),
    deliveryMode: z.enum(["online", "face_to_face", "both"], {
      error: "Ders türü seçimi zorunlu.",
    }),
    termsAccepted: z.boolean().refine((value) => value, {
      message: "Kullanım koşullarını kabul etmelisin.",
    }),
    privacyAccepted: z.boolean().refine((value) => value, {
      message: "Gizlilik/KVKK metnini kabul etmelisin.",
    }),
  })
  .refine((values) => new Set(values.lessonSlugs).size === values.lessonSlugs.length, {
    path: ["lessonSlugs"],
    message: "Aynı dersi birden fazla seçemezsin.",
  });
