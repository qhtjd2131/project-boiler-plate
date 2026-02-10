import type { DataSource } from "@/lib/contracts/result";

export type BackendName = "supabase" | "directus";

export type BackendStatus = {
  primaryBackend: BackendName;
  activeSource: DataSource;
  enabled: Record<BackendName, boolean>;
  configured: Record<BackendName, boolean>;
};
