import "server-only";

import type { BriefRepository } from "@/lib/backend/brief-repository";
import type { ProjectBrief } from "@/lib/backend/project-brief";
import { resultOk } from "@/lib/contracts/result";

const memoryStore: ProjectBrief[] = [];

export function createMockBriefRepository(): BriefRepository {
  return {
    async list() {
      return resultOk(
        [...memoryStore].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        "none",
      );
    },
    async create(input) {
      const now = new Date().toISOString();
      const brief: ProjectBrief = {
        id: crypto.randomUUID(),
        title: input.title,
        summary: input.summary,
        createdAt: now,
        updatedAt: now,
        source: "none",
      };

      memoryStore.unshift(brief);
      return resultOk(brief, "none");
    },
  };
}
