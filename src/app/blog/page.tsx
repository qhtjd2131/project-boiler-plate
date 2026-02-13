import { redirect } from "next/navigation";

import { DEFAULT_LOCALE, localizePathname } from "@/lib/i18n/config";

export default function BlogRedirectPage() {
  redirect(localizePathname("/blog", DEFAULT_LOCALE));
}
