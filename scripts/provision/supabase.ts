import "dotenv/config";

import { Client } from "pg";

const connectionString = process.env.SUPABASE_DB_URL;
const tableName = process.env.SUPABASE_BRIEF_TABLE ?? "project_briefs";

function assertIdentifier(name: string): string {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(`Invalid SQL identifier: ${name}`);
  }

  return name;
}

async function main() {
  if (!connectionString) {
    throw new Error(
      "Missing SUPABASE_DB_URL. Use the Supabase connection string from client project settings.",
    );
  }

  const safeTableName = assertIdentifier(tableName);

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();

  try {
    await client.query("create extension if not exists pgcrypto;");

    await client.query(`
      create table if not exists ${safeTableName} (
        id uuid primary key default gen_random_uuid(),
        title varchar(120) not null,
        summary text not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );
    `);

    await client.query(`
      create index if not exists idx_${safeTableName}_created_at on ${safeTableName} (created_at desc);
    `);

    await client.query(`
      create or replace function set_${safeTableName}_updated_at()
      returns trigger as $$
      begin
        new.updated_at = now();
        return new;
      end;
      $$ language plpgsql;
    `);

    await client.query(`
      drop trigger if exists trg_${safeTableName}_updated_at on ${safeTableName};
    `);

    await client.query(`
      create trigger trg_${safeTableName}_updated_at
      before update on ${safeTableName}
      for each row
      execute function set_${safeTableName}_updated_at();
    `);

    await client.query(`alter table ${safeTableName} enable row level security;`);

    console.log(`[supabase] Provision completed for table: ${safeTableName}`);
    console.log(
      "[supabase] Next step: configure RLS policies if anon/authenticated direct access is required.",
    );
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("[supabase] Provision failed:", error.message);
  process.exit(1);
});
