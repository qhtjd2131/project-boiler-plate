import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { localizePathname } from "@/lib/i18n/config";
import { negotiateLocaleFromAcceptLanguage } from "@/lib/i18n/negotiation";

export default async function Home() {
  const headerStore = await headers();
  const locale = negotiateLocaleFromAcceptLanguage(headerStore.get("accept-language"));

  redirect(localizePathname("/", locale));
}
