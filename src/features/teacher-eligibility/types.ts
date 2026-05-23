import type { z } from "zod";

import type {
  teacherEligibilityAnswerSchema,
  teacherEligibilityAttemptSchema,
  teacherEligibilityQuestions,
  teacherOnboardingSchema,
} from "@/features/teacher-eligibility/constants";

export type TeacherEligibilityQuestion = (typeof teacherEligibilityQuestions)[number];

export type PublicTeacherEligibilityQuestion = Pick<TeacherEligibilityQuestion, "id" | "prompt" | "options">;

export type TeacherEligibilityAnswer = z.infer<typeof teacherEligibilityAnswerSchema>;

export type TeacherEligibilityAttemptPayload = z.infer<typeof teacherEligibilityAttemptSchema>;

export type TeacherEligibilityResult = {
  passed: boolean;
  score: number;
  passingScore: number;
  questionCount: number;
  correctCount: number;
};

export type TeacherOnboardingPayload = z.infer<typeof teacherOnboardingSchema>;

export type TeacherOnboardingResponse = {
  teacherProfileId: string;
  listingSlug: string;
  status: "published";
};

export type TeacherOnboardingServiceResult =
  | {
      ok: true;
      data: TeacherOnboardingResponse;
    }
  | {
      ok: false;
      status: number;
      message: string;
    };
