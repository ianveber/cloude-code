// Email Service Provider (newsletter tool) integration.
// Default provider: Beehiiv. ConvertKit/Kit supported via ESP_PROVIDER=convertkit.
//
// SERVER-ONLY — never import this into a client component (it reads secret keys).
//
// `subscribe()` adds a contact with double opt-in forced ON, so the provider
// sends the confirmation email and the contact stays "pending" until they click
// it. That confirmation is what starts the weekly promo automation, and it's
// what makes the signup GDPR-compliant.

type SubscribeInput = {
  email: string;
  source?: string | null;
  sport?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  referringSite?: string | null;
};

export type SubscribeResult =
  | { ok: true; configured: false } // provider not configured (dev/demo) — skipped
  | { ok: true; configured: true; status: string } // status: pending | active | validating
  | { ok: false; configured: true; error: string };

const PROVIDER = (process.env.ESP_PROVIDER ?? "beehiiv").toLowerCase();

export function espConfigured(): boolean {
  if (PROVIDER === "convertkit") {
    return Boolean(process.env.CONVERTKIT_API_KEY && process.env.CONVERTKIT_FORM_ID);
  }
  return Boolean(process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID);
}

export async function subscribe(input: SubscribeInput): Promise<SubscribeResult> {
  if (!espConfigured()) return { ok: true, configured: false };
  try {
    if (PROVIDER === "convertkit") return await subscribeConvertKit(input);
    return await subscribeBeehiiv(input);
  } catch (err) {
    return {
      ok: false,
      configured: true,
      error: err instanceof Error ? err.message : "ESP request failed",
    };
  }
}

// ---------- Beehiiv ----------
// POST https://api.beehiiv.com/v2/publications/{publicationId}/subscriptions
// Auth: Bearer <api key>. double_opt_override: "on" forces double opt-in.
async function subscribeBeehiiv(input: SubscribeInput): Promise<SubscribeResult> {
  const pubId = process.env.BEEHIIV_PUBLICATION_ID as string;
  const apiKey = process.env.BEEHIIV_API_KEY as string;

  const res = await fetch(`https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      double_opt_override: "on", // GDPR + double opt-in: send confirmation, stay pending
      reactivate_existing: false,
      utm_source: input.utm_source ?? undefined,
      utm_medium: input.utm_medium ?? undefined,
      utm_campaign: input.utm_campaign ?? undefined,
      referring_site: input.referringSite ?? undefined,
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false, configured: true, error: `beehiiv ${res.status}: ${text.slice(0, 300)}` };
  }

  const json = (await res.json().catch(() => ({}))) as { data?: { status?: string } };
  return { ok: true, configured: true, status: json?.data?.status ?? "pending" };
}

// ---------- ConvertKit / Kit ----------
// POST https://api.convertkit.com/v3/forms/{formId}/subscribe
// Double opt-in is governed by the form's opt-in setting in ConvertKit.
async function subscribeConvertKit(input: SubscribeInput): Promise<SubscribeResult> {
  const apiKey = process.env.CONVERTKIT_API_KEY as string;
  const formId = process.env.CONVERTKIT_FORM_ID as string;

  const res = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      email: input.email,
      fields: {
        source: input.source ?? undefined,
        sport: input.sport ?? undefined,
      },
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false, configured: true, error: `convertkit ${res.status}: ${text.slice(0, 300)}` };
  }

  const json = (await res.json().catch(() => ({}))) as {
    subscription?: { state?: string };
  };
  // ConvertKit state is "inactive" until the double opt-in email is confirmed.
  const state = json?.subscription?.state ?? "inactive";
  return { ok: true, configured: true, status: state === "active" ? "active" : "pending" };
}
