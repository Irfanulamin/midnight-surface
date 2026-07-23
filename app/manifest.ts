import type { MetadataRoute } from "next";

import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

/*
 * Web app manifest. Lightweight — this is a marketing site, not an installable
 * app — but it gives the correct name, theme and background colours to any
 * browser that reads it, and satisfies the PWA/installability signals some
 * audits check for. Colours are the page's ink-on-cream brand pairing.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#fbf9f5",
    theme_color: "#fbf9f5",
    icons: [
      {
        src: "/logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
