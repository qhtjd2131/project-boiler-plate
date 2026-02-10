"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

import { getPublicAnalyticsFlags } from "@/lib/env/public";
import { trackPageView } from "@/lib/analytics/google-analytics";

export function GoogleAnalyticsProvider() {
  const pathname = usePathname();
  const analyticsFlags = getPublicAnalyticsFlags();

  const isEnabled = analyticsFlags.enableGa && Boolean(analyticsFlags.gaMeasurementId);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    trackPageView(window.location.href);
  }, [isEnabled, pathname]);

  if (!isEnabled) {
    return null;
  }

  return (
    <>
      <Script
        id="ga-script"
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsFlags.gaMeasurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${analyticsFlags.gaMeasurementId}', { send_page_view: false });
          `,
        }}
      />
    </>
  );
}
