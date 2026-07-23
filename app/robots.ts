import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/*
 * robots.txt, generated. Everything is crawlable — this is a public marketing
 * page — and the sitemap is advertised so crawlers find the canonical URL set
 * without guessing.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
