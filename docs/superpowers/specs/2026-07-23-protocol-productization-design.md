# AI Infrastructure Protocol — Productization Design

**Date:** 2026-07-23
**Author:** Ian Veber (with Claude)
**Status:** Design — approved frame, tier-1 spec for execution
**Related:** `ai-infrastructure-protocol/` (the built protocol), `project_ai_infrastructure_protocol` (memory), `project_3day_app_protocol` (B1 engine)

---

## 1. Context & the pivot

The AI Infrastructure Protocol is built: a 5-pillar gated methodology (`PROTOCOL.md`), 5 pillar skills, a bundled skill-pack (6 categories), per-pillar RUNBOOKs, a SKILLS-MANIFEST, a DELIVERY-MAP, 6 knowledge PDFs, a proven agent-factory run, and a v1 commercial wrapper ("AI-Native in 90").

It was **codified as done-for-you only** (Ian solo + AI runs it; buyer gets outputs). **Decision (2026-07-23): also sell it as a licensed digital product** — the protocol itself becomes the asset the buyer receives. This does not replace done-for-you; the two become tiers of one ladder.

**Honest constraint carried forward:** the access / discovery / trust steps genuinely need a human. The self-serve tiers must be *guided DIY*, not a magic autonomous button — the RUNBOOKs already codify those human steps and make them frictionless. Product messaging must be honest about this (no "AI builds your whole company while you sleep" claim).

---

## 2. The product ladder (the answer to "how is it packaged / what's the asset / what's the form")

| Tier | Buyer gets (the digital asset) | Form | Distribution | Price band | Status |
|---|---|---|---|---|---|
| **1 — Course + Toolkit** (self-serve) | The methodology as a **course** (6 knowledge PDFs + lesson guide) **+ the Claude Code skill-pack** | Downloadable bundle (ZIP) + license key | Digital storefront (Lemonsqueezy rec.) → instant download | Entry (lowest) | **~90% exists — package it** |
| **2 — Hosted / Managed edition** | Same protocol run in a **web app** — gate-by-gate, no terminal | Login to a hosted app (seat) | Subscription | Mid–high | **New SaaS build (weeks)** |
| **3 — Done-for-you** | You run it; they get live infrastructure + artifacts | An engagement | Direct sale ("AI-Native in 90") | Highest (€1.5k Scan → €7.5k Build → €25k+) | **Built (offer decisions open)** |

**Build order (Ian's call, confirmed): Tier 1 → Tier 2 → Tier 3-polish, finish each fully.**

---

## 3. Tier 1 — Course + Toolkit (detailed spec)

The near-term deliverable: a **self-contained, sellable bundle** a buyer can purchase, download, install, and run.

### 3.1 What's in the bundle
1. **The Course** — the 6 knowledge PDFs, sequenced with a `COURSE.md` index that frames each as a lesson:
   - `00-operating-manual` → how the protocol works (start here)
   - `01` infrastructure scan+blueprint · `02` agent factory · `03` security standard · `05` investor-criteria research
   - `04-investor-readiness-DRAFT` → **ship with its honest DRAFT-RUBRIC banner** (research is real; house weights finalize in a free update once Ian's investor docs land). Do not hide the draft state.
2. **The Toolkit** — the Claude Code skill-pack: `skills/` (advisors, agents, build, business, knowledge-tools, security) + `PROTOCOL.md` + the 5 pillar `SKILL.md`/`RUNBOOK.md` + `SKILLS-MANIFEST.md` + `DELIVERY-MAP.md`.
3. **Install & quick-start guide** (`INSTALL.md` + `QUICKSTART.md`) — how to drop skills into `~/.claude/skills/`, verify, and run G0 SCAN on their own company; where the human-gates are and how the runbooks handle them.
4. **License / terms** (`LICENSE.md`) — single-company use, no resale.

### 3.2 Form & runtime
- Delivered as a versioned **ZIP** (self-contained, symlinks pre-resolved — reuse the materialization fix from commit f37f8b0 so the bundle is portable).
- Runtime = the buyer's **own Claude Code**. INSTALL.md states the prerequisite plainly (Claude Code + basic terminal comfort). This is the honest buyer-fit gate for tier 1.

### 3.3 Distribution & licensing
- **Recommended platform: Lemonsqueezy** — merchant-of-record, handles EU VAT (matters for a Slovenian seller selling into EU/global), license keys, instant digital download, subscriptions later for tier 2. (Alt: Gumroad — simpler, but weaker EU-VAT/licensing.)
- Buyer flow: storefront → pay → license key + download link → install per INSTALL.md.

### 3.4 Sales page
- Tier 1 needs **its own** self-serve product page (the existing `commercial/onepager.html` is the done-for-you pitch). Reuse its premium light-editorial style + make-pdf/HTML pipeline. Different CTA: "Buy / Download," not "Apply for a Scan."

### 3.5 What only Ian can do (blocks go-live, not the build)
- Create the storefront account (Lemonsqueezy) + connect payout.
- Confirm **price**, **product name/brand**, and **whether pillar-4 ships as draft** (recommended: yes, honestly labeled).

---

## 4. Tier 2 — Hosted / Managed edition (outline — gets its own spec)

A web app that runs the protocol gate-by-gate without a terminal. High-level shape (to design later): auth + project workspace → a guided UI per gate (G0 SCAN … G4 INVESTOR) → server-side execution of the skills (the hard part: productizing Claude Code into a managed backend) → artifact storage + gate reports → subscription billing. **This is a genuine multi-week SaaS build; it does not block Tier 1.** Its own design doc when we reach it.

---

## 5. Tier 3 — Done-for-you (built; polish only)

The "AI-Native in 90" offer + onepager + PDF exist. Remaining: confirm name/price and set the Scan "worth-it" threshold (carried over from the commercial-wrapper open decisions). Pillar-4 house weights still await Ian's investor docs.

---

## 6. Open decisions (Ian)

1. **Tier-1 price** and **product name/brand** (does the ladder share the "AI-Native" name with tier suffixes?).
2. **Distribution platform** — Lemonsqueezy (recommended) vs Gumroad.
3. **Pillar-4 in tier 1** — ship as honest draft (recommended) or hold pillar 4 out of the self-serve bundle until finalized.
4. Confirm the licensed product **sits alongside** done-for-you (already indicated: yes, 3 tiers).

---

## 7. Definition of done, per tier

- **Tier 1 done** = a versioned, installable bundle (course + toolkit + INSTALL/QUICKSTART/LICENSE) + a self-serve sales page + a live storefront listing (pending Ian's account/price). Reproducible build script so re-packaging on updates is one command.
- **Tier 2 done** = a deployed hosted app running ≥1 full gate end-to-end for a logged-in user, with billing. (Own spec.)
- **Tier 3 done** = offer name/price/threshold locked; pillar-4 banner removed once Ian's docs land.
