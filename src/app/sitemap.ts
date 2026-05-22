import type { MetadataRoute } from "next";

import { sitemapStaticRoutes } from "@/features/seo/constants";
import { absoluteUrl } from "@/features/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapStaticRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.6,
  }));
}
