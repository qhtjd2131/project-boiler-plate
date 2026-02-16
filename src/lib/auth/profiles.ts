import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import { getErrorMessage, resultErr, resultOk, type AppResult } from "@/lib/contracts/result";

const profileRowSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().nullable(),
  display_name: z.string().nullable(),
  avatar_url: z.string().nullable(),
  role: z.string(),
  status: z.string(),
});

export type AuthProfileRow = z.infer<typeof profileRowSchema>;

export async function getAuthProfileById(
  client: SupabaseClient,
  userId: string,
): Promise<AppResult<AuthProfileRow | null>> {
  try {
    const { data, error } = await client
      .from("profiles")
      .select("id, email, display_name, avatar_url, role, status")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      if (error.code === "PGRST116") {
        return resultOk(null, "supabase");
      }

      return resultErr("INTERNAL", "Failed to read profile from Supabase", error.message);
    }

    if (!data) {
      return resultOk(null, "supabase");
    }

    const parsed = profileRowSchema.safeParse(data);

    if (!parsed.success) {
      return resultErr("INTERNAL", "Profile payload is invalid", parsed.error.message);
    }

    return resultOk(parsed.data, "supabase");
  } catch (error) {
    return resultErr("INTERNAL", "Profile query failed", getErrorMessage(error));
  }
}
