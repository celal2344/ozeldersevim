import { searchTeachers } from "@/features/search/search-service";
import type { TeacherSearchResult } from "@/features/search/types";
import { getLessonCategoryOptions } from "@/features/teacher-listings/service";
import { hasSupabasePublicEnv } from "@/shared/config/env";

export type HomepageMarketplaceData = {
  lessons: string[];
  teachers: TeacherSearchResult[];
};

export async function getHomepageMarketplaceData(): Promise<HomepageMarketplaceData> {
  if (!hasSupabasePublicEnv()) {
    return { lessons: [], teachers: [] };
  }

  try {
    const [lessonOptions, teacherResponse] = await Promise.all([
      getLessonCategoryOptions(),
      searchTeachers({ page: 1, pageSize: 4, sort: "recommended" }),
    ]);

    return {
      lessons: lessonOptions.map((lesson) => lesson.name).slice(0, 6),
      teachers: teacherResponse.data,
    };
  } catch {
    return { lessons: [], teachers: [] };
  }
}
