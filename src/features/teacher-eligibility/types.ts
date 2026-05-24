import type { z } from "zod";

import type { submitEligibilitySchema } from "@/features/teacher-eligibility/constants";

export type SubmitEligibilityPayload = z.infer<typeof submitEligibilitySchema>;

export type StartAttemptResponse = {
  attemptId: string;
};

export type SubmitAttemptResponse = {
  passed: boolean;
  score: number;
  passingScore: number;
};
