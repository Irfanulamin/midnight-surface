import Script from "next/script";

import { CONSENT_DEFAULT, GA_ID, hasGoogleTag } from "@/lib/analytics";

/*
 * Google Analytics 4 (the free tier). The paid-ad tags (Google Ads, Meta Pixel)
 * were removed on request.
 *
 * Env-gated: renders nothing unless NEXT_PUBLIC_GA_ID is set, so an empty env
 * loads no third-party script at all. Consent Mode v2 default is pushed BEFORE
 * config() — that ordering is load-bearing: it starts GA in cookieless consent
 * mode instead of setting cookies on the first pageview. `afterInteractive`
 * keeps it off the critical path so it never costs the hero's LCP.
 */
export function Analytics() {
  if (!hasGoogleTag) return null;

  return (
    <>
      <Script
        id="gtag-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', ${JSON.stringify(CONSENT_DEFAULT)});
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
