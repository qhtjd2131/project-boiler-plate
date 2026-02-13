import { NextResponse } from "next/server";

import { listSanityPublicContent } from "@/lib/backend/sanity-content-repository";

export async function GET() {
  const result = await listSanityPublicContent();

  return NextResponse.json(result, {
    status: result.ok ? 200 : 400,
  });
}
