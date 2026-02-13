import type { User } from "@supabase/supabase-js";

import { stripLocaleFromPathname } from "@/lib/i18n/config";
import { getSanityStudioPath } from "@/lib/sanity/studio-path";

export type AppRole = "guest" | "member" | "editor" | "admin";

const ROLE_PRIORITY: Record<AppRole, number> = {
  guest: 0,
  member: 1,
  editor: 2,
  admin: 3,
};

function isAppRole(value: unknown): value is AppRole {
  return value === "guest" || value === "member" || value === "editor" || value === "admin";
}

export function resolveRoleFromUser(user: User | null): AppRole {
  if (!user) {
    return "guest";
  }

  const candidate =
    user.app_metadata?.role ?? user.user_metadata?.role ?? user.app_metadata?.app_role ?? "member";

  return isAppRole(candidate) ? candidate : "member";
}

export function hasMinimumRole(currentRole: AppRole, requiredRole: AppRole): boolean {
  return ROLE_PRIORITY[currentRole] >= ROLE_PRIORITY[requiredRole];
}

export type RouteAccessRule = {
  prefix: string;
  minRole: AppRole;
};

export const ROUTE_ACCESS_RULES: RouteAccessRule[] = [
  { prefix: "/app", minRole: "member" },
  { prefix: "/api/private", minRole: "member" },
  { prefix: "/api/admin", minRole: "admin" },
];

function getRouteAccessRules(): RouteAccessRule[] {
  const studioPath = getSanityStudioPath();

  return studioPath === "/admin"
    ? [...ROUTE_ACCESS_RULES, { prefix: "/admin", minRole: "admin" }]
    : [
        ...ROUTE_ACCESS_RULES,
        { prefix: "/admin", minRole: "admin" },
        { prefix: studioPath, minRole: "admin" },
      ];
}

export function findRouteAccessRule(pathname: string): RouteAccessRule | null {
  const normalizedPathname = stripLocaleFromPathname(pathname);

  for (const rule of getRouteAccessRules()) {
    if (normalizedPathname === rule.prefix || normalizedPathname.startsWith(`${rule.prefix}/`)) {
      return rule;
    }
  }

  return null;
}
