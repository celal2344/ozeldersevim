import {
  teacherEligibilityPassingScore,
  teacherEligibilityQuestionCount,
  teacherEligibilityQuestions,
} from "@/features/teacher-eligibility/constants";
import type {
  PublicTeacherEligibilityQuestion,
  TeacherEligibilityAnswer,
  TeacherEligibilityResult,
} from "@/features/teacher-eligibility/types";
import { toTurkishSlug } from "@/shared/lib/utils";

export function publicTeacherEligibilityQuestions(): PublicTeacherEligibilityQuestion[] {
  return teacherEligibilityQuestions.map((question) => ({
    id: question.id,
    prompt: question.prompt,
    options: question.options,
  }));
}

export function defaultTeacherEligibilityAnswers(): TeacherEligibilityAnswer[] {
  return teacherEligibilityQuestions.map((question) => ({
    questionId: question.id,
    optionId: "",
  }));
}

export function scoreTeacherEligibilityAnswers(
  answers: TeacherEligibilityAnswer[]
): TeacherEligibilityResult {
  const selectedOptionByQuestion = new Map(
    answers.map((answer) => [answer.questionId, answer.optionId])
  );
  const correctCount = teacherEligibilityQuestions.filter(
    (question) => selectedOptionByQuestion.get(question.id) === question.correctOptionId
  ).length;
  const score = Math.round((correctCount / teacherEligibilityQuestionCount) * 100);

  return {
    passed: score >= teacherEligibilityPassingScore,
    score,
    passingScore: teacherEligibilityPassingScore,
    questionCount: teacherEligibilityQuestionCount,
    correctCount,
  };
}

export function teacherEligibilityApiErrorMessage(payload: unknown) {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  return "İşlem tamamlanamadı. Lütfen tekrar dene.";
}

export function teacherListingShortBio(bio: string) {
  const normalized = bio.trim().replace(/\s+/g, " ");
  return normalized.length <= 180 ? normalized : `${normalized.slice(0, 177).trim()}...`;
}

export function teacherListingSlug(parts: string[]) {
  const slug = toTurkishSlug(parts.filter(Boolean).join(" "));
  return slug || "ogretmen-ilani";
}

export function teacherListingSlugFallback(baseSlug: string, userId: string) {
  return `${baseSlug}-${userId.slice(0, 8)}`;
}
