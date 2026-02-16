import type { DataSource } from "@/lib/contracts/result";

export type OperationalBackend = "supabase";
export type ContentBackend = "sanity";

export type BackendStatus = {
  operationalSource: DataSource;
  contentSource: DataSource;
  enabled: {
    supabase: boolean;
    sanity: boolean;
    auth: boolean;
  };
  configured: {
    supabase: boolean;
    sanity: boolean;
    auth: boolean;
  };
};
