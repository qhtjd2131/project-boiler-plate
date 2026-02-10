import "server-only";

import type { BriefRepository } from "@/lib/backend/brief-repository";
import type { ProjectBrief } from "@/lib/backend/project-brief";
import { getErrorMessage, resultErr, resultOk } from "@/lib/contracts/result";
import { getSupabaseServerClient } from "@/lib/supabase/server-client";

const TABLE_NAME = "project_briefs";

type SupabaseBriefRow = {
  id: string | number;
  title: string;
  summary: string;
  created_at: string | null;
  updated_at: string | null;
};

function mapSupabaseRow(row: SupabaseBriefRow): ProjectBrief {
  const now = new Date().toISOString();

  return {
    id: String(row.id),
    title: row.title,
    summary: row.summary,
    createdAt: row.created_at ?? now,
    updatedAt: row.updated_at ?? row.created_at ?? now,
    source: "supabase",
  };
}

export function createSupabaseBriefRepository(): BriefRepository {
  return {
    async list() {
      const client = getSupabaseServerClient();

      if (!client) {
        return resultErr("NOT_CONFIGURED", "Supabase is enabled but not configured");
      }

      try {
        const { data, error } = await client
          .from(TABLE_NAME)
          .select("id,title,summary,created_at,updated_at")
          .order("created_at", { ascending: false })
          .limit(20);

        if (error) {
          return resultErr("INTERNAL", "Failed to fetch briefs from Supabase", error.message);
        }

        return resultOk(
          (data ?? []).map((item) => mapSupabaseRow(item as SupabaseBriefRow)),
          "supabase",
        );
      } catch (error) {
        return resultErr("INTERNAL", "Supabase query failed", getErrorMessage(error));
      }
    },

    async create(input) {
      const client = getSupabaseServerClient();

      if (!client) {
        return resultErr("NOT_CONFIGURED", "Supabase is enabled but not configured");
      }

      try {
        const { data, error } = await client
          .from(TABLE_NAME)
          .insert({
            title: input.title,
            summary: input.summary,
          })
          .select("id,title,summary,created_at,updated_at")
          .single();

        if (error) {
          return resultErr("INTERNAL", "Failed to create brief in Supabase", error.message);
        }

        return resultOk(mapSupabaseRow(data as SupabaseBriefRow), "supabase");
      } catch (error) {
        return resultErr("INTERNAL", "Supabase insert failed", getErrorMessage(error));
      }
    },
  };
}
