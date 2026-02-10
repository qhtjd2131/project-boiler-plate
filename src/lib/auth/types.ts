import type { AppResult } from "@/lib/contracts/result";

export type AuthSession = {
  userId: string;
  email: string | null;
};

export interface AuthProvider {
  getSession(): Promise<AppResult<AuthSession | null>>;
  signInWithOtp(email: string, emailRedirectTo?: string): Promise<AppResult<null>>;
  signOut(): Promise<AppResult<null>>;
}
