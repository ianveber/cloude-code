---
name: client-pricing-sheet
description: "How Ian builds client-facing AI cost/pricing sheets. Use this WHENEVER preparing a price quote, cost estimate, cenik, or pricing sheet for an AI app or automation Ian is selling to a client — even if he just says 'make a price sheet' or 'how much should we charge them'. Encodes his fixed rules: price on the premium Opus tier basis (even if the app runs a cheaper model), bill in EUR, deliver in Slovene with native number formatting, keep the margin transparent (raw provider cost + a separate managed rate, never inflated token prices), and render to PDF for WhatsApp. Apply by default so Ian never re-explains his pricing method."
---

# Client AI Pricing Sheet

Ian sells managed AI apps/automations to Slovenian/EU clients (under **AIS**). His pricing sheets follow a consistent method built on one principle: **clients can verify Anthropic's public rates, so a hidden token markup destroys trust.** The margin is real and openly shown as a managed-service line — never smuggled into inflated API prices.

## The rules

**1. Price on the premium Opus tier — as the basis.**
Quote token costs using the latest flagship Opus model's published API pricing, **even when the deployed app actually runs a cheaper model** (e.g. INSPECTUS VLDR runs `claude-sonnet-4-6` but is priced on Opus). This builds in headroom and is the basis Ian explicitly chose — he once corrected a Sonnet-based draft up to Opus.
- **Do not hardcode the rate from memory — verify the current published number.** Consult the `claude-api` skill or anthropic.com/pricing for today's Opus input/output per-1M rates. (Reference point: the last sheet used Opus 4.7 at $5 / $25 per 1M in/out; the current flagship is Opus 4.8 — confirm before quoting.)

**2. Currency: EUR.** Convert USD API costs to euros.

**3. Language: Slovene, with native number formatting.**
Deliver the sheet in Slovene. Decimal **comma**, euro sign after the number with a space: `0,45 €`. Mark prices `brez DDV` (excl. VAT) where relevant.

**4. Transparent margin — show the math.**
Lay it out as: **raw provider cost** (verifiable against Anthropic's rates) **+ a separate managed per-report / per-unit rate**. The managed rate carries the margin (roughly ~5× the raw cost). Never inflate the token prices themselves.

**5. Recommended structure** (reuse from `clients/inspectus/AIS-INSPECTUS-Cenik-AI-SL.md`):
- Per-report rate: **€0,45** recommended (alternatives €0,30 / €0,65).
- Platform minimum: **€49/mo**.
- Show raw cost per report next to the managed rate so the value of the managed layer is obvious.

**6. Output: render to PDF.**
Finish by rendering the Slovene markdown to a clean PDF via the `make-pdf` skill, so Ian can send it directly over WhatsApp.

**7. Branding: AIS.** The sheet ships under AIS, not Veta.

## Why each rule exists
- **Opus basis:** protects margin if usage or model choice changes later, and anchors to the premium tier the client associates with quality.
- **Transparent margin:** the client can (and will) check Anthropic's public pricing. Showing raw cost + open managed rate makes the markup feel earned, not hidden — which is what keeps the trust that wins the deal.
- **Slovene + PDF:** it's a finished, sendable deliverable for a Slovenian client, not an internal estimate.
