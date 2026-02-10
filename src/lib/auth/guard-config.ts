import { z } from "zod";

const guardConfigSchema = z.object({
  AUTH_GUARD_ENABLED: z.enum(["true", "false"]).default("true"),
  AUTH_SIGN_IN_PATH: z.string().default("/auth/sign-in"),
  AUTH_FORBIDDEN_PATH: z.string().default("/forbidden"),
});

export type AuthGuardConfig = {
  enabled: boolean;
  signInPath: string;
  forbiddenPath: string;
};

let cachedConfig: AuthGuardConfig | null = null;

export function getAuthGuardConfig(): AuthGuardConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const parsed = guardConfigSchema.parse({
    AUTH_GUARD_ENABLED: process.env.AUTH_GUARD_ENABLED,
    AUTH_SIGN_IN_PATH: process.env.AUTH_SIGN_IN_PATH,
    AUTH_FORBIDDEN_PATH: process.env.AUTH_FORBIDDEN_PATH,
  });

  cachedConfig = {
    enabled: parsed.AUTH_GUARD_ENABLED === "true",
    signInPath: parsed.AUTH_SIGN_IN_PATH,
    forbiddenPath: parsed.AUTH_FORBIDDEN_PATH,
  };

  return cachedConfig;
}
