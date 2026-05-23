import type { z } from "zod";

import type {
  teacherEligibilityAnswerSchema,
  teacherEligibilityAttemptSchema,
  teacherEligibilityQuestions,
  teacherListingCreationSchema,
  teacherRegistrationSchema,
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

export type TeacherRegistrationPayload = z.infer<typeof teacherRegistrationSchema>;

export type TeacherRegistrationResponse = {
  profileId: string;
  role: "teacher";
  status: "registered";
};

export type TeacherListingCreationPayload = z.infer<typeof teacherListingCreationSchema>;

export type TeacherListingCreationResponse = {
  teacherProfileId: string;
  listingSlug: string;
  status: "published";
};

export type TeacherRegistrationServiceResult =
  | {
      ok: true;
      data: TeacherRegistrationResponse;
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

export type TeacherListingCreationServiceResult =
  | {
      ok: true;
      data: TeacherListingCreationResponse;
    }
  | {
      ok: false;
      status: number;
      message: string;
    };
