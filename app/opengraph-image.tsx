import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/site";

/*
 * Dynamic Open Graph / social share card, 1200x630.
 *
 * Generated with next/og rather than shipping a static PNG so it always matches
 * the brand and needs no design asset checked in. Flat brand colours only —
 * teal field, cream type, a yellow marker bar — in keeping with the page's
 * no-gradient, no-shadow rule. Next wires this file to `openGraph.images` and
 * `twitter.images` automatically via the file convention.
 */
export const alt = `${SITE_NAME} — websites for small businesses`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1c5a55",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: "-0.01em",
            color: "#f2ede1",
            fontWeight: 600,
          }}
        >
          {SITE_NAME}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 82,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#fbf9f5",
            }}
          >
            Everything your business needs in one website
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              height: 14,
              width: 260,
              backgroundColor: "#ffe273",
              borderRadius: 8,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#f2ede1",
            opacity: 0.9,
          }}
        >
          Free first draft · $0 upfront · Live in 5-7 days · From $399
        </div>
      </div>
    ),
    { ...size },
  );
}
