import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isSanityStudioEnabled } from "@/lib/sanity/studio-config";

import { SanityStudioClient } from "./studio-client";

export const metadata: Metadata = {
  title: "Sanity Studio",
  description: "Internal Sanity Studio route",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminStudioPage() {
  if (!isSanityStudioEnabled()) {
    notFound();
  }

  return <SanityStudioClient />;
}
