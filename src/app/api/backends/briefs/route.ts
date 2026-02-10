import { NextResponse } from "next/server";

import { createProjectBriefSchema } from "@/lib/backend/project-brief";
import { resolveBriefRepository } from "@/lib/backend/brief-repository";
import { resultErr } from "@/lib/contracts/result";

export async function GET() {
  const repository = resolveBriefRepository();
  const result = await repository.list();

  return NextResponse.json(result, {
    status: result.ok ? 200 : 400,
  });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = createProjectBriefSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      resultErr("VALIDATION", "Invalid brief payload", parsed.error.issues[0]?.message),
      { status: 400 },
    );
  }

  const repository = resolveBriefRepository();
  const result = await repository.create(parsed.data);

  return NextResponse.json(result, {
    status: result.ok ? 201 : 400,
  });
}
