import { NextRequest, NextResponse } from "next/server";
import { runVinExtract, type VinImage, type VinError } from "@/lib/claude-server";

export const runtime = "nodejs";
export const maxDuration = 60;

// When several photos fail, report the most actionable reason first so the UI
// shows "out of credits" / "bad key" rather than a generic "some failed".
function pickApiError(errors: VinError[]): VinError | null {
  if (!errors.length) return null;
  const order: VinError[] = ["credits", "auth", "no_api_key", "rate_limit", "network", "api"];
  for (const e of order) if (errors.includes(e)) return e;
  return errors[0];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { images?: VinImage[] };
    const images = (body.images ?? []).slice(0, 40); // demo cap
    const results: { id: string; vin: string }[] = [];
    const errors: VinError[] = [];
    const CONC = 4;
    for (let i = 0; i < images.length; i += CONC) {
      const batch = images.slice(i, i + CONC);
      const settled = await Promise.all(batch.map(runVinExtract));
      for (const res of settled) {
        if (res.error) errors.push(res.error);
        results.push({ id: res.id, vin: res.vin });
      }
    }
    // apiError is non-null when at least one call failed at the AI layer (not just
    // "no VIN in the photo") — lets the client tell an outage apart from a clean miss.
    return NextResponse.json({ results, apiError: pickApiError(errors) });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg, apiError: "api" }, { status: 500 });
  }
}
