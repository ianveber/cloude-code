// Mirror each signup into a Google Sheet via an Apps Script Web App webhook.
// This is the at-a-glance list of everyone who registered.
//
// SERVER-ONLY. Best-effort by design: a failure here must NEVER block a signup
// (the contact is already captured in the newsletter tool + Supabase).
//
// Setup: see docs/waitlist-setup.md and scripts/athlos-waitlist-sheet.gs.

type SheetRow = {
  email: string;
  source?: string | null;
  sport?: string | null;
  status: string; // "pending" (double opt-in) | "active" | "demo"
  position?: number | null;
  consent: boolean;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
};

export function sheetConfigured(): boolean {
  return Boolean(process.env.SHEETS_WEBHOOK_URL);
}

export async function appendToSheet(row: SheetRow): Promise<{ ok: boolean; error?: string }> {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) return { ok: false, error: "not_configured" };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.SHEETS_WEBHOOK_SECRET ?? "",
        timestamp: new Date().toISOString(),
        ...row,
      }),
      // Apps Script can be slow on cold start; don't hang the signup request.
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { ok: false, error: `sheet ${res.status}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "sheet request failed" };
  }
}
