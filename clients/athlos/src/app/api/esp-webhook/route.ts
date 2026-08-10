import { NextResponse } from "next/server";
import { updateStatusInSheet, sheetConfigured } from "@/lib/sheets";

// Beehiiv webhook receiver. Wire a "subscription.confirmed" webhook in Beehiiv
// pointing at:  https://<your-app>/api/esp-webhook?secret=YOUR_SECRET
// and set BEEHIIV_WEBHOOK_SECRET to the same value.
//
// On confirmation (double opt-in completed → status "active"), this flips the
// matching Google Sheet row from "pending" to "confirmed".
//
// Beehiiv payload shape (per their docs):
//   { uid, event_timestamp, event_type, data: { email, status, ... } }

type BeehiivWebhook = {
  event_type?: string;
  type?: string;
  email?: string;
  status?: string;
  data?: { email?: string; status?: string };
};

export async function POST(request: Request) {
  // Beehiiv has no documented signature, so gate on a secret in the URL
  // (?secret=...) or an x-webhook-secret header. If no secret is configured,
  // the check is skipped (handy for local testing).
  const expected = process.env.BEEHIIV_WEBHOOK_SECRET;
  if (expected) {
    const got =
      new URL(request.url).searchParams.get("secret") ??
      request.headers.get("x-webhook-secret");
    if (got !== expected) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  let body: BeehiivWebhook;
  try {
    body = (await request.json()) as BeehiivWebhook;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const eventType = body.event_type ?? body.type ?? "";
  const email = body.data?.email ?? body.email;
  const status = body.data?.status ?? body.status ?? "";

  if (!email) {
    return NextResponse.json({ ok: true, ignored: "no_email" });
  }

  // We care about confirmations (double opt-in completed → "active").
  const isConfirmed = eventType.includes("confirm") || status === "active";
  const newStatus = isConfirmed ? "confirmed" : status || eventType || "updated";

  if (sheetConfigured()) {
    const r = await updateStatusInSheet(email, newStatus);
    if (!r.ok) console.error("[esp-webhook] sheet status update failed:", r.error);
  }

  return NextResponse.json({ ok: true, email, status: newStatus });
}
