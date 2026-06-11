import { searchTeachers } from "@/features/search/search-service";
import type { TeacherSearchResult } from "@/features/search/types";
import { getLessonCategoryOptions } from "@/features/teacher-listings/service";
import type { LessonCategoryOption } from "@/features/teacher-listings/types";
import { hasSupabasePublicEnv } from "@/shared/config/env";

export type HomepageMarketplaceData = {
  lessons: LessonCategoryOption[];
  marketplaceStatus: "ready" | "empty";
  teachers: TeacherSearchResult[];
};

export async function getHomepageMarketplaceData(): Promise<HomepageMarketplaceData> {
  if (!hasSupabasePublicEnv()) {
    return { lessons: [], marketplaceStatus: "empty", teachers: [] };
  }

  try {
    const [lessonOptions, teacherResponse] = await Promise.all([
      getLessonCategoryOptions(),
      searchTeachers({ page: 1, pageSize: 4, sort: "recommended" }),
    ]);

    return {
      lessons: lessonOptions.slice(0, 6),
      marketplaceStatus: teacherResponse.fallback?.reason === "marketplace_empty" ? "empty" : "ready",
      teachers: teacherResponse.data,
    };
  } catch {
    return { lessons: [], marketplaceStatus: "empty", teachers: [] };
  }
}
