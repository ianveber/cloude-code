import { NextRequest, NextResponse } from "next/server";
import { runFilter } from "@/lib/claude-server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json(await runFilter(body));
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
