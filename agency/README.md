# AIS Slovenia — Vertical Agent Agency

Operating repo. Last updated 2026-05-25.

---

## What this is

AIS Slovenia ships complete AI agent systems that replace functional clusters inside specific service-business verticals. Not seats. Not hours. Not generic AI consulting. The product is a working agent stack the client owns and operates after handoff.

- **Founded:** 2025 (s.p. registered 2025-12-02, d.o.o. formation in progress)
- **Cofounders, equal 33%:** Anej Vučič · Nejc Feigel Boh · Ian Veber
- **Platform layer:** Agentic OS (built by Ian, productized through AIS engagements)
- **Stage as of May 2026:** Pre-formation. First paying engagements being scoped.

---

## How the repo is organized

```
agency/
├── README.md              ← this file
├── CLAUDE.md              ← operating instructions for Claude Code in this repo
├── docs/                  ← thesis, services, pricing, principles, voice
│   ├── positioning.md
│   ├── services.md
│   ├── pricing.md
│   ├── principles.md
│   └── voice.md
├── verticals/             ← per-vertical playbooks (Phase 2, 7)
├── agents/                ← canonical agent specs + Work Chart (Phase 3)
├── delivery/              ← engagement workflow templates (Phase 4, 7)
├── sales/                 ← acquisition engine, non-paid (Phase 5, 7)
├── ops/                   ← KPIs, economics, run-book, memory (Phase 6)
├── templates/             ← client onboarding + Voice DNA artifacts (Phase 7)
├── dashboard/             ← agency dashboard + Owner OS, port 4733 (Phase 7)
└── engagements/           ← per-client working files
```

## Running the dashboards

```bash
python3 agency/dashboard/server.py
```

Python stdlib only, nothing to install. Two same-origin surfaces so they share state:

- `http://127.0.0.1:4733/` — engagements, delivery stage, economics, the document library
- `http://127.0.0.1:4733/owner` — the owner board. `M` set today's focus · `E` close the day · `B` log something stuck · `W` weekly look-back · `N` set the target

`#today` on the agency dashboard joins the two: today's focus and open blockers next to the next move on each engagement.

---

## Where to start

Read in this order before doing anything else in this repo:

1. `docs/positioning.md` — the thesis. Why vertical agents now, what AIS does, who we sell to, who we don't.
2. `docs/services.md` — the product. The standard agent stack and what ships in a build phase + operate phase.
3. `docs/pricing.md` — pricing logic. Build fee + operate retainer. Why not seats. Why not hours.
4. `docs/principles.md` — 10 decision rules. The hard constraints that make AIS coherent.
5. `docs/voice.md` — tone, vocabulary, language usage.
6. `CLAUDE.md` — what Claude Code is allowed and not allowed to do in this repo.

---

## Build status

| Phase | Scope | Status |
|---|---|---|
| 1 | Positioning & repo foundation | ✅ shipped |
| 2 | Vertical playbooks (Slovenian businesses, specialty legal, B2B SaaS demand-gen) | ✅ shipped |
| 3 | Agent architecture (6 agents + Work Chart + voice locking) | ✅ shipped |
| 4 | Delivery operating system (Discovery → Scoping → Onboarding → Build → Validation → Handoff) | ✅ shipped |
| 5 | Acquisition engine (Acquirer system, GEO/AEO, content, qualified outbound, partnerships) | ✅ shipped |
| 6 | Operations & memory (KPIs, economics, run-book, memory, risk register, targets) | ✅ shipped |
| 7 | Proof layer (document-operations vertical, synthetic data, Voice DNA, profile funnel, dashboards, first engagements) | ✅ shipped |
| 8 | Revenue plan (road to €1M, pricing reconciled to delivered reality) | ✅ shipped |

Phases 1–6 complete 2026-05-25. 42 files, ~150,000 words — the operating spine.

**Phase 7, 2026-08-09.** The spine was written before there was revenue. Phase 7 closes the gap between what the spine describes and what has actually been delivered:

- `verticals/document-operations.md` — the only vertical validated before it was written down, reverse-engineered from INSPECTUS and Harvest Hub
- `delivery/synthetic-data.md` — build against generated documents before touching a real record
- `templates/voice-dna/` — the three machine-readable voice artifacts
- `templates/client-onboarding-template.md` — the per-engagement working file
- `sales/profile-funnel.md` — marketing does 80% of the close, non-paid throughout
- `dashboard/` — agency dashboard + Theory-of-Constraints owner board
- `engagements/inspectus`, `engagements/harvest-hub` — the two real engagements, with real economics

**The open item Phase 7 surfaced and did not solve:** two delivered engagements, zero written case studies. Every acquisition route in `sales/` routes through them. The INSPECTUS reference discount (€14,900 against a €19,700 recommendation) was justified on the grounds that a case study would follow. It hasn't.

**Phase 8, 2026-08-09 — `ops/road-to-1m.md`.** Phase 7 recorded what had been delivered. Phase 8 measured it against the target and found the spine describing a business roughly 20–30× larger than the one that exists: `ops/escape-velocity-targets.md` had Q3 2026 at €60K–€100K TTM with 2–3 engagements, against an actual **€227/mo of signed recurring revenue** and one engagement.

- `ops/road-to-1m.md` — the €1M-by-December-2027 ladder. **Supersedes the quarterly numbers in `ops/escape-velocity-targets.md`** (thesis retained, targets dead).
- **Retainer band corrected.** Three documents priced the same thing 20× apart — `docs/pricing.md` at €4K–6K/mo, the document-ops playbook at €350–600/mo, INSPECTUS actually paying €227/mo. Single-function document pipelines now price at **€900–1,800/mo**, anchored to the ≥1 FTE of labour they replace rather than to what the last client paid. Existing contracts grandfathered.
- Harvest Hub's build-only exception now carries a decision date (31 Aug 2027) and defaults to *doctrine holds* if nobody writes the outcome.

**The finding worth carrying forward:** every gate on the path to €1M is a commercial act — a signature, a price, a published case study — and none of them require writing code. **€31,800 in build fees and €980/mo in retainers are already negotiated and sitting unsigned.** Delivery capacity does not become the binding constraint until roughly €300K/yr.

---

## Hard nos (baked into the model — do not relax)

- No selling of AI seats, AI licenses, or hourly AI consulting time.
- No paid-media management (Google Ads, Meta Ads, programmatic). The Acquirer Agent is non-paid by default.
- No engagements where the client wants a black box without operator buy-in.
- No agents without a named human owner.
- No external deployment without the 30-day onboarding ladder.

See `docs/principles.md` for the full set of rules and the reasoning behind each.

---

## Working relationship with other repos

This repo is the AIS Slovenia operating spine. Two other locations hold related context:

- `/Users/ianveber/Documents/Obsidian Vault/_claude-memory/ais-slovenia/` — Ian's personal AIS notes, cofounder dynamics, entity status, decision log.
- `/Users/ianveber/Documents/Obsidian Vault/_claude-memory/context.md` — Ian's global working context across all projects.

Treat the vault as global memory. Treat this repo as project state. Don't mirror content across the boundary.
