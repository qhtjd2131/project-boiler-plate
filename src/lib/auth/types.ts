import type { AppResult } from "@/lib/contracts/result";

export type AuthSession = {
  userId: string;
  email: string | null;
};

export type OAuthProvider = "google" | "kakao";

export interface AuthProvider {
  getSession(): Promise<AppResult<AuthSession | null>>;
  signInWithPassword(email: string, password: string): Promise<AppResult<null>>;
  signInWithOAuth(provider: OAuthProvider, redirectTo: string): Promise<AppResult<{ url: string }>>;
  signOut(): Promise<AppResult<null>>;
}
