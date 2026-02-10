import "server-only";

import {
  createDirectus,
  createItem,
  readItems,
  rest,
  staticToken,
  type RestClient,
  type StaticTokenClient,
} from "@directus/sdk";

import type { BriefRepository } from "@/lib/backend/brief-repository";
import type { ProjectBrief } from "@/lib/backend/project-brief";
import { getErrorMessage, resultErr, resultOk } from "@/lib/contracts/result";
import { getServerEnv } from "@/lib/env/server";

type DirectusBriefRecord = {
  id: string | number;
  title: string;
  summary: string;
  date_created?: string;
  date_updated?: string;
};

type DirectusSchema = {
  [collectionName: string]: DirectusBriefRecord[];
};

function createDirectusClient() {
  const env = getServerEnv();

  if (!env.DIRECTUS_URL || !env.DIRECTUS_TOKEN) {
    return null;
  }

  return createDirectus<DirectusSchema>(env.DIRECTUS_URL)
    .with(staticToken(env.DIRECTUS_TOKEN))
    .with(rest()) as ReturnType<typeof createDirectus<DirectusSchema>> &
    StaticTokenClient<DirectusSchema> &
    RestClient<DirectusSchema>;
}

function mapDirectusRecord(record: DirectusBriefRecord): ProjectBrief {
  const now = new Date().toISOString();

  return {
    id: String(record.id),
    title: record.title,
    summary: record.summary,
    createdAt: record.date_created ?? now,
    updatedAt: record.date_updated ?? record.date_created ?? now,
    source: "directus",
  };
}

export function createDirectusBriefRepository(): BriefRepository {
  return {
    async list() {
      const env = getServerEnv();
      const client = createDirectusClient();

      if (!client) {
        return resultErr("NOT_CONFIGURED", "Directus is enabled but not configured");
      }

      try {
        const records = (await client.request(
          readItems(env.DIRECTUS_COLLECTION, {
            fields: ["id", "title", "summary", "date_created", "date_updated"],
            sort: ["-date_created"],
            limit: 20,
          }),
        )) as DirectusBriefRecord[];

        return resultOk(records.map(mapDirectusRecord), "directus");
      } catch (error) {
        return resultErr(
          "INTERNAL",
          "Failed to fetch briefs from Directus",
          getErrorMessage(error),
        );
      }
    },

    async create(input) {
      const env = getServerEnv();
      const client = createDirectusClient();

      if (!client) {
        return resultErr("NOT_CONFIGURED", "Directus is enabled but not configured");
      }

      try {
        const created = (await client.request(
          createItem(env.DIRECTUS_COLLECTION, {
            title: input.title,
            summary: input.summary,
          }),
        )) as DirectusBriefRecord;

        return resultOk(mapDirectusRecord(created), "directus");
      } catch (error) {
        return resultErr("INTERNAL", "Failed to create brief in Directus", getErrorMessage(error));
      }
    },
  };
}
