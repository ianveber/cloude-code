# Tier 1 — Toolkit Redistribution Audit

**Question answered:** of everything currently in `ai-infrastructure-protocol/skills/`, what can Ian legally *sell* in a licensed product (vs. what was only ever an operator convenience for done-for-you use)?

**Verdict:** the sellable IP is the **protocol itself** (methodology + pillar skills + knowledge PDFs) + **Ian's own skills**. The bulk of `skills/` is third-party and must NOT be redistributed in a paid bundle — it becomes a *companion install list* pointing buyers to the original sources.

---

## A. The real product core — Ian-original, ships in the bundle ✅

| Asset | Type | Redistributable | Why |
|---|---|---|---|
| `PROTOCOL.md` + `pillars/1-5/SKILL.md` + `RUNBOOK.md` | Protocol methodology | ✅ yes | Written for the protocol — Ian's original IP. The actual product. |
| `SKILLS-MANIFEST.md`, `DELIVERY-MAP.md`, `README.md` | Protocol docs | ✅ yes | Ian's original. |
| `knowledge/*.pdf` (6) | Course PDFs | ✅ yes | Ian's original (make-pdf output of his methodology). |
| `skills/business/client-pricing-sheet` | Skill | ✅ yes | "How **Ian** builds…" — his own. |
| `skills/build/ian-design-standards` | Skill | ✅ yes | "**Ian's** visual + UX standards" — his own. |

## B. Maybe Ian's — CONFIRM before including ⚠️

| Skill | Redistributable | Note |
|---|---|---|
| `business/enotna-ekonomika` | ask-Ian | Slovene, his voice — but the description format matches the ai-universa pack. Did you author it, or is it a pack skill? |
| `business/pozicioniranje` | ask-Ian | Same. |
| `business/distribucijski-kanali` | ask-Ian | Same. |
| `business/vrednostno-cenovanje` | ask-Ian | Same. |

## C. Third-party — do NOT bundle; point buyers to the source ❌

| Skills | Origin | Buyer installs from |
|---|---|---|
| `advisors/advisor-*` (7) | ai-universa pack | the ai-universa pack |
| `agents/composio-cli` | Composio | Composio CLI |
| `agents/agent-browser`, `dispatching-parallel-agents`, `hook-generator`, `pair-agent`, `scrape`, `voice-builder`, `whatsapp-ai-agent` | gstack / pack | gstack (`npx skills`) / ai-universa |
| `build/deploy-to-vercel`, `interface-design`, `web-design-guidelines` | gstack | gstack |
| `build/shadcn` | shadcn | shadcn official skill |
| `build/supabase` | Supabase | Supabase official skill |
| `business/competitor-profiling`, `customer-research`, `marketing-plan`, `marketing-psychology`, `niche-research`, `pricing`, `revops` | gstack / pack | gstack / ai-universa |
| `knowledge-tools/make-pdf`, `document-generate` | gstack | gstack |
| `security/careful`, `cso`, `guard` | gstack | gstack |

**Count:** ✅ 2 own skills + protocol core · ⚠️ 4 to confirm · ❌ 32 third-party.

---

## Design implication (needs Ian's decision)

The tier-1 **toolkit** is therefore:
1. **The protocol** — `PROTOCOL.md` + 5 pillar `SKILL.md`/`RUNBOOK.md` + manifests (the core, definitely yours).
2. **Ian's own skills** — `client-pricing-sheet`, `ian-design-standards` (+ the 4 Slovene ones if you confirm).
3. **A `COMPANION-SKILLS.md`** — the ❌ list above, telling buyers how to install each from its source (attribution, not redistribution). This is *more* honest and actually stronger: "here's my protocol + the exact open ecosystem it plugs into."

This does **not** weaken the product — the differentiated IP was never the third-party skills; it's the methodology + pillar skills + the 6 PDFs. It just makes the bundle legally clean.
