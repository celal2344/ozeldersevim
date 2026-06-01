import type { TeacherEligibilityState } from "@/features/teacher-eligibility/types";

export type TeacherListingStatus = "missing" | "draft" | "published" | "suspended";

export type TeacherListing = {
  status: TeacherListingStatus;
  slug: string | null;
  title: string;
  bio: string;
  education: string;
  experienceYears: number;
  hourlyPrice: number;
  deliveryMode: "online" | "face_to_face" | "both";
  locationSlug: string;
  lessonSlugs: string[];
  updatedAt: string | null;
};

export type TeacherListingResource = {
  eligibility: TeacherEligibilityState;
  listing: TeacherListing;
};

export type TeacherListingInput = {
  status: "draft" | "published";
  title: string;
  bio: string;
  education: string;
  experienceYears: number;
  hourlyPrice: number;
  deliveryMode: "online" | "face_to_face" | "both";
  locationSlug: string;
  lessonSlugs: string[];
};

export type LessonCategoryOption = {
  slug: string;
  name: string;
};

export type LocationOption = {
  slug: string;
  city: string;
  district: string | null;
};
