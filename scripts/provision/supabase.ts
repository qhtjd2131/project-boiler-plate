import "dotenv/config";

import { Client } from "pg";

const connectionString = process.env.SUPABASE_DB_URL;

async function main() {
  if (!connectionString) {
    throw new Error(
      "Missing SUPABASE_DB_URL. Use the Supabase connection string from project settings.",
    );
  }

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();

  try {
    const result = await client.query<{ database_name: string }>(
      "select current_database() as database_name;",
    );

    const databaseName = result.rows[0]?.database_name ?? "unknown";

    console.log("[supabase] Connection check succeeded.");
    console.log(`[supabase] Database: ${databaseName}`);
    console.log("[supabase] No sample table is created by this script.");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("[supabase] Provision failed:", error.message);
  process.exit(1);
});
