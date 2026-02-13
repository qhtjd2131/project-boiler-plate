import { NextResponse } from "next/server";

import { getSanityPublicContentBySlug } from "@/lib/backend/sanity-content-repository";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { slug } = await context.params;
  const result = await getSanityPublicContentBySlug(slug);

  return NextResponse.json(result, {
    status: result.ok ? 200 : result.error.code === "NOT_FOUND" ? 404 : 400,
  });
}
