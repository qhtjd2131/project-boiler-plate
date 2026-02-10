import "server-only";

import { getErrorMessage } from "@/lib/contracts/result";
import { hasMinimumRole, resolveRoleFromUser, type AppRole } from "@/lib/auth/rbac";
import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server-client";

export type ServerAuthState = {
  configured: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  role: AppRole;
  error?: string;
};

export async function getServerAuthState(): Promise<ServerAuthState> {
  const client = await getSupabaseAuthServerClient();

  if (!client) {
    return {
      configured: false,
      isAuthenticated: false,
      userId: null,
      email: null,
      role: "guest",
    };
  }

  try {
    const { data, error } = await client.auth.getUser();

    if (error || !data.user) {
      return {
        configured: true,
        isAuthenticated: false,
        userId: null,
        email: null,
        role: "guest",
        error: error?.message,
      };
    }

    return {
      configured: true,
      isAuthenticated: true,
      userId: data.user.id,
      email: data.user.email ?? null,
      role: resolveRoleFromUser(data.user),
    };
  } catch (error) {
    return {
      configured: true,
      isAuthenticated: false,
      userId: null,
      email: null,
      role: "guest",
      error: getErrorMessage(error),
    };
  }
}

export function canAccessRole(currentRole: AppRole, requiredRole: AppRole): boolean {
  return hasMinimumRole(currentRole, requiredRole);
}
