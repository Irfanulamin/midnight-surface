"use client";

import { useEffect } from "react";

import {
  CAMPAIGN_ROUTES,
  CONVERSION_ROUTES,
  appendCampaign,
  captureCampaign,
  trackLead,
} from "@/lib/analytics";

/*
 * Campaign attribution, client side. Two jobs, no UI:
 *
 *   1. On landing, capture utm_* / gclid / fbclid from the URL into
 *      sessionStorage (first-touch), so the source survives in-page navigation.
 *   2. A single delegated, capture-phase click listener decorates internal CTA
 *      links (/contact, /work) with those params so attribution rides the click,
 *      and fires a lead conversion on the conversion routes.
 *
 * Capture phase is deliberate: it runs before next/link's own bubble-phase
 * click handler reads the anchor's href, so the decorated href is the one Link
 * navigates to. One document listener keeps this out of every CTA component —
 * the server-rendered <Link>s need no per-instance wiring.
 */
export function CampaignTracker() {
  useEffect(() => {
    captureCampaign(window.location.search);

    const onClick = (event: MouseEvent) => {
      // Only plain left-clicks — let modified clicks (new tab, etc.) pass.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;

      // Same-origin internal links only.
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/")) return;

      const path = href.split("?")[0].split("#")[0];

      if (CAMPAIGN_ROUTES.includes(path)) {
        anchor.setAttribute("href", appendCampaign(href));
      }
      if (CONVERSION_ROUTES.includes(path)) {
        trackLead({ cta_href: path });
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
