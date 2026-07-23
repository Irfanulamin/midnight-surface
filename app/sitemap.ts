import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/*
 * Sitemap. This is a single-page site, so the one canonical entry is `/`. The
 * in-page sections (#services, #work, #pricing, ...) are not separate URLs and
 * deliberately stay out — a sitemap lists documents, not anchors. Add real
 * routes here as /contact and /work come into existence.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
