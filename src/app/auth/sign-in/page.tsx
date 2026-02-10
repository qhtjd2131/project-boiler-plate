import { redirect } from "next/navigation";

import { DEFAULT_LOCALE, localizePathname } from "@/lib/i18n/config";

export default function SignInRedirectPage() {
  redirect(localizePathname("/auth/sign-in", DEFAULT_LOCALE));
}
