import type { Metadata } from "next";
import { headers } from "next/headers";
import { JetBrains_Mono, Manrope } from "next/font/google";

import { SiteShell } from "@/components/layout/site-shell";
import { GoogleAnalyticsProvider } from "@/components/providers/google-analytics-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { DEFAULT_LOCALE, isAppLocale, stripLocaleFromPathname } from "@/lib/i18n/config";
import { getSanityStudioPath } from "@/lib/sanity/studio-path";
import { getSiteUrl } from "@/lib/seo/site-url";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "External Delivery Boilerplate",
    template: "%s | External Delivery Boilerplate",
  },
  description: "Next.js starter with shadcn/ui, Supabase, Sanity, and OpenCode defaults.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-app-pathname") || "/";
  const localeFromHeader = headerStore.get("x-app-locale") || DEFAULT_LOCALE;
  const htmlLang = isAppLocale(localeFromHeader) ? localeFromHeader : DEFAULT_LOCALE;
  const isStudioRoute = isAdminStudioPath(pathname);

  return (
    <html lang={htmlLang}>
      <body
        className={`${manrope.variable} ${jetBrainsMono.variable} min-h-screen bg-[radial-gradient(circle_at_top_right,_#f4f4f5,_transparent_42%),linear-gradient(180deg,_#fff,_#fafafa)] antialiased`}
      >
        <QueryProvider>
          {isStudioRoute ? children : <SiteShell>{children}</SiteShell>}
        </QueryProvider>
        {isStudioRoute ? null : <GoogleAnalyticsProvider />}
      </body>
    </html>
  );
}

function isAdminStudioPath(pathname: string): boolean {
  const basePath = stripLocaleFromPathname(pathname);
  const configuredStudioPath = getSanityStudioPath();

  return (
    basePath === "/admin" ||
    basePath.startsWith("/admin/") ||
    basePath === configuredStudioPath ||
    basePath.startsWith(`${configuredStudioPath}/`)
  );
}
