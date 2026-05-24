import type { z } from "zod";

import type { teacherOnboardingSchema } from "@/features/teachers/onboarding-constants";

export type TeacherOnboardingFormValues = z.infer<typeof teacherOnboardingSchema>;

export type TeacherOnboardingResponse = {
  teacherProfileId: string;
  listingSlug: string;
  status: "draft" | "published";
};
