import { teacherProfileSeed } from "@/features/teachers/constants";

export function getTeacherProfileBySlug(slug: string) {
  return teacherProfileSeed.find((teacher) => teacher.slug === slug) ?? null;
}

export function getTeacherProfileSlugs() {
  return teacherProfileSeed.map((teacher) => teacher.slug);
}
