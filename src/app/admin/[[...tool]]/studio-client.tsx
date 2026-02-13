"use client";

import { NextStudio } from "next-sanity/studio";

import { getSanityStudioConfig } from "@/lib/sanity/studio-config";

export function SanityStudioClient() {
  const config = getSanityStudioConfig();

  if (!config) {
    return null;
  }

  return <NextStudio config={config} />;
}
