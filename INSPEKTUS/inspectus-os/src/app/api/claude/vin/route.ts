import { NextRequest, NextResponse } from "next/server";
import { runVinExtract, type VinImage } from "@/lib/claude-server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { images?: VinImage[] };
    const images = (body.images ?? []).slice(0, 40); // demo cap
    const results: { id: string; vin: string }[] = [];
    const CONC = 4;
    for (let i = 0; i < images.length; i += CONC) {
      const batch = images.slice(i, i + CONC);
      results.push(...await Promise.all(batch.map(runVinExtract)));
    }
    return NextResponse.json({ results });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
