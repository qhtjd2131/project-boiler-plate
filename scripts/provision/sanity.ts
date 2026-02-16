import "dotenv/config";

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-16";
const apiToken = process.env.SANITY_API_TOKEN;

async function main() {
  if (!projectId || !dataset) {
    throw new Error(
      "Missing Sanity config. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.",
    );
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token: apiToken || undefined,
    useCdn: false,
    perspective: "published",
  });

  const result = await client.fetch<{ total: number }>("{ 'total': count(*[_type match '*']) }");

  console.log(`[sanity] Connection verified for project ${projectId}/${dataset}`);
  console.log(`[sanity] Published document count: ${result.total}`);
  console.log("[sanity] Public content CMS integration is ready.");
}

main().catch((error) => {
  console.error("[sanity] Validation failed:", error.message);
  process.exit(1);
});
