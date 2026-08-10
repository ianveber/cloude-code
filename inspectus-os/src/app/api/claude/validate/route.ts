import { NextRequest, NextResponse } from "next/server";
import { runValidate } from "@/lib/claude-server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json(await runValidate(body));
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
