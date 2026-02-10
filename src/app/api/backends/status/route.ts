import { NextResponse } from "next/server";

import { getBackendStatus } from "@/lib/backend/server-config";
import { resultOk } from "@/lib/contracts/result";

export async function GET() {
  const status = getBackendStatus();
  return NextResponse.json(resultOk(status, status.activeSource));
}
