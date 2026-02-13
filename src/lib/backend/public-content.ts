import { z } from "zod";

export const publicContentItemSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  publishedAt: z.string(),
});

export type PublicContentItem = z.infer<typeof publicContentItemSchema>;
