# AI Infrastructure Protocol — Tier 2: Hosted Edition — Design Spec

**Date:** 2026-07-23
**Author:** Ian Veber (vision) + Claude (technical)
**Status:** Design — approved shape, ready to spec Phase 1
**Related:** `2026-07-23-protocol-productization-design.md` (the 3-tier ladder), `ai-infrastructure-protocol/` (the protocol), `project_ais_portal` (existing Next.js+Supabase stack to reuse)

---

## 1. Context & the three decisions this design encodes

Tier 2 of the product ladder: a **web app where a buyer runs the full AI-Native Protocol on their company with no terminal.** Confirmed with Ian:

1. **Scope:** the app runs the **full protocol, G0–G4** (all 5 gates). The *design* covers all five; the *build* is phased.
2. **Where built infrastructure runs:** **exported to the buyer's own infra.** The app is a *builder*, not a hosting company — no ongoing compute cost or data-operations liability for us. The buyer's agents run on the buyer's Vercel/Supabase/servers.
3. **Execution tech:** **Anthropic Managed Agents** (Claude's decision, rationale in §3). Fallback: self-hosted Claude Agent SDK.

Non-goal (v1): we do **not** host or operate the buyer's running agents; we build + export them.

---

## 2. Product overview

**Who:** a founder / operator who wants their company AI-native but can't (or won't) drive a terminal — the buyer the Tier-1 Course+Toolkit explicitly *couldn't* serve.

**The buyer journey (the whole product in one list):**
1. **Sign up** → create a **company project**.
2. **G0 · Scan** — a guided discovery flow (forms + AI-driven follow-up questions) → AI produces the **as-is map** of their company.
3. **G1 · Blueprint** — AI proposes the build plan (which agents/automations, order, expected ROI) → buyer **reviews & approves**.
4. **Connect infrastructure** (the *access* gate) — buyer OAuths **GitHub + Vercel + Supabase** and adds their own **API keys**. Keys go to Anthropic **vaults**, never our database.
5. **G2 · Build** — the agent factory builds each automation **into the buyer's GitHub repo**; buyer **approves before deploy** (the *trust* gate); deploy targets the buyer's Vercel/Supabase.
6. **G3 · Secure** — security checks run against the 8 controls; buyer sees the gate go green (or the specific failures).
7. **G4 · Investor-ready** — the investor package generates, carrying the honest **DRAFT-RUBRIC** banner until Ian's house weights land.
8. **Dashboard** — progress across gates, all artifacts (as-is map, blueprint, gate reports, investor package), and links to the agents now deployed **on the buyer's infra**.

---

## 3. Architecture

### 3.1 Execution — Anthropic Managed Agents

The protocol *is* Claude Code skills. Managed Agents runs them without us operating any agent runtime:

- **Agent (created once, versioned):** one `AI-Native Protocol` agent — `system` = `PROTOCOL.md`, `skills` = the 5 pillar skills uploaded via the **Skills API** (custom skills), `tools` = the built-in toolset (bash/read/write/edit/grep + web). Stored by ID; sessions reference it.
- **Session per gate run:** each gate execution for a project = one Managed Agents **session** in a **cloud environment** (Anthropic-hosted sandbox). The gate's pillar skill runs; the existing `gate-N-check` script writes `gate-N.json`; the session goes **idle** awaiting the buyer's approval (the trust gate). The next gate starts a fresh session seeded with prior artifacts (mounted files / memory store). We use the **Outcomes** feature per gate (rubric = "gate passes when …") so the harness iterates to a green gate.
- **Vaults = the access gate.** The buyer's secrets — their app API keys and their infra tokens (GitHub/Vercel/Supabase) — are stored as Managed Agents **vault credentials**. `environment_variable` credentials are substituted **at egress**; the sandbox sees only placeholders and our database never holds the raw secret. This is the single most important reason to use Managed Agents: it removes the buyer's-secrets liability from our stack.
- **GitHub repo resource = the export mechanism.** At G2, the buyer's repo is attached as a `github_repository` session resource. The agent edits + `git push` through Anthropic's git proxy (token injected at egress). PRs/deploys land in the buyer's repo → their Vercel builds it → their agents run on their infra.
- **Networking:** cloud environment with egress to the hosts the build needs (GitHub, Vercel/Supabase APIs), scoped per vault credential's `allowed_hosts`.

**Why not the alternatives:** the self-hosted **Claude Agent SDK** gives more control and is GA, but we'd operate the sandbox fleet, scaling, and (worst) the buyer-secret custody ourselves. Raw Claude API = rebuild the whole skill harness. **Managed Agents is the least code we own and the best secret-handling** — the right call for a two-person team. Risk: it's beta; §10 tracks it, and the Agent-SDK fallback keeps the same app shape (only the execution adapter changes).

### 3.2 The app — Next.js + Supabase + Vercel

Reuse the AIS-portal stack. Next.js app (the gate UI + dashboard), Supabase (auth, multi-tenant data, RLS), Vercel (host). A thin **execution-adapter** module wraps Managed Agents (create session, stream events, send approvals, fetch artifacts) so the rest of the app is agnostic to the execution backend (keeps the Agent-SDK fallback cheap).

### 3.3 Export — buyer connects their own infra

OAuth the buyer's **GitHub** (repo scope), **Vercel** (deploy), **Supabase** (project). Tokens are placed into vaults for the sandbox and stored (encrypted) app-side only as needed for status polling. The built agents are the buyer's, in the buyer's repo, on the buyer's plan.

---

## 4. The 5 gates as product flow

| Gate | Pillar skill | Buyer input | AI output / artifact | Human gate |
|---|---|---|---|---|
| **G0 Scan** | `2-infrastructure` | Guided discovery Q&A | As-is company map (`.protocol/scan`) | Discovery |
| **G1 Blueprint** | `2-infrastructure` | Confirm priorities | Build blueprint + ROI (`.protocol/blueprint`) | Approve plan |
| **G2 Build** | `3-agents` | Connect infra + keys | Agents built into buyer's repo | Access + approve-before-deploy (Trust) |
| **G3 Secure** | `5-security` | — | `gate-3.json` (8 controls) | Review failures |
| **G4 Investor** | `4-investor` | Financials (optional) | Investor package (DRAFT banner) | Approve framing |

Gates are strictly ordered; a gate cannot start until the prior gate's `gate-N.json` is green **and** the buyer has approved.

---

## 5. The human gates in a browser

The protocol's three human-need points, as concrete UI:
- **Access** → OAuth buttons (GitHub/Vercel/Supabase) + a "your API keys" form that writes straight to vaults (never our DB).
- **Discovery** → guided questionnaires; the agent asks follow-ups via the session stream, rendered as chat-style prompts the buyer answers.
- **Trust** → explicit **Approve / Reject** on every gate transition and before any deploy. Reject sends a `deny_message` back to the agent to revise.

---

## 6. Data model (Supabase)

- `orgs`, `users` — auth + tenancy.
- `projects` — one per buyer company (holds protocol state, current gate).
- `gate_runs` — one per gate execution: `gate`, `session_id`, `status`, `outcome_result`, `gate_json` ref.
- `artifacts` — as-is map, blueprint, gate reports, investor package (Supabase Storage; large ones referenced).
- `connections` — OAuth connection status + `vault_id` references (NOT raw secrets).
- `approvals` — human-gate decisions (who/when/allow-deny/message).
- `subscriptions` — billing state.

**RLS everywhere**, org-scoped. Our DB holds metadata + references only; **no buyer secrets** (those live in Anthropic vaults).

---

## 7. Security & isolation

- Multi-tenant RLS (proven pattern from the AIS portal).
- Buyer secrets → Anthropic vaults; egress substitution; per-credential `allowed_hosts`.
- One vault (and one repo resource) per project; sessions attach only that project's vault.
- Approve-before-deploy on every build; nothing reaches the buyer's infra unapproved.
- The protocol's own Pillar 5 security gate runs on everything built (dogfooding: the product that makes companies secure is itself secure).

---

## 8. Build phasing (each phase = its own spec + plan)

1. **Phase 1 — Skeleton + one gate live.** App shell, Supabase auth, projects, the Managed-Agents execution-adapter, and **G0 Scan running end-to-end** (create session → stream discovery → produce as-is map → render it). Proves the hardest unknown (protocol-in-a-browser) on the smallest surface.
2. **Phase 2 — G1 Blueprint + infra connection.** OAuth (GitHub/Vercel/Supabase) + vault credential creation + the blueprint gate + approve flow.
3. **Phase 3 — G2 Build + export.** Agent factory into the buyer's repo, approve-before-deploy, deploy to buyer infra, artifact tracking.
4. **Phase 4 — G3 Secure + G4 Investor + dashboard + billing.** Remaining gates, the full dashboard, subscription billing, polish.

---

## 9. Definition of done (per phase)

- **P1:** a logged-in user creates a project and runs G0 Scan to a rendered as-is map, executed via Managed Agents. No mocks.
- **P2:** buyer connects GitHub/Vercel/Supabase; G1 produces an approved blueprint.
- **P3:** an automation is built into the buyer's repo and deployed to their infra, gated by explicit approval.
- **P4:** all 5 gates run; dashboard shows full state; a subscription can be purchased.

---

## 10. Open decisions & risks

- **Subscription pricing + tiers** (Ian) — later, once P1 proves the shape.
- **Product name/brand** (Ian) — shares the "AI-Native" family.
- **G4 DRAFT banner** — keep, consistent with Tier 1 (until investor docs land).
- **Managed Agents beta risk** — track platform stability through P1; the execution-adapter keeps the Agent-SDK fallback a contained swap if needed.
- **Buyer-repo assumption** — v1 assumes the buyer has (or lets us create) a GitHub repo + Vercel/Supabase. Buyers with none get a "we scaffold it" path (deferred detail to P3).
