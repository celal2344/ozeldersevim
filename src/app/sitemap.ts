import type { MetadataRoute } from "next";

import { sitemapStaticRoutes } from "@/features/seo/constants";
import { lessonPageSlugs } from "@/features/seo/lesson-pages";
import { absoluteUrl } from "@/features/seo/site";
import { getTeacherProfileSlugs } from "@/features/teachers/service";
import { createSupabaseServerClient } from "@/shared/db/supabase/server";

async function getPublishedTeacherSlugs(): Promise<string[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("teacher_listings")
      .select("slug")
      .eq("is_published", true);

    return data?.map((r) => r.slug) ?? [];
  } catch {
    return getTeacherProfileSlugs();
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = sitemapStaticRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.6,
  }));

  const lessonRoutes: MetadataRoute.Sitemap = lessonPageSlugs.map((slug) => ({
    url: absoluteUrl(`/ozel-ders/${slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const teacherSlugs = await getPublishedTeacherSlugs();
  const teacherRoutes: MetadataRoute.Sitemap = teacherSlugs.map((slug) => ({
    url: absoluteUrl(`/ogretmen/${slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...lessonRoutes, ...teacherRoutes];
}
