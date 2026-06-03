import { teacherProfileSeed } from "@/features/teachers/constants";
import type { TeacherSearchResult } from "./types";

export const teacherSearchSeed: TeacherSearchResult[] = teacherProfileSeed.map((teacher) => ({
  id: teacher.id,
  slug: teacher.slug,
  fullName: teacher.fullName,
  headline: teacher.headline,
  shortBio: teacher.shortBio,
  city: teacher.city,
  district: teacher.district,
  latitude: teacher.latitude,
  longitude: teacher.longitude,
  lessons: teacher.lessons,
  deliveryMode: teacher.deliveryMode,
  hourlyPrice: teacher.hourlyPrice,
  ratingAverage: teacher.ratingAverage,
  reviewCount: teacher.reviewCount,
  experienceYears: teacher.experienceYears,
  completedLessons: teacher.completedLessonCount,
  activeStudents: teacher.activeStudentCount,
  gender: teacher.gender,
  fastResponse: teacher.fastResponse,
}));

export const lessonOptions = ["Matematik", "Fizik", "Kimya", "İngilizce", "Türkçe", "Yazılım", "LGS", "TYT / AYT"];
export const cityOptions = ["Erzurum", "İstanbul", "Ankara", "İzmir"];
export const districtOptions = ["Yakutiye", "Palandöken", "Kadıköy", "Çankaya", "Konak"];
