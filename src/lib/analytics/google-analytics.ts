export type GoogleAnalyticsEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackPageView(url: string): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "page_view", {
    page_location: url,
  });
}

export function trackGoogleAnalyticsEvent(event: GoogleAnalyticsEvent): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", event.action, {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
    non_interaction: event.nonInteraction,
  });
}
