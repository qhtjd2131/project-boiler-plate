import "server-only";

import { getErrorMessage } from "@/lib/contracts/result";
import { getAuthProfileById } from "@/lib/auth/profiles";
import {
  hasMinimumRole,
  resolveProfileStatus,
  resolveRoleFromProfile,
  type AppRole,
  type ProfileStatus,
} from "@/lib/auth/rbac";
import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server-client";

export type ServerAuthState = {
  configured: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  role: AppRole;
  profileStatus: ProfileStatus | "missing";
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
      profileStatus: "missing",
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
        profileStatus: "missing",
        error: error?.message,
      };
    }

    const profileResult = await getAuthProfileById(client, data.user.id);

    if (!profileResult.ok) {
      return {
        configured: true,
        isAuthenticated: true,
        userId: data.user.id,
        email: data.user.email ?? null,
        role: "guest",
        profileStatus: "missing",
        error: profileResult.error.message,
      };
    }

    if (!profileResult.data) {
      return {
        configured: true,
        isAuthenticated: true,
        userId: data.user.id,
        email: data.user.email ?? null,
        role: "guest",
        profileStatus: "missing",
        error: "Profile record is missing",
      };
    }

    const profileStatus = resolveProfileStatus(profileResult.data.status);
    const role =
      profileStatus === "blocked" ? "guest" : resolveRoleFromProfile(profileResult.data.role);

    return {
      configured: true,
      isAuthenticated: true,
      userId: data.user.id,
      email: data.user.email ?? null,
      role,
      profileStatus,
    };
  } catch (error) {
    return {
      configured: true,
      isAuthenticated: false,
      userId: null,
      email: null,
      role: "guest",
      profileStatus: "missing",
      error: getErrorMessage(error),
    };
  }
}

export function canAccessRole(currentRole: AppRole, requiredRole: AppRole): boolean {
  return hasMinimumRole(currentRole, requiredRole);
}
