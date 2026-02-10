"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import {
  getGoogleAnalyticsConfig,
  trackGoogleAnalyticsPageView,
} from "@/lib/analytics/google-analytics";

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { enabled, measurementId } = getGoogleAnalyticsConfig();
  const queryString = searchParams.toString();
  const pagePath = queryString.length > 0 ? `${pathname}?${queryString}` : pathname;

  useEffect(() => {
    if (!enabled || !pagePath) {
      return;
    }

    trackGoogleAnalyticsPageView(pagePath);
  }, [enabled, pagePath]);

  if (!enabled || !measurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
