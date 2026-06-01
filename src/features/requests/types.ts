import type { z } from "zod";

import type { lessonRequestFormSchema, submitLessonRequestSchema } from "@/features/requests/constants";

export type LessonRequestFormValues = z.infer<typeof lessonRequestFormSchema>;

export type SubmitLessonRequestPayload = z.infer<typeof submitLessonRequestSchema>;

export type SubmitLessonRequestResponse = {
  requestId: string;
  studentProfileId: string;
  status: "submitted";
};
