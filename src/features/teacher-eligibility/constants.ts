import { z } from "zod";

export const teacherEligibilitySubmissionSchema = z.object({
  testId: z.string().min(1, "Geçerli bir test seçimi gerekli."),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1, "Soru seçimi gerekli."),
        choiceId: z.string().min(1, "Cevap seçimi gerekli."),
      })
    )
    .min(1, "En az bir cevap gerekli."),
});

export const teacherEligibilityPassMessage = "Testi geçtin. Artık ilanını yayına alabilirsin.";
export const teacherEligibilityFailMessage = "Test sonucu yeterli değil. Cevaplarını kontrol edip tekrar deneyebilirsin.";
