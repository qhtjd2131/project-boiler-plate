import { NextResponse } from "next/server";

import { getBackendStatus } from "@/lib/backend/server-config";
import { resultOk } from "@/lib/contracts/result";

export async function GET() {
  const status = getBackendStatus();
  const metaSource =
    status.operationalSource !== "none" ? status.operationalSource : status.contentSource;

  return NextResponse.json(resultOk(status, metaSource));
}
