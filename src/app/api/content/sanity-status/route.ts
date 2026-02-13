import { NextResponse } from "next/server";

import { resultOk } from "@/lib/contracts/result";
import { checkSanityConnection } from "@/lib/sanity/client";
import { getSanityStudioPath } from "@/lib/sanity/studio-path";
import { getSanityStudioUrl } from "@/lib/sanity/studio-url";

export async function GET() {
  const connected = await checkSanityConnection();

  return NextResponse.json(
    resultOk(
      {
        connected,
        studioPath: getSanityStudioPath(),
        studioUrl: getSanityStudioUrl(),
      },
      connected ? "sanity" : "none",
    ),
  );
}
