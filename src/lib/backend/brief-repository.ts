import "server-only";

import { createDirectusBriefRepository } from "@/lib/backend/directus-brief-repository";
import { createMockBriefRepository } from "@/lib/backend/mock-brief-repository";
import type { CreateProjectBriefInput, ProjectBrief } from "@/lib/backend/project-brief";
import { createSupabaseBriefRepository } from "@/lib/backend/supabase-brief-repository";
import { getBackendStatus } from "@/lib/backend/server-config";
import type { AppResult } from "@/lib/contracts/result";

export interface BriefRepository {
  list(): Promise<AppResult<ProjectBrief[]>>;
  create(input: CreateProjectBriefInput): Promise<AppResult<ProjectBrief>>;
}

export function resolveBriefRepository(): BriefRepository {
  const status = getBackendStatus();

  if (status.activeSource === "supabase") {
    return createSupabaseBriefRepository();
  }

  if (status.activeSource === "directus") {
    return createDirectusBriefRepository();
  }

  return createMockBriefRepository();
}
