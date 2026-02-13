import { NextResponse } from "next/server";

import { resultOk } from "@/lib/contracts/result";
import { checkSanityConnection } from "@/lib/sanity/client";

export async function GET() {
  const connected = await checkSanityConnection();

  return NextResponse.json(
    resultOk(
      {
        connected,
      },
      connected ? "sanity" : "none",
    ),
  );
}
