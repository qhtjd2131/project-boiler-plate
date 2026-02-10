import { redirect } from "next/navigation";

import { DEFAULT_LOCALE, localizePathname } from "@/lib/i18n/config";

type SignInRedirectPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toQueryString(value: Record<string, string | string[] | undefined>): string {
  const params = new URLSearchParams();

  for (const [key, raw] of Object.entries(value)) {
    if (typeof raw === "string") {
      params.set(key, raw);
      continue;
    }

    if (Array.isArray(raw)) {
      for (const item of raw) {
        params.append(key, item);
      }
    }
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

export default async function SignInRedirectPage({ searchParams }: SignInRedirectPageProps) {
  const localizedPath = localizePathname("/auth/sign-in", DEFAULT_LOCALE);
  const queryString = toQueryString(await searchParams);

  redirect(`${localizedPath}${queryString}`);
}
