import { z } from "zod";

import type { DataSource } from "@/lib/contracts/result";

export const createProjectBriefSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(80, "Title must be 80 characters or less"),
  summary: z
    .string()
    .trim()
    .min(20, "Summary must be at least 20 characters")
    .max(1200, "Summary must be 1200 characters or less"),
});

export type CreateProjectBriefInput = z.infer<typeof createProjectBriefSchema>;

export type ProjectBrief = {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  source: DataSource;
};
