import { redirect } from "next/navigation";

import { DEFAULT_LOCALE, localizePathname } from "@/lib/i18n/config";

export default function ForbiddenRedirectPage() {
  redirect(localizePathname("/forbidden", DEFAULT_LOCALE));
}
