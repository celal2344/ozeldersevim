import type { MetadataRoute } from "next";

import { sitemapStaticRoutes } from "@/features/seo/constants";
import { absoluteUrl } from "@/features/seo/site";
import { getTeacherProfileSlugs } from "@/features/teachers/service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = sitemapStaticRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.6,
  }));

  const slugs = await getTeacherProfileSlugs();
  const teacherRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: absoluteUrl(`/ogretmen/${slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...teacherRoutes];
}
