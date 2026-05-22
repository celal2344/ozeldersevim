import type { z } from "zod";

import type { completeLessonRequestSchema, lessonRequestFormSchema } from "@/features/requests/constants";

export type LessonRequestFormValues = z.infer<typeof lessonRequestFormSchema>;

export type CompleteLessonRequestPayload = z.infer<typeof completeLessonRequestSchema>;

export type CompleteLessonRequestResponse = {
  requestId: string;
  studentProfileId: string;
  status: "submitted";
};
