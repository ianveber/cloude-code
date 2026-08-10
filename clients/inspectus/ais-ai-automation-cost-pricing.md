# AIS — AI Automation Cost & Pricing

**Prepared for:** INSPECTUS d.o.o.
**Prepared by:** AIS — AI-native automation company
**Scope:** What the AI inside your automations actually costs to run, and how AIS bills it.
**Date:** June 2026 · **Version:** 1.1 · **Pricing basis:** Claude Opus 4.7

---

## 1. Purpose

This document gives INSPECTUS full visibility into the AI usage behind your automations — what a single report costs, what a month costs, and exactly where the line between *raw provider cost* and *AIS's managed rate* sits. Nothing here is hidden: the provider rates are public and verifiable, and our margin is shown as a separate, transparent line.

The short version: **the AI tokens themselves are cheap — cents, about a dime, per report.** The value (and the cost worth managing) is in building the automation, hosting it, keeping the prompts accurate, and monitoring spend so it never surprises you.

All figures below are priced on **Claude Opus 4.7** — the top reasoning tier — for maximum quality and headroom.

---

## 2. How AI is priced — cost per token

AI models bill per **token** (≈ ¾ of a word; ~4 characters). You pay separately for **input** (what goes in — your data + instructions) and **output** (what the model writes back). Output is ~5× the price of input.

Anthropic's published rates (USD), with EUR shown at €1.00 = $1.08:

| Model | Input /1M tok | Output /1M tok | Input /1K tok | Output /1K tok | Best for |
|---|---|---|---|---|---|
| Claude Haiku 4.5 | $1.00 · €0.93 | $5.00 · €4.63 | $0.0010 | $0.0050 | High-volume classify / route / extract |
| Claude Sonnet 4.6 | $3.00 · €2.78 | $15.00 · €13.89 | $0.0030 | $0.0150 | Mid-tier validation & summaries |
| **Claude Opus 4.7** *(your stack)* | **$5.00 · €4.63** | **$25.00 · €23.15** | **$0.0050** | **$0.0250** | Top reasoning — validation, synthesis, agentic |

**Per single token** (for reference): Opus 4.7 input = **$0.000005**, output = **$0.000025**.

### Three levers that cut the bill (already partly in use on your build)

| Lever | Effect | Status on INSPECTUS |
|---|---|---|
| **Prompt caching** | Re-used context (your knowledge base + instructions) billed at **~10%** of normal after the first call | ✅ **Already enabled** on every call |
| **Batch processing** | Non-urgent jobs run at **−50%** | Available for bulk back-processing |
| **Model right-sizing** | Priced here on Opus 4.7 for top quality; trivial sub-tasks can be routed to Sonnet/Haiku to cut cost by 40–80% | Optional optimization |

---

## 3. INSPECTUS — what the VLDR automation actually costs

Your vehicle-damage (VLDR) pipeline runs **three AI operations**, all on Opus 4.7 with caching on:

| Operation | What it does | Output cap | Fires |
|---|---|---|---|
| **Validate** | Audits damage rows for inconsistent AIAG-ECG codes / class mismatches | ≤ 3,000 tok | Once per report |
| **Summarize** | Writes the 4–6 sentence professional report summary | ≤ 600 tok | Once per report |
| **Filter** | Turns a Slovene question into a data filter | ≤ 400 tok | On demand, per query |

### Cost of a typical report (~150 damage rows, validate + summary + a couple of filter queries)

| Component | Input tok | Output tok | Cost (USD) |
|---|---|---|---|
| Validate (data is the bulk) | ~12,000 | ~1,200 | $0.090 |
| Summarize | ~3,300 | ~450 | $0.028 |
| Filter × 2 (mostly cached) | ~5,700 | ~160 | $0.007 |
| Caching credit (repeat context @ ~10%) | — | — | −$0.025 |
| **Total per report** | | | **≈ $0.10 · €0.09** |

**Range:** small report **~€0.07** · large report at the 200-row cap with heavy filtering **~€0.20**.
Put differently: **~€90 of raw tokens per 1,000 reports**, or **~€0.0007 per vehicle damage row.**

### Monthly raw token cost by volume (Opus 4.7, caching on)

| Reports / month | Raw AI cost |
|---|---|
| 100 | ~€10 |
| 300 | ~€28 |
| 600 | ~€55 |
| 1,000 | ~€92 |

> These are genuine provider costs — what Anthropic charges, before AIS's managed rate in §5.

---

## 4. General business automation — what regular workloads cost

For reference beyond VLDR, here's what common automation building-blocks cost per run, priced on Opus 4.7:

| Automation type | Input tok | Output tok | Cost / run |
|---|---|---|---|
| Classify / route / tag an item | ~3,000 | ~400 | ~$0.025 · €0.023 *(~€0.005 on Haiku)* |
| Document / data validation *(VLDR-class)* | ~12,000 | ~1,500 | ~$0.10 · €0.09 |
| Daily multi-source briefing (email + tasks + calendar → report) | ~60,000 | ~4,000 | ~$0.40 · €0.37 |
| Long agentic / research run (multi-step + tools) | ~250,000* | ~15,000 | ~$1.6 · €1.5 |

\* cumulative across the run's steps.

**What a full-business-automation client typically spends per month (raw tokens, Opus 4.7):**

| Workload | Monthly raw cost |
|---|---|
| 1× daily briefing (30 days) | ~€11 |
| ~300 document validations | ~€28 |
| Ad-hoc chat / filter / extraction | ~€8 |
| **Typical total** | **~€45–50 / month** |
| Heavy (continuous Opus + agentic workflows) | up to ~€300 / month |

The headline holds across the board: **everyday business automation on Opus 4.7 runs in the low tens of euros a month** — into the low hundreds only under heavy, continuous agentic load.

---

## 5. AIS managed pricing

Token cost is a pass-through; what you're actually buying is a **running, maintained, monitored automation**. We price that as a clean **per-report rate** with the token cost already inside it — so your bill is predictable and you never touch a provider invoice.

### Recommended: per-report managed rate

| Line | Rate | Notes |
|---|---|---|
| **AI processing — per report** | **€0.45 / report** | Includes validation + summary + unlimited filter queries + Opus 4.7 token cost + monitoring |
| **Platform minimum** | **€49 / month** | Applies only if usage falls below the minimum; covers hosting + uptime + prompt upkeep |
| Token usage | *included* | No separate provider bill — we absorb and manage it |

**Worked example at 300 reports/month:** €135/month all-in. (Underlying raw tokens ≈ €28; the balance covers hosting, prompt accuracy as your code sets evolve, monitoring, spend alerts, and support.)

### Margin is your dial — pick the rate that fits

The per-report rate is the only number to tune. Raw cost on Opus 4.7 is **~€0.09/report**; here's how each option lands:

| Per-report rate | Margin over tokens | 300 reports/mo | Positioning |
|---|---|---|---|
| €0.30 | ~3× | €90/mo | Lean / volume |
| **€0.45** *(recommended)* | ~5× | €135/mo | Balanced, easy to approve |
| €0.65 | ~7× | €195/mo | Premium / SLA-backed |

Even at €0.65, the client is approving well under a euro per report — trivially affordable for the value, while giving AIS a healthy managed-services margin. That's the "realistic but profitable" zone.

### Alternative billing models (if you'd prefer)

- **Cost-plus pass-through:** Opus 4.7 tokens at published rates **+ 40% handling** + a flat **€149/mo** managed retainer. Maximum transparency; better when volume is spiky.
- **Flat monthly:** fixed **€249–449/mo** for an agreed report ceiling. Best when INSPECTUS wants one predictable number.

---

## 6. Assumptions & notes

- **Pricing basis is Claude Opus 4.7** (top reasoning tier), $5 / $25 per 1M input / output tokens.
- **Token counts are realistic estimates** from your actual prompts and pipeline code, not list figures. Actuals vary with report size and how many filter queries are run.
- **FX:** €1.00 = $1.08 (indicative; provider bills in USD).
- **Caching** is implemented and assumed active; a cold first call each session costs marginally more (negligible at volume).
- **Rates current as of June 2026.** Anthropic occasionally adjusts model pricing; we pass changes through transparently and re-issue this sheet.
- Figures cover **AI usage only** — one-time automation build and any integrations are quoted separately in the SOW.

---

*Questions on any line item? AIS will walk through the math live — every number here is reproducible from public rates and your own pipeline.*
