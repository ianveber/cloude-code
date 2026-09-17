# Veta Memory Cloud — knowledge pack

Generated: 2026-09-17T06:54:05Z

This is a snapshot of `_claude-memory/` for ChatGPT and Claude.ai uploads.
Live source of truth is the git folder. Re-run `./scripts/export-memory-pack.sh` after memory changes.

---


---

## FILE: BOOT.md

# BOOT — Veta Memory Cloud

Last updated: 2026-09-17

Upload this file into ChatGPT and Claude.ai when you cannot read the repo live. Prefer live `_claude-memory/` files when Actions / Claude Code / Cursor are available.

After loading, say: `Memory loaded — Veta agency + Ethospheres pre-launch + AutoFlow; shared cloud is _claude-memory in ianveber/cloude-code.`

## Who

Ian Veber (`ian.veber@gmail.com`). Founder. Europe/Ljubljana. Solo operator.

## Shared cloud

Private GitHub repo `ianveber/cloude-code`, folder `_claude-memory/`. ChatGPT, Claude, and Cursor all read and write it. Protocol: `docs/memory-cloud.md`.

Start: MOC → context.md → decisions-log.md → ledger.md → handoffs/.
End: update files, append ledger, write a handoff if another model continues.

## Active businesses

**Veta** — AI-native vertical agent agency. Ships complete agent systems that replace one functional cluster inside a specialty service business. Tiers: Cluster Sprint $18K–$45K; Vertical Stack $55K–$120K; Embedded Partner retainer. Verticals: specialty dental, specialty legal, aesthetic medicine. Not ads-as-a-service, not hours, not SaaS seats. Clients own the build.

**Ethospheres** — premium EU cosmesotherapy, ethosome delivery, pre-launch. Clinics first (derm, plastics, medi-spa), D2C second. Bootstrapped, Ian + 1 ops. Voice: scientific, not "revolutionary."

**AutoFlow** — AI lead scoring + email automation SaaS (Claude API + Supabase + Vercel). SMB B2B sales teams.

## Named clients / related

ZaLife, Pacom, ATHLOS, CASTRUM, Alissa, Tower Spa, 10th Planet, AI Univerza — see `clients/other-projects.md`. Do not invent status.

## Hard rules

No email send without approval. GitHub issues read-only unless Ian confirms. No deleting Notion/GitHub items. No Calendar mutations. No silent failures. No invented progress.

## Locked decisions (short)

- Shared memory lives in this git repo, not only in local Obsidian.
- ChatGPT + Claude + Cursor are peers on that folder (2026-09-17).
- Veta offer is vertical agent systems, not Veta Ads retainers, unless Ian reopens ads.
- Price on value of the cluster replaced. Read-only phase before write-access.

## Where to look next

| Need | File |
|---|---|
| Map of maps | `🗺️ Master MOC.md` |
| Full context | `context.md` |
| Decisions | `decisions-log.md` |
| What the others just did | `ledger.md` |
| Pick up their work | `handoffs/` |
| Ethospheres | `ethospheres.md` |
| Agency | `veta-agency.md` |
| ChatGPT wiring | `connectors/chatgpt/setup.md` |
| Claude wiring | `connectors/claude/setup.md` |


---

## FILE: 🗺️ Master MOC.md

# Master MOC

Last updated: 2026-09-17

Map of maps. Start here every session.

## How agents use this vault

- ChatGPT, Claude, and Cursor all load from `./_claude-memory/` in this repo (the private cloud)
- Architecture: `docs/memory-cloud.md`. Wiring: `connectors/README.md`. Local editor: [[SYNC]]
- Also read [[ledger]] and `handoffs/` so you can continue the other models' work
- Confirm load with one line. Do not ask Ian to re-explain what is already here

## Core (every session)

- [[context]] — who Ian is, businesses, constraints
- [[decisions-log]] — locked decisions
- [[ledger]] — what ChatGPT / Claude / Cursor last wrote
- [[BOOT]] — short pack for ChatGPT and Claude.ai uploads
- [[SYNC]] — how all three models + Obsidian stay in sync

## Primary work

- [[ethospheres]] — cosmesotherapy brand (primary client/venture)
- [[veta-agency]] — AI-native vertical agent agency
- [[agentic-os]] — personal operating agents
- [[clients/autoflow]] — lead-scoring SaaS
- [[clients/other-projects]] — Pacom, ZaLife, ATHLOS, remaining Veta clients
- [[zalife]] — ZaLife youth leadership (research-agent target)

## Veta internal

- [[veta-internal/veta-positioning]]
- [[veta-internal/veta-services]]
- [[veta-internal/veta-principles]]
- [[veta-internal/veta-kpis]]
- [[veta-internal/vertical-aesthetic-medicine]]

## Knowledge

- [[knowledge/ethosome-technology]]
- [[knowledge/geo-strategy]]

## Repo pointers (not duplicated here)

| Need | Path |
|---|---|
| Private memory cloud | `docs/memory-cloud.md` + `connectors/` |
| Daily briefing agent | `CLAUDE.md` |
| Agency OS | `docs/` |
| Skills | `skills/` |
| Vertical playbooks | `verticals/` |
| Delivery | `delivery/` |
| Dashboards | `dashboard.html`, `agentic-os.html`, `zalife.html`, `pacom.html`, `athlos.html` |
| Notion Business OS | https://app.notion.com/p/345a5cb8d3d281cba3f7cb57bf9b5898 |
| Notion VETA HQ | https://app.notion.com/p/344a5cb8d3d2813ca1a7f27074efb068 |
| Notion Multi-Business Hub | https://app.notion.com/p/345a5cb8d3d281b9b8ecc0fc663fef81 |
| Claude + Cursor + Obsidian sync (Notion draft) | https://app.notion.com/p/3cea5cb8d3d2814f8cb2ecd4e05ed0e9 |

## Open merge note

Local Obsidian vault was not imported on first Cursor Cloud seed. If `_claude-memory.pre-sync-backup/` exists after running the link script, merge any richer notes into these files.


---

## FILE: context.md

# Context

Last updated: 2026-09-17

## Who

**Ian Veber** (`ian.veber@gmail.com`). Founder / operator. Timezone: Europe/Ljubljana. Solo-founder stage — he is project lead, delivery, and ops.

Do not ask him to re-explain businesses, clients, or decisions that are already in this folder.

## Shared operators

ChatGPT, Claude, and Cursor are peers on this memory cloud. They do not share chats. They share `_claude-memory/`. See `docs/memory-cloud.md`.

## Active businesses

### Veta — AI-native vertical agent agency (primary operating company)

Ships complete agent systems that replace a functional cluster inside a specialty service business. Not seats, not hours, not generic strategy decks.

- Repo: `github.com/ianveber/cloude-code`
- Positioning, catalog, principles: `docs/`
- Daily business manager: `CLAUDE.md` (07:00 Europe/Ljubljana)
- Notion: [VETA HQ](https://app.notion.com/p/344a5cb8d3d2813ca1a7f27074efb068), [BUSINESS OS](https://app.notion.com/p/345a5cb8d3d281cba3f7cb57bf9b5898)
- Earlier brand track in Notion: **Veta Ads** — geometric red/navy, ads & creative. Agency positioning in this repo has moved to vertical agent systems. Treat Veta Ads as the prior creative/ads identity, not the current offer.

### Ethospheres — premium ethosome cosmesotherapy brand (primary venture)

Pre-launch. EU. Professional channel first (derm, plastics, medi-spa), D2C second. Proprietary ethosome delivery. Bootstrapped, lean team (Ian + 1 ops). See [[ethospheres]].

### AutoFlow — AI lead scoring + email automation SaaS

Claude API + Supabase + Vercel. Target: SMB B2B sales teams. See [[clients/autoflow]].

### Ian Freelance (Notion)

Cinematic / AI-video track inside Business OS. Signature tools noted there: Kling 3.0, Seedance 2.0, Higgsfield Cinema 2.5, Nano Banana, Claude, DaVinci Resolve.

## Active / named clients (Veta + related)

From daily-summary skill and dashboards. Status in each file is a snapshot, not invented progress.

| Name | Notes | Memory |
|---|---|---|
| Ethospheres | Own brand, pre-launch | [[ethospheres]] |
| AutoFlow | Own SaaS | [[clients/autoflow]] |
| ZaLife / zalife.eu | Youth leadership; parent onboarding chatbot idea in Notion | [[zalife]] |
| Pacom | Dashboard in repo (`pacom.html`) | [[clients/other-projects]] |
| ATHLOS | Dashboard in repo (`athlos.html`) | [[clients/other-projects]] |
| CASTRUM | Named in Agentic OS daily skill | [[clients/other-projects]] |
| Alissa | Named in Agentic OS daily skill | [[clients/other-projects]] |
| Tower Spa | Named in Agentic OS daily skill | [[clients/other-projects]] |
| 10th Planet | Named in Agentic OS daily skill | [[clients/other-projects]] |
| AI Univerza | Named in Agentic OS daily skill | [[clients/other-projects]] |

## Active verticals (Veta)

In development: specialty dental, specialty legal, aesthetic medicine.

Roadmap: maritime, fintech back-office, B2B SaaS ops.

## Operating constraints

- Never send / draft / schedule email without explicit approval this session
- Never modify, close, comment on, or reassign GitHub issues without confirmation
- Never delete Notion or GitHub items; archive only when confirmed
- Never delete, modify, or close Google Calendar events
- No paid ads as a Veta service. Acquirer agent is organic only
- No selling hours. Engagements are scoped agent systems
- Clients own what Veta builds

## Tools already connected (Cursor Cloud, 2026-09-17)

GitHub, Notion (Ian Veber's workspace), Google Calendar, Gmail, Google Drive, Linear, Supabase, Vercel, Higgsfield, Datadog, Figma, Playwright, Chrome DevTools.

ChatGPT joins this cloud via Custom GPT Actions (fine-grained PAT, Contents on this repo only). Claude.ai joins via Project + knowledge pack. See `connectors/README.md`.

Local Mac-only paths (not visible to Cursor Cloud):

- Obsidian vault: `/Users/ianveber/Documents/Obsidian Vault/`
- Research reports: `/Users/ianveber/Desktop/Cloude CODE/agents/research-agent/reports`
- n8n: `ian199999.app.n8n.cloud`


---

## FILE: decisions-log.md

# Decisions log

Last updated: 2026-09-17

Append-only. Newest first. Do not rewrite history — add a superseding entry.

---

## 2026-09-17 — Private memory cloud for ChatGPT + Claude + Cursor

**Decision:** One private knowledge base: `./_claude-memory/` in `ianveber/cloude-code`. ChatGPT (Custom GPT Actions + knowledge pack), Claude (Code + Claude.ai Project), and Cursor all read and write it. Cross-model work goes through `ledger.md` and `handoffs/`, not pasted chats.

**Why:** The three models cannot share a conversation. They can share files. Cursor Cloud still cannot see the Mac Obsidian vault. ChatGPT cannot see the git working tree unless it calls GitHub.

**Do not:** Keep a second wiki inside a ChatGPT Project or Claude Project. Re-upload `connectors/chatgpt/knowledge-pack.md` only as a snapshot. Live writes go to git.

**Setup:** `connectors/README.md`. Architecture: `docs/memory-cloud.md`.

---

## 2026-09-01 — Shared memory lives in this git repo

**Decision:** Claude Code and Cursor share one memory folder: `./_claude-memory/` in `ianveber/cloude-code`. Obsidian on the Mac should symlink that folder. Notion stays the human ops hub, not a second copy of these notes.

**Why:** Cursor Cloud cannot read `/Users/ianveber/Documents/Obsidian Vault/`. Claude was already instructed to use that path. Without a repo copy, the two agents drift.

**Do not:** Keep a private unsynced Obsidian-only memory after the symlink is in place.

---

## 2026-05-04 — Veta is a vertical agent agency, not ads-as-a-service

**Decision:** Current offer is complete agent systems for specialty service verticals (dental, legal, aesthetic medicine). Acquirer agent is organic only. No paid-media retainers as a product.

**Source:** `docs/positioning.md`, `docs/service-catalog.md`, `docs/principles.md` (dated with playbooks on 2026-05-04).

**Related prior identity:** Notion (2026-04) still describes **Veta Ads** as geometric red/navy performance creative. That is the earlier brand track. Do not pitch Veta as an ads agency unless Ian reopens that line.

---

## Pricing and engagement model (locked in catalog)

- Tier 1 Cluster Sprint: one cluster, 6–8 weeks, ~$18K–$45K
- Tier 2 Vertical Stack: 2–4 clusters, 10–16 weeks, ~$55K–$120K
- Tier 3 Embedded Partner: monthly retainer after handoff
- Price on value of the cluster replaced, not hours
- Read-only phase before write-access; client sign-off required
- Clients own the system; retainer is improvement, not lock-in

---

## Ethospheres (locked from skills + dashboard)

- Brand is **Ethospheres** (etho + spheres). USPTO/Trademarkia check noted as 0 conflicts in dashboard notes; file Class 3 before public announcement
- Channel: professional (clinics) first, D2C second
- Tech story: ethosome vesicles (phospholipid + ethanol, ~100–300nm) for transdermal delivery
- Manufacturing: Korean OEM with vesicular capability; Ethospheres must own SKU-specific formulations
- Team constraint: bootstrapped, Ian + 1 ops
- No celebrity / "revolutionary" voice. Talk like a dermatologist colleague

---

## Agentic OS stack (from skills)

- n8n cloud: Email, Calendar, Project, Knowledge agents
- Local: File Agent via launchd
- Daily research agent: Haiku for research, Sonnet for synthesis; 06:00 via launchd
- Business manager briefing: 07:00 Europe/Ljubljana → `./reports/YYYY-MM-DD-daily-briefing.md`

---

## Still open (not decided here)

- Whether Veta Ads creative retainers remain a live offer alongside the agent agency
- Local Obsidian notes that were not imported on 2026-09-01 — merge after `scripts/link-obsidian-memory.sh`


---

## FILE: ledger.md

# Ledger

Last updated: 2026-09-17

Append-only. Newest first. Every ChatGPT, Claude, or Cursor session that changes shared knowledge adds one entry. This is how the three models combine work without sharing a chat.

## Format

```
## YYYY-MM-DD — {chatgpt | claude | cursor | ian}

- Worked on:
- Files changed:
- For the other models:
```

---

## 2026-09-17 — cursor

- Worked on: Private memory cloud so ChatGPT, Claude, and Cursor share one knowledge base.
- Files changed: `docs/memory-cloud.md`, `connectors/**`, `_claude-memory/BOOT.md`, `_claude-memory/ledger.md`, `_claude-memory/handoffs/`, protocol updates in `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/memory.mdc`, `SYNC.md`.
- For the other models: After this lands on `main`, Ian must create the ChatGPT Custom GPT (Actions + PAT) and the Claude.ai Project. Then read `BOOT.md` + this ledger at session start. Do not keep a second wiki in ChatGPT or Claude Projects.


---

## FILE: SYNC.md

# ChatGPT ↔ Claude ↔ Cursor ↔ Obsidian sync

Last updated: 2026-09-17

## What is connected

| Surface | Role | How it stays in sync |
|---|---|---|
| **This repo** `./_claude-memory/` | Private cloud / source of truth | Git on `main`. All three models read/write these files. |
| **Cursor** | Code + ops agent | Native repo access. Rule: `.cursor/rules/memory.mdc`. |
| **Claude Code** | Code + ops agent | `CLAUDE.md` + `AGENTS.md`. |
| **ChatGPT** | Web operator | Custom GPT Actions → GitHub Contents API. Snapshot fallback: uploaded knowledge pack. |
| **Claude.ai** | Web operator | Project instructions + knowledge pack (or GitHub connector). |
| **Obsidian** | Local reading + editing | Symlink to this folder. |
| **Notion** | Human hub + live ops | MCP. Not a second memory dump. Hub: https://app.notion.com/p/3cea5cb8d3d2814f8cb2ecd4e05ed0e9 |

Full architecture: `docs/memory-cloud.md`. Connectors: `connectors/README.md`.

Cursor Cloud cannot see your Mac disk. Anything a cloud agent must know lives in this git repo.

## One-time setup on your Mac

From the repo root:

```bash
./scripts/link-obsidian-memory.sh
```

That script:

1. Copies any existing Obsidian `_claude-memory/` files into this repo if they are newer or missing here
2. Backs up the old vault folder to `_claude-memory.pre-sync-backup/`
3. Replaces the vault folder with a symlink to this repo

Open Obsidian after that. The `_claude-memory` notes should still appear; they now are these git files.

Then wire ChatGPT and Claude.ai using `connectors/README.md`.

## Daily loop

```
Obsidian (you)
    ↑ symlink
repo/_claude-memory  ←git→  Cursor + Claude Code
         ↑
         └── GitHub API (Actions) ← ChatGPT Custom GPT
         └── upload pack / GitHub connector ← Claude.ai
```

1. Agent starts → reads this folder (and `ledger.md` + `handoffs/`) → `Memory loaded — …`
2. Work happens
3. Agent ends → updates files here, appends `ledger.md`, writes a handoff if another model should continue
4. Commit + push (Cursor/Claude) or PUT via Actions (ChatGPT) so the other two see it

## Combining work across models

Do not paste chat transcripts. Write state:

- Durable facts → `context.md` / client files / `decisions-log.md`
- "I just did X" → `ledger.md`
- "You do Y next" → `handoffs/YYYY-MM-DD-from-to-to.md`

## What not to do

- Do not keep a second unsynced copy only on the Mac, only in a ChatGPT Project, or only in a Claude Project
- Do not ask any agent to remember context that is not written here
- Do not send email, close GitHub issues, delete Notion items, or change Calendar events without explicit confirmation (see `CLAUDE.md`)


---

## FILE: agentic-os.md

# Agentic OS

Last updated: 2026-09-01

## Purpose

Ian's personal operating layer: n8n agents + one local file agent + Claude/Cursor memory + daily briefing.

## Agents

### n8n (ian199999.app.n8n.cloud)

| Agent | Workflow |
|---|---|
| Email | https://ian199999.app.n8n.cloud/workflow/4WwekqSJWqzix0AV |
| Calendar | https://ian199999.app.n8n.cloud/workflow/6vMBDHDVoYUiw3TY |
| Project | https://ian199999.app.n8n.cloud/workflow/t6H02QOssSDlYwFP |
| Knowledge | https://ian199999.app.n8n.cloud/workflow/wrMzV3d9EXsLZywL |

Status checks go through n8n MCP when available. This cloud session did not verify live toggle/last-run.

### Local

- **File Agent:** `launchctl list | grep veta.fileagent`
- Logs (Mac): `~/Documents/Obsidian Vault/Agentic-OS/04-Agent-Logs/file-agent/`
- **Research agent:** `agents/research-agent/research-agent.py` — 06:00 launchd, Haiku research / Sonnet synthesis, writes reports on the Mac desktop path

### Claude / Cursor

- Daily briefing: `CLAUDE.md` → `./reports/YYYY-MM-DD-daily-briefing.md`
- Shared memory: this folder (see [[SYNC]])
- Skills: `skills/agentic-os/`

## Expected Obsidian vault layout (Mac)

`/Users/ianveber/Documents/Obsidian Vault/Agentic-OS/`

- `00-Inbox/` — agent outputs needing review
- `01-Daily/` — Calendar Agent briefs
- `02-Projects/` — Project Agent reports
- `03-Contacts/` — contact notes
- `04-Agent-Logs/` — run logs
- `05-Knowledge/` — Knowledge Agent extractions
- `_System/` — config, prompts, templates

Plus `_claude-memory/` which must be the git folder after symlink.

## Dashboard

`agentic-os.html` in repo root.


---

## FILE: clients/autoflow.md

# AutoFlow

Last updated: 2026-09-01

AI-powered lead scoring + email automation SaaS.

## Stack

Claude API + Supabase + Vercel. Target: SMB B2B sales teams.

## Core features to spec (from skill — not claimed shipped)

- Lead scoring engine (Claude classifies leads from CRM webhook)
- Email sequence generator
- Engagement tracker (open/click → score)
- CRM sync (HubSpot / Pipedrive)
- Dashboard (pipeline + scores)

Skills: `skills/autoflow/` (feature spec, lead scoring prompt, customer validation).

## Status

Product-definition stage in this repo. No production URL or customer count recorded here. If a session ships something, add the URL and date below.


---

## FILE: clients/other-projects.md

# Other projects and clients

Last updated: 2026-09-01

Names from Agentic OS daily skill and repo dashboards. Do not invent status.

| Name | Evidence in repo / Notion | Notes |
|---|---|---|
| Pacom | `pacom.html` | Active dashboard. Cleaning/coaching HQ also exists in Notion as a shared OS. |
| ATHLOS | `athlos.html` | Active dashboard. |
| ZaLife | `zalife.html` + Notion chatbot idea | See [[zalife]] |
| CASTRUM | Named in `skills/agentic-os/daily-summary.md` | No file in this repo yet |
| Alissa | Daily-summary skill | No file in this repo yet |
| Tower Spa | Daily-summary skill | Aesthetic-adjacent name; no file yet |
| 10th Planet | Daily-summary skill | No file in this repo yet |
| AI Univerza | Daily-summary skill | No file in this repo yet |
| AISOS | `aisos.html` | Dashboard present; treat as a Veta project until confirmed otherwise |
| Taskmaster | `taskmaster.html` | Internal tool surface |

When a client becomes a real engagement, create `_claude-memory/clients/[slug].md` using the [[ethospheres]] structure and add them under Active Clients in [[context]].


---

## FILE: ethospheres.md

# Ethospheres

Last updated: 2026-09-01
Status: Pre-launch. Primary venture.

## One line

Premium EU cosmesotherapy brand. Ethosome delivery for aesthetic professionals first, sophisticated consumers second.

## Positioning (internal)

Ethospheres is the ethosome delivery skincare system for aesthetic professionals and sophisticated consumers who need clinical-grade transdermal penetration without a prescription. Conventional serums sit on the stratum corneum. Ethospheres encapsulate actives (PDRN, peptides, retinoids, astaxanthin, etc.) in phospholipid-ethanol vesicles that can pass that barrier.

Voice: precise, scientific, non-condescending. Evidence-backed, direct, professional. Off-brand: "transformed!", "revolutionary", celebrity proof.

## Channel and GTM

- Primary: B2B clinics — dermatologists, plastic surgeons, medi-spas (SI/HR first-wave mentioned in GTM skill)
- Secondary: D2C digital
- Acquisition: education + GEO, not paid ads
- Founding Partner sketch (dashboard): 45% wholesale, first order min ~$300, training access, protocol cards
- Constraint: bootstrapped, Ian + 1 ops — high-leverage, low-cost actions only

## Product / formulation

Planned SKU concepts from formulation skill: Barrier Repair Serum, Peptide Eye Complex, Vitamin C Brightening Serum, Ceramide Lipid Cream, AHA Renewal Treatment. Dashboard also references an ILLUMINATE / tranexamic angle for pigmentation.

Critical contract: own the **specific formulation** per SKU. Base ethosome tech may stay with the OEM. Exclusivity window 12–24 months in Western markets is the negotiation target.

## Manufacturing

Need Korean OEM with real vesicular / ethosome capability, EU GMP / ISO 22716 or EU export experience, KOTRA-visible preferred. Standard cosmetic CMOs cannot formulate ethosomes. See skill `skills/ethospheres/korean-oem-research.md`.

Drive folder: [Ethospheres](https://drive.google.com/drive/folders/1zpxpEV4BmO06MWOfYkooTvX3kZBw_wf6) (owner: asya.grafy.bio.institute@gmail.com).

## AI / GEO build (intended, not claimed done)

- Site architecture for AI citation (`ethospheres.com`): Home, /technology, /products, /protocols, /science, /professional + `llms.txt`
- Share of Model tracking: weekly queries across ChatGPT, Claude, Perplexity, Gemini
- Professional newsletter, protocol library, consultation widget
- This is also Veta's live showcase in aesthetic medicine

## Files in this repo

- `skills/ethospheres/` — GTM, GEO writer, OEM research, SKU brief, competitor scan, KOTRA inquiry
- `dashboard.html` — Ethospheres phase board
- `verticals/aesthetic-medicine/playbook.md` — clinic-side automation clusters (Veta offer into this vertical)
- `knowledge/ethosome-technology.md` and `knowledge/geo-strategy.md` in this memory folder

## Do not invent

No launch date, revenue, signed OEM, or live site metrics are recorded here. If a session produces any of those, write them in this file before ending.


---

## FILE: handoffs/2026-09-17-cursor-to-ian.md

# Handoff — cursor → ian (then chatgpt + claude)

Date: 2026-09-17
Status: open

## Goal

Turn on the private memory cloud so ChatGPT, Claude, and Cursor share `_claude-memory/` in `ianveber/cloude-code`.

## Context already in memory

- `docs/memory-cloud.md`
- `connectors/README.md`
- `_claude-memory/BOOT.md`
- `_claude-memory/ledger.md`

## Done so far

- Repo vault `_claude-memory/` (Claude + Cursor + Obsidian) extended into a three-model cloud.
- ChatGPT Custom GPT instructions + GitHub OpenAPI Actions spec.
- Claude.ai Project instructions.
- Export script for a knowledge pack ChatGPT/Claude can upload.
- Session protocol: load MOC/context/decisions/ledger; write ledger + handoffs at end.

## Your next actions

1. Merge this PR to `main`.
2. On the Mac: `./scripts/link-obsidian-memory.sh`
3. Create a fine-grained GitHub PAT (this repo, Contents read/write) and the ChatGPT Custom GPT using `connectors/chatgpt/setup.md`.
4. Create a Claude.ai Project using `connectors/claude/setup.md`.
5. Run `./scripts/export-memory-pack.sh` and upload `connectors/chatgpt/knowledge-pack.md` to both web UIs.
6. Test: add a line to `ledger.md` in Cursor, push, ask ChatGPT "read ledger.md".

## Do not

- Do not paste a classic GitHub PAT with access to every repo.
- Do not treat a ChatGPT or Claude Project upload as a second source of truth.
- Do not ask any model to send email or edit Calendar as part of setup.


---

## FILE: handoffs/README.md

# Handoffs

Last updated: 2026-09-17

Short notes from one model to another. Not a chat log. The receiving model should do the work, update memory, then move the file to `handoffs/done/` or delete it after logging the result in `ledger.md`.

## File name

```
YYYY-MM-DD-<from>-to-<to>.md
```

`from` / `to`: `chatgpt` | `claude` | `cursor` | `ian`

## Template

```markdown
# Handoff — {from} → {to}

Date:
Status: open

## Goal
One paragraph. What done looks like.

## Context already in memory
List files the receiver must read first.

## Done so far
Bullets. Paths to diffs / PRs / drafts.

## Your next actions
Numbered. Specific.

## Do not
Anything the receiver might get wrong (scope, tone, tools).
```

## Open

See files in this folder except `README.md` and `done/`.


---

## FILE: knowledge/ethosome-technology.md

# Ethosome technology

Last updated: 2026-09-01

Working knowledge for Ethospheres and GEO content. Not a published paper. Do not over-claim clinical results that are not cited.

## What they are

Ethosomes are phospholipid vesicles with a meaningful ethanol fraction. Typical size cited in our materials: ~100–300 nm. Ethanol fluidises the stratum corneum and the vesicle membrane, so the carrier can deform and carry actives past the barrier more effectively than conventional liposomes or free serums that sit on the surface.

## Why it matters for the brand

High-value actives (peptides, retinoids, vitamin C, PDRN, tranexamic acid, astaxanthin) often fail because they do not reach the viable epidermis / dermis. The brand story is mechanism first: encapsulation + barrier passage, then result.

## Competitive frame

Korean cosmesotherapy clinics have used ethosome-style systems for years (ISOV multi-layering is the protocol reference in the dashboard). Ethospheres' job is an English-language, professional-accessible system with transparent protocols — not a mystery serum.

## Claims discipline

- Explain mechanism. Do not say "revolutionary" or guarantee outcomes
- Regulatory: EU Cosmetics Regulation 1223/2009 on every SKU brief
- OEM must actually run vesicular systems; a standard cream CMO is a miss

See `skills/ethospheres/geo-article-writer.md` for GEAF article shape.


---

## FILE: knowledge/geo-strategy.md

# GEO strategy

Last updated: 2026-09-01

GEO = Generative Engine Optimisation. Structure pages so Claude, ChatGPT, Gemini, Perplexity cite them.

## Ethospheres

GEAF-shaped articles:

1. H1 answers the likely query
2. What the science says (data, mechanisms)
3. How it works in practice
4. Common misconceptions
5. Key takeaways (5 bullets, short)
6. Source line: Ethospheres Science Hub

Allow AI search bots that cite; be deliberate about training crawlers. Dashboard notes: allow Claude-SearchBot, OAI-SearchBot, PerplexityBot; block GPTBot / Google-Extended — treat that as an intent, confirm before changing production robots.txt.

North-star marketing metric for launch: Share of Model on a fixed query set, not vanity social.

## Veta (agency)

Acquirer agent owns organic search + AI-answer presence for dental / legal / aesthetics queries. No paid campaigns. See `agents/acquirer/seo-geo-playbook.md`.


---

## FILE: README.md

# Shared agent memory

This folder is the **private cloud** for ChatGPT, Claude, and Cursor.

All three read and write these files. Obsidian on your Mac is the local editor — it should point at this same folder (see [`SYNC.md`](SYNC.md)). Architecture: `docs/memory-cloud.md`.

## Provenance

Seeded 2026-09-01 from this repo (`docs/`, `skills/`, `CLAUDE.md`, dashboards) plus Notion (Business OS, VETA HQ, Multi-Business Hub). The local Obsidian vault at `/Users/ianveber/Documents/Obsidian Vault/_claude-memory/` was **not** reachable from Cursor Cloud. If that vault is richer, copy or merge it into this folder, then run `scripts/link-obsidian-memory.sh` so Obsidian and git stay one copy.

## Session rule

At the start of every session, read in this order:

1. `🗺️ Master MOC.md`
2. `context.md`
3. `decisions-log.md`
4. `ledger.md`
5. Open files in `handoffs/`

Then open client or knowledge files only if the task needs them. Confirm with: `Memory loaded — [one line].`

At session end, write decisions, status changes, and new files back here. Append `ledger.md`. Update `Last updated` on every file you change.


---

## FILE: veta-agency.md

# Veta Agency

Last updated: 2026-09-01

## What it is

AI-native vertical agent agency. Ships production agent systems that take over one functional cluster inside a specialty service business. Practitioner-level vertical knowledge before the discovery call.

Not: AI consulting, SaaS seats, digital marketing retainers, staff augmentation, "AI for any business."

## Offer

| Tier | What | Typical |
|---|---|---|
| 1 Cluster Sprint | One cluster, 6–8 weeks, read-only then write, handoff + 30-day support | $18K–$45K |
| 2 Vertical Stack | 2–4 clusters, 10–16 weeks, unified exception dashboard | $55K–$120K |
| 3 Embedded Partner | Monthly improvement retainer after handoff | MRR |

Full catalog: `docs/service-catalog.md`. Pricing logic: `ops/pricing-architecture.md`.

## Active verticals

1. Specialty dental (implant, ortho, OMS)
2. Specialty legal (immigration, estate, IP)
3. Aesthetic medicine (MedSpa, plastics, cosmetic derm) — first-run baseline, 0 engagements in playbook as of 2026-05-04

## How we operate

- Daily sweep before 09:30 local (`ops/run-book.md`) — blockers, exception queues, AR, inbox. 15 minutes.
- Weekly Friday review 60–90 min — engagement status, pipeline, acquirer, cash, decisions
- Business manager agent: `CLAUDE.md`, 07:00 Europe/Ljubljana, `./reports/`
- Acquirer agent: organic SEO/GEO/content/partnerships only (`agents/acquirer/`)
- One named project lead per engagement (currently Ian)

## Principles (do not violate)

Vertical depth over horizontal breadth. Ship systems, not decks. Name stubs. Read-only before write. Clients own the build. Price on value. No silent failures. Slow down at compliance. Compound playbooks.

Canonical text: `docs/principles.md` and [[veta-internal/veta-principles]].

## Notion vs this repo

- This repo is the current agency OS (positioning, playbooks, delivery, skills)
- Notion VETA HQ (2026-04) is still structured as Freelance HQ: AI Video, Marketing, Finance, Weekly Planner + Client Tracker
- Keep both. Do not delete Notion. Write agency strategy changes here and in `docs/`

## Files created in this memory seed

See [[🗺️ Master MOC]]. Sync files: `_claude-memory/*`, `AGENTS.md`, `.cursor/rules/memory.mdc`, `scripts/link-obsidian-memory.sh`. Three-model cloud: `docs/memory-cloud.md`, `connectors/`.


---

## FILE: veta-internal/vertical-aesthetic-medicine.md

# Vertical — aesthetic medicine (memory)

Last updated: 2026-09-01
Canonical: `verticals/aesthetic-medicine/playbook.md`
Engagements completed (as of playbook): 0

## In scope

MedSpa, plastics, cosmetic derm, cosmetic dentistry overlap. Out: hospital plastics, insurance-driven derm, oncology aesthetics.

## Highest-leverage clusters

1. Consultation follow-up / conversion
2. Post-treatment check-in + review ask (no clinical advice from the agent)
3. Pre-treatment prep + consent
4. Membership / package renewal

Culture: nothing that feels cheap or spammy. Frame automation as a better patient experience.

Ethospheres is the in-house brand in this vertical; Veta playbook is the clinic-ops offer sold to other practices.


---

## FILE: veta-internal/veta-kpis.md

# Veta KPIs (memory)

Last updated: 2026-09-01
Canonical: `ops/kpi-framework.md`

Three layers:

1. **Agency health** — MRR (Tier 3 only), monthly build cash, weighted pipeline, concentration (<40% one client), AR aging
2. **Delivery quality** — on-time milestones, exception rates, handoff pass
3. **Client outcomes** — hours recovered, revenue recovered, review/conversion lifts per vertical playbook

Cadence: weekly delivery + pipeline; monthly all three layers; quarterly trends. Daily KPIs: none — daily is a 15-minute sweep, not a metrics dive.


---

## FILE: veta-internal/veta-positioning.md

# Veta positioning (memory)

Last updated: 2026-09-01
Canonical: `docs/positioning.md`

## Thesis

Service businesses in high-stakes verticals have repeatable, expensive workflows and no engineering capacity. Veta replaces a defined cluster with an agent system built for that industry.

## We are / we are not

**Are:** practitioners who ship production systems, scoped to a cluster, handed off with docs.

**Are not:** strategy consultants, SaaS, digital marketing agency, staffing layer, horizontal "AI for anyone."

## ICP

Specialty service business, 5–150 people, high-stakes repeatable ops, owner / practice manager / COO as buyer. No internal engineering team.

## Pitch (keep this wording close)

A practice runs on a handful of high-stakes workflows. Those currently run on staff time, disconnected tools, and manual coordination. Veta replaces one cluster (intake, scheduling, follow-up, etc.) with a system that runs, surfaces exceptions, and can be operated by the client's team. Build in 6–10 weeks. They own it.


---

## FILE: veta-internal/veta-principles.md

# Veta principles (memory)

Last updated: 2026-09-01
Canonical: `docs/principles.md`

1. Vertical depth beats horizontal breadth
2. Ship systems, not deliverables
3. Name stubs vs locked-in
4. Read-only before write
5. Clients own what we build
6. Price on value, not time
7. No silent failures
8. Slow down at compliance boundaries
9. One throat to choke
10. Compound the playbooks


---

## FILE: veta-internal/veta-services.md

# Veta services (memory)

Last updated: 2026-09-01
Canonical: `docs/service-catalog.md`

- **Tier 1 — Cluster Sprint:** one cluster, 6–8 weeks, $18K–$45K, 30-day bug-fix window
- **Tier 2 — Vertical Stack:** 2–4 clusters, 10–16 weeks, $55K–$120K, 3 months improvement retainer included
- **Tier 3 — Embedded Partner:** monthly retainer, monitoring + backlog, not on-call infra

Not included in any tier: replacing the client's core EHR/CRM, compliance certification, paid ads, generic chatbot seats.


---

## FILE: zalife.md

# ZaLife

Last updated: 2026-09-01

Youth leadership / bootcamp (zalife.eu). Veta project dashboard: `zalife.html`.

## Known work

- Notion idea (2026-04-25): AI-powered parent onboarding chatbot for zalife.eu — WhatsApp or web chat (Make.com + Claude API) that walks parents through discovery
- Research-agent queries: youth leadership bootcamp Slovenia; leadership programs for teenagers in Europe

## Status

No signed scope, revenue, or launch milestone is recorded in this seed. Update this file when a phase or owner is confirmed.

