import type { MetadataRoute } from "next";

import { sitemapStaticRoutes } from "@/features/seo/constants";
import { lessonPageSlugs } from "@/features/seo/lesson-pages";
import { absoluteUrl } from "@/features/seo/site";
import { getTeacherProfileSlugs } from "@/features/teachers/service";
import { hasSupabasePublicEnv } from "@/shared/config/env";

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

  const teacherSlugs = hasSupabasePublicEnv() ? await getTeacherProfileSlugs() : [];
  const teacherRoutes: MetadataRoute.Sitemap = teacherSlugs.map((slug) => ({
    url: absoluteUrl(`/ogretmen/${slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...lessonRoutes, ...teacherRoutes];
}
