import "dotenv/config";

import {
  createCollection,
  createDirectus,
  createField,
  readCollections,
  readFieldsByCollection,
  rest,
  staticToken,
  type RestClient,
  type StaticTokenClient,
} from "@directus/sdk";

type DirectusSchema = Record<string, Record<string, unknown>[]>;

function createClient() {
  const directusUrl = process.env.DIRECTUS_URL;
  const directusToken = process.env.DIRECTUS_ADMIN_TOKEN || process.env.DIRECTUS_TOKEN;

  if (!directusUrl) {
    throw new Error("Missing DIRECTUS_URL");
  }

  if (!directusToken) {
    throw new Error(
      "Missing DIRECTUS_ADMIN_TOKEN (or DIRECTUS_TOKEN with schema write permission)",
    );
  }

  return createDirectus<DirectusSchema>(directusUrl)
    .with(staticToken(directusToken))
    .with(rest()) as ReturnType<typeof createDirectus<DirectusSchema>> &
    StaticTokenClient<DirectusSchema> &
    RestClient<DirectusSchema>;
}

async function ensureCollection(client: ReturnType<typeof createClient>, collection: string) {
  const collections = await client.request(readCollections());
  const exists = collections.some((item) => item.collection === collection);

  if (exists) {
    console.log(`[directus] Collection exists: ${collection}`);
    return;
  }

  await client.request(
    createCollection({
      collection,
      meta: {
        icon: "article",
        note: "External delivery briefs",
      },
      schema: {
        name: collection,
      },
    }),
  );

  console.log(`[directus] Collection created: ${collection}`);
}

async function ensureFields(client: ReturnType<typeof createClient>, collection: string) {
  const existingFields = await client.request(readFieldsByCollection(collection));
  const fieldNameSet = new Set(existingFields.map((field) => field.field));

  if (!fieldNameSet.has("title")) {
    await client.request(
      createField(collection, {
        field: "title",
        type: "string",
        meta: {
          interface: "input",
          required: true,
          width: "full",
        },
        schema: {
          is_nullable: false,
          max_length: 120,
        },
      }),
    );
    console.log("[directus] Field created: title");
  }

  if (!fieldNameSet.has("summary")) {
    await client.request(
      createField(collection, {
        field: "summary",
        type: "text",
        meta: {
          interface: "input-multiline",
          required: true,
          width: "full",
        },
        schema: {
          is_nullable: false,
        },
      }),
    );
    console.log("[directus] Field created: summary");
  }
}

async function main() {
  const collection = process.env.DIRECTUS_COLLECTION || "project_briefs";
  const client = createClient();

  await ensureCollection(client, collection);
  await ensureFields(client, collection);

  console.log(`[directus] Provision completed for collection: ${collection}`);
}

main().catch((error) => {
  console.error("[directus] Provision failed:", error.message);
  process.exit(1);
});
