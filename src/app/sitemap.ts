import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/features/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/ogretmen-bul",
    "/gizlilik-politikasi",
    "/kullanim-kosullari",
    "/kvkk-aydinlatma-metni",
  ];

  return staticRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.6,
  }));
}
