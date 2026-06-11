// Membership checkout — wired but LAUNCH-GATED.
//
// "Buy the membership" happens after the app drops. Until LAUNCH_MODE === "live"
// the /api/checkout route refuses politely (503). At launch:
//   1. Create the Products/Prices in Stripe Dashboard
//   2. Fill STRIPE_PRICE_BASIC / _PRO / _ELITE in .env.local
//   3. Set LAUNCH_MODE=live
//   4. (recommended) add a /api/stripe/webhook handler to sync subscriptions
//
// SERVER-ONLY.

import Stripe from "stripe";

export type Plan = "basic" | "pro" | "elite";

const PRICE_ENV: Record<Plan, string> = {
  basic: "STRIPE_PRICE_BASIC",
  pro: "STRIPE_PRICE_PRO",
  elite: "STRIPE_PRICE_ELITE",
};

export function launchIsLive(): boolean {
  return process.env.LAUNCH_MODE === "live";
}

export function stripeConfigured(plan: Plan): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env[PRICE_ENV[plan]]);
}

export async function createCheckoutSession(
  plan: Plan,
  opts: { email?: string } = {}
): Promise<{ url: string }> {
  const secret = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env[PRICE_ENV[plan]];
  if (!secret || !priceId) throw new Error(`Stripe not configured for plan "${plan}"`);

  const stripe = new Stripe(secret);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: opts.email,
    success_url: `${appUrl}/app?checkout=success`,
    cancel_url: `${appUrl}/?checkout=cancelled`,
    allow_promotion_codes: true,
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  return { url: session.url };
}
