# Synthetic Data — Build Before You Touch Real Records

Added 2026-08-09. Slots into `delivery/phases.md` between **Scoping** and **Build**, and gates the onboarding ladder in `agents/work-chart.md`.

---

## The rule

**No agent talks to a real customer, or writes into a real system of record, until it has been run against a synthetic corpus and a synthetic edge-case set.**

Minimum before Week 1 of the onboarding ladder:

| Engagement type | Synthetic volume | Edge cases |
|---|---|---|
| Conversational (Concierge, Closer, support) | 200–500 conversations | 50–100 |
| Document / data pipeline | 200–500 documents across every type in scope | 50–100 |
| Write-through to a system of record | Above, **plus** a full dry-run against a sandbox target | 50–100 |

Below 200 you are not testing, you are demoing. The number isn't arbitrary — it's the point at which the long tail starts showing up, and the long tail is where `docs/positioning.md` says the margin dies.

---

## Why this is doctrine and not a nice-to-have

**1. The research says the data doesn't have to be real.** Smaller models trained on high-quality synthetic data from larger teacher models can outperform models trained on human-labelled real data. Human annotation costs $0.50–$5.00 per complex item, is slow, and carries the annotator's bias. Generated edge cases cost approximately nothing and come perfectly labelled because you generated the label first. *(Source: `intake/2026-08-09/sources/running-ai-native-companies.txt`, "The Synthetic Data Revolution".)*

**2. It is the only way to hit the long tail on purpose.** Product-market fit comes from solving the core 80%. The remaining 20% is a fragmented tail of rare cases, and engineering hours get eaten alive discovering them one angry client email at a time. Synthetic generation lets you *manufacture* the tail on day one instead of meeting it in production.

**3. In a regulated vertical it is also the GDPR answer.** `verticals/document-operations.md` sells into insurance, damage assessment, and property — all carrying personal data. Building the extractor against generated documents means the build phase needs no real personal data at all. That is a genuine selling point, it belongs in the proposal, and it removes the most common reason a cautious Slovenian buyer stalls a kickoff.

**4. It de-risks the reference-customer discount.** We discount for case-study rights. A discounted engagement that then burns 80 unbudgeted hours discovering edge cases in production isn't a reference customer, it's a loss.

---

## What to generate

### For document pipelines

Cover the full cross-product, not the happy path:

- **Every document type in scope.** Harvest Hub had ~7 per offer.
- **Both tracks.** Roughly the real split — INSPECTUS/Harvest Hub sample analysis showed ~80% digitally generated, ~20% scanned. Generate both, at the real ratio, then again at 50/50 to see where the vision path breaks.
- **Field-name drift.** The same field labelled differently by different senders. This was a named finding in the Harvest Hub analysis, not a hypothetical.
- **Value displacement.** The right number in the wrong place on the page — a premium and a sum insured far apart in the document, where a naive reader grabs whichever comes first.
- **Slovenian formatting.** Comma decimals (`305,50 €`), DDV lines, Slovenian date order, diacritics in names. A pipeline that only ever saw `305.50` will pass every test and fail on contact.

### The edge-case set (50–100, hand-designed, not generated)

Generation gives you volume. Volume doesn't give you the nasty ones. Write these by hand:

- Empty document · corrupt PDF · password-protected file
- Two offers in one email · the same offer arriving twice · an offer arriving as a reply to an older thread
- A scan at an angle, upside down, or half-cropped
- A field that is legitimately blank versus one that failed to read — **these must not produce the same output**
- A value at the exact confidence threshold
- Target system down mid-write · write half-succeeds and the job retries
- A document in the wrong language
- Personal data in an unexpected field

### For conversational agents

Same principle: 200–500 conversations spanning the intents in scope, then a hand-written set covering the ways a real person derails a script — ambiguity, hostility, mid-conversation topic changes, and requests that are in-scope-adjacent but out of scope.

---

## How to generate

1. **Start from the client's real samples, structurally.** Harvest Hub supplied 15 sample PDFs; that analysis defined the architecture. Read the real ones to learn the schema, then generate against the schema. **Never ship real client documents into a generation prompt** — extract the shape, discard the content.
2. **Generate with a cheap model, verify with an expensive one.** Same routing logic as production, same reason.
3. **Label at generation time.** You know the answer because you wrote it. That's the whole advantage — do not generate first and label after.
4. **Version the corpus and commit it.** `engagements/<slug>/synthetic/` with a manifest. It's a regression suite, not a one-off.
5. **Keep it out of the client's environment.** Synthetic data lives in our repo, not their infrastructure.

---

## The pass bar

Before an agent leaves Week 1 read-only:

- ≥95% correct extraction on the generated corpus, **per field**, not averaged across fields — an average hides one catastrophically broken field behind nine good ones
- 100% of the edge-case set produces either a correct result **or** an explicit escalation. A wrong answer delivered confidently is a fail; "I could not read this" is a pass.
- Zero cases where a blank field and a failed read are indistinguishable downstream
- The confidence threshold has been set from the corpus, with the false-accept and false-reject rate at that threshold written down and shown to the client

**"Could not check" is a distinct outcome from "checked and passed."** A validator that silently passes everything is indistinguishable from a validator that works, and the App Factory build found five of six bugs were exactly this — green while doing nothing. Any check whose dependency is missing must fail loudly, never report success.

---

## What this costs

A day, maybe two, of a cofounder's time per engagement. Against a build phase of 250–320 hours (the INSPECTUS figure), that is under 1% of the budget.

The counterfactual is the actual measured cost: Harvest Hub's hosted trial surfaced four defects that could not occur locally, all of them after the client was already looking at it. Some of those were environmental and synthetic data wouldn't have caught them — but the extraction failures are precisely the class this catches, and catching them in front of a client during a 14-day trial with an unsigned annexe is the most expensive possible time to find them.

---

## Where this appears in client-facing material

Put it in the proposal. It reads as engineering seriousness and it answers the GDPR question before it's asked:

> Before the system touches a single one of your documents, we build it against several hundred generated documents that match your formats, including the difficult cases — poor scans, unusual field names, values in unexpected places. Your real records enter the process only once the system already handles the hard cases correctly.
