import type { MetadataRoute } from "next";

import { siteConfig } from "@/features/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/ogrenci/", "/ogretmen/panel"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
