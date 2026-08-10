# CLAUDE.md — AIS Slovenia Repo

Operating instructions for Claude Code when working inside `/agency/`.

---

## What this repo is

AIS Slovenia is a vertical agent agency. Three cofounders, equal split:

- **Anej Vučič** — strategic architecture, AI integration, original cofounder
- **Nejc Feigel Boh** — legal, external representation, sales, development, original cofounder
- **Ian Veber** — engineering (Claude as technical brain), invited third

The repo is the operating spine. Six phases of build (see `README.md`). Each phase ships every file in full.

---

## Before you write anything

Read these files in order. Every session. No exceptions.

1. `docs/positioning.md` — the thesis
2. `docs/services.md` — the product
3. `docs/pricing.md` — the pricing logic
4. `docs/principles.md` — the 10 decision rules
5. `docs/voice.md` — tone and vocabulary

Without these, you'll drift into agency-speak or propose engagements that violate the model. Treat them as load-bearing.

When something in this repo references a file from a later phase that hasn't shipped yet (e.g. `verticals/specialty-legal.md` before Phase 2), note the gap and skip the cross-reference. Don't fabricate the missing file's contents.

---

## Hard rules

These are non-negotiable. Breaking any of them produces work that has to be thrown away.

**1. Sell agent systems. Not seats. Not hours.**
Never describe AIS as selling "AI seats", "AI consultants by the hour", "AI strategy consulting", "AI roadmaps", or any model that prices time or licenses. The product is a deployed, operating agent system. Pricing is a build fee plus an operate retainer (see `docs/pricing.md`).

**2. No paid-media work.**
Never generate Google Ads playbooks, Meta Ads SOPs, ad-account audits, paid-media campaign frameworks, attribution-modeling-for-paid-traffic, or ad-spend optimization content. The Acquirer Agent does non-paid acquisition only: content (GEO/AEO/SEO), partnerships, referrals, qualified outbound. If the founder explicitly opts into paid media later, `docs/principles.md` rule 3 must be updated first — only then.

**3. No corporate filler.**
Never use any of these:

- "leverage", "leverage synergies", "synergies"
- "we are excited to announce", "we are thrilled to"
- "delve into", "in the realm of", "in today's fast-paced world"
- "unlock the power of", "supercharge", "revolutionize", "game-changer"
- "robust solution", "cutting-edge", "world-class"
- "navigate the complexities of"
- "best-in-class", "industry-leading", "next-generation"

If you find yourself reaching for one of these, the sentence is doing no work. Rewrite it with the specific noun, the specific number, the specific outcome.

**4. No floating AI.**
Never propose an agent or workflow without a named human owner (one of the three cofounders, or an internal client-side owner during operate phase). If you can't name the owner, the agent isn't real yet. See `docs/principles.md` rule 2.

**5. No external deployment without the onboarding ladder.**
Every agent goes through: Week 1 read-only → Week 2 draft → Week 3 internal autonomy → Week 4 external deployment. Never skip steps. Never deploy day-one. See `agents/work-chart.md` once it's shipped in Phase 3.

**6. Voice locking requires 16+ samples.**
Below 16 curated samples of the target voice (client's brand voice, founder's writing, etc.), output is generic AI slop. Don't ship voice-dependent work until 16 samples are archived. See `agents/16-sample-voice-locking.md` once Phase 3 ships.

---

## Soft rules

These can flex with founder approval. Default to following them.

- **Prose discipline.** Match the style of `docs/`. Sharp. Specific. Practitioner-level. Use specific numbers, named people, real outcomes. Cut adjectives that don't carry weight.
- **Default language.** English for internal docs. Slovenian for Slovenian client-facing copy. For any other language, confirm with founder before writing.
- **New verticals.** Run through `verticals/_selection-framework.md` (once it exists in Phase 2). Don't add a vertical just because a prospect asked.
- **New pricing.** Use the build-fee + operate-retainer model from `docs/pricing.md`. Custom structures require founder confirmation and an update to `docs/pricing.md`.
- **Cross-references.** Use relative paths within the repo. Don't link to `Obsidian Vault/` files from inside `/agency/` — the repo should stand on its own.

---

## Phase gates

The repo builds in 6 phases. Each phase ships every file in full. After a phase completes, summarize what was shipped, then **wait for explicit founder confirmation** before starting the next phase. Never run phases back-to-back unprompted.

Within a phase, write all the files. Don't ask for confirmation between files of the same phase — that's noise. Phase gate is the only checkpoint.

---

## Working with other AIS-adjacent locations

This repo is project-specific. Other context lives at:

- `/Users/ianveber/Documents/Obsidian Vault/_claude-memory/ais-slovenia/` — Ian's personal AIS notes
- `/Users/ianveber/Documents/Obsidian Vault/_claude-memory/context.md` — Ian's global working context
- `/Users/ianveber/Documents/Obsidian Vault/_claude-memory/decisions-log.md` — Ian's cross-project decision log

Read these when you need global context. Don't write to them from this repo — the vault has its own write protocol owned by Ian's main Claude Code instance. If a decision is made inside this repo that needs to land in the vault, surface it to Ian and let him propagate.

---

## When you don't know

Three responses, in order of preference:

1. Ask. The founder is fast and decisive. A 1-sentence question beats 500 words of speculation.
2. Make the call, label it, move on. Mark the assumption explicitly: "Assumed X — flip if wrong."
3. Stop and surface. If a decision is large enough to break the model (e.g. accepting a paid-media engagement, pricing a deal at 50% of model rates), don't quietly absorb it. Surface and confirm.

Never silently invent a decision the founder hasn't approved.
