import { NextResponse } from "next/server";
import { z } from "zod";
import { createCheckoutSession, launchIsLive, stripeConfigured, type Plan } from "@/lib/stripe";

const bodySchema = z.object({
  plan: z.enum(["basic", "pro", "elite"]),
  email: z.string().email().optional(),
});

export async function POST(request: Request) {
  // Membership opens when the app drops. Until then the hook is live but gated.
  if (!launchIsLive()) {
    return NextResponse.json(
      {
        ok: false,
        error: "not_launched",
        message: "Članstvo se odpre ob lansiranju. Pridruži se waitlistu in obvestimo te.",
      },
      { status: 503 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Neveljaven request body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Neveljaven plan" },
      { status: 400 }
    );
  }

  const plan = parsed.data.plan as Plan;
  if (!stripeConfigured(plan)) {
    return NextResponse.json({ ok: false, error: "stripe_not_configured" }, { status: 500 });
  }

  try {
    const { url } = await createCheckoutSession(plan, { email: parsed.data.email });
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "checkout_failed" },
      { status: 500 }
    );
  }
}
