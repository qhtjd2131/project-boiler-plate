import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";

import { SiteShell } from "@/components/layout/site-shell";
import { QueryProvider } from "@/components/providers/query-provider";
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
  description: "Next.js starter with shadcn/ui, Supabase, Directus, and OpenCode defaults.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${jetBrainsMono.variable} min-h-screen bg-[radial-gradient(circle_at_top_right,_#f4f4f5,_transparent_42%),linear-gradient(180deg,_#fff,_#fafafa)] antialiased`}
      >
        <QueryProvider>
          <SiteShell>{children}</SiteShell>
        </QueryProvider>
      </body>
    </html>
  );
}
