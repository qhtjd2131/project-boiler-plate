import { getPublicEnv } from "@/lib/env/public";

type GoogleAnalyticsParamValue = string | number | boolean | null | undefined;

export type GoogleAnalyticsEventParams = Record<string, GoogleAnalyticsParamValue>;

export type GoogleAnalyticsConfig = {
  enabled: boolean;
  measurementId: string | null;
};

type GtagFn = (
  command: "js" | "config" | "event",
  target: Date | string,
  params?: GoogleAnalyticsEventParams,
) => void;

function readConfig(): GoogleAnalyticsConfig {
  const env = getPublicEnv();
  const measurementId = env.NEXT_PUBLIC_GA_MEASUREMENT_ID.trim();

  return {
    enabled:
      env.NEXT_PUBLIC_ENABLE_GOOGLE_ANALYTICS === "true" && measurementId.length > 0,
    measurementId: measurementId.length > 0 ? measurementId : null,
  };
}

function getGtag(): GtagFn | null {
  if (typeof window === "undefined") {
    return null;
  }

  const maybeGtag = (window as Window & { gtag?: GtagFn }).gtag;

  return typeof maybeGtag === "function" ? maybeGtag : null;
}

export function getGoogleAnalyticsConfig(): GoogleAnalyticsConfig {
  return readConfig();
}

export function trackGoogleAnalyticsEvent(
  eventName: string,
  params: GoogleAnalyticsEventParams = {},
): void {
  if (!readConfig().enabled) {
    return;
  }

  const gtag = getGtag();

  if (!gtag) {
    return;
  }

  gtag("event", eventName, params);
}

export function trackGoogleAnalyticsPageView(pagePath: string): void {
  trackGoogleAnalyticsEvent("page_view", {
    page_path: pagePath,
    page_title: typeof document === "undefined" ? undefined : document.title,
  });
}
