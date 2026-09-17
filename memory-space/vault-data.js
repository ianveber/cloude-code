window.MEMORY_VAULT = {
  "generated_at": "2026-09-17T11:51:09Z",
  "memory_root": "_claude-memory",
  "palette": {
    "claude": {
      "id": "claude",
      "label": "Claude",
      "color": "#F97316",
      "colorDim": "rgba(249, 115, 22, 0.16)"
    },
    "chatgpt": {
      "id": "chatgpt",
      "label": "ChatGPT",
      "color": "#3B82F6",
      "colorDim": "rgba(59, 130, 246, 0.16)"
    },
    "cursor": {
      "id": "cursor",
      "label": "Cursor",
      "color": "#A855F7",
      "colorDim": "rgba(168, 85, 247, 0.16)"
    },
    "ian": {
      "id": "ian",
      "label": "Ian",
      "color": "#2DD4BF",
      "colorDim": "rgba(45, 212, 191, 0.16)"
    }
  },
  "counts": {
    "claude": 1,
    "chatgpt": 1,
    "cursor": 24,
    "ian": 1
  },
  "notes": [
    {
      "id": "agentic-os",
      "path": "agentic-os.md",
      "folder": "",
      "title": "Agentic OS",
      "body": "# Agentic OS\n\nLast updated: 2026-09-01\n\n## Purpose\n\nIan's personal operating layer: n8n agents + one local file agent + Claude/Cursor memory + daily briefing.\n\n## Agents\n\n### n8n (ian199999.app.n8n.cloud)\n\n| Agent | Workflow |\n|---|---|\n| Email | https://ian199999.app.n8n.cloud/workflow/4WwekqSJWqzix0AV |\n| Calendar | https://ian199999.app.n8n.cloud/workflow/6vMBDHDVoYUiw3TY |\n| Project | https://ian199999.app.n8n.cloud/workflow/t6H02QOssSDlYwFP |\n| Knowledge | https://ian199999.app.n8n.cloud/workflow/wrMzV3d9EXsLZywL |\n\nStatus checks go through n8n MCP when available. This cloud session did not verify live toggle/last-run.\n\n### Local\n\n- **File Agent:** `launchctl list | grep veta.fileagent`\n- Logs (Mac): `~/Documents/Obsidian Vault/Agentic-OS/04-Agent-Logs/file-agent/`\n- **Research agent:** `agents/research-agent/research-agent.py` — 06:00 launchd, Haiku research / Sonnet synthesis, writes reports on the Mac desktop path\n\n### Claude / Cursor\n\n- Daily briefing: `CLAUDE.md` → `./reports/YYYY-MM-DD-daily-briefing.md`\n- Shared memory: this folder (see [[SYNC]])\n- Skills: `skills/agentic-os/`\n\n## Expected Obsidian vault layout (Mac)\n\n`/Users/ianveber/Documents/Obsidian Vault/Agentic-OS/`\n\n- `00-Inbox/` — agent outputs needing review\n- `01-Daily/` — Calendar Agent briefs\n- `02-Projects/` — Project Agent reports\n- `03-Contacts/` — contact notes\n- `04-Agent-Logs/` — run logs\n- `05-Knowledge/` — Knowledge Agent extractions\n- `_System/` — config, prompts, templates\n\nPlus `_claude-memory/` which must be the git folder after symlink.\n\n## Dashboard\n\n`agentic-os.html` in repo root.\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [
        {
          "target": "SYNC",
          "display": "SYNC",
          "resolved": "SYNC"
        }
      ],
      "last_updated": "2026-09-01",
      "word_count": 191,
      "resolved_links": [
        "SYNC"
      ],
      "backlinks": [
        "🗺️ Master MOC"
      ]
    },
    {
      "id": "BOOT",
      "path": "BOOT.md",
      "folder": "",
      "title": "BOOT — Veta Memory Cloud",
      "body": "# BOOT — Veta Memory Cloud\n\nLast updated: 2026-09-17\n\nUpload this file into ChatGPT and Claude.ai when you cannot read the repo live. Prefer live `_claude-memory/` files when Actions / Claude Code / Cursor are available.\n\nAfter loading, say: `Memory loaded — Veta agency + Ethospheres pre-launch + AutoFlow; shared cloud is _claude-memory in ianveber/cloude-code.`\n\n## Who\n\nIan Veber (`ian.veber@gmail.com`). Founder. Europe/Ljubljana. Solo operator.\n\n## Shared cloud\n\nPrivate GitHub repo `ianveber/cloude-code`, folder `_claude-memory/`. ChatGPT, Claude, and Cursor all read and write it. Protocol: `docs/memory-cloud.md`.\n\nStart: MOC → context.md → decisions-log.md → ledger.md → handoffs/.\nEnd: update files, append ledger, write a handoff if another model continues.\n\n## Active businesses\n\n**Veta** — AI-native vertical agent agency. Ships complete agent systems that replace one functional cluster inside a specialty service business. Tiers: Cluster Sprint $18K–$45K; Vertical Stack $55K–$120K; Embedded Partner retainer. Verticals: specialty dental, specialty legal, aesthetic medicine. Not ads-as-a-service, not hours, not SaaS seats. Clients own the build.\n\n**Ethospheres** — premium EU cosmesotherapy, ethosome delivery, pre-launch. Clinics first (derm, plastics, medi-spa), D2C second. Bootstrapped, Ian + 1 ops. Voice: scientific, not \"revolutionary.\"\n\n**AutoFlow** — AI lead scoring + email automation SaaS (Claude API + Supabase + Vercel). SMB B2B sales teams.\n\n## Named clients / related\n\nZaLife, Pacom, ATHLOS, CASTRUM, Alissa, Tower Spa, 10th Planet, AI Univerza — see `clients/other-projects.md`. Do not invent status.\n\n## Hard rules\n\nNo email send without approval. GitHub issues read-only unless Ian confirms. No deleting Notion/GitHub items. No Calendar mutations. No silent failures. No invented progress.\n\n## Locked decisions (short)\n\n- Shared memory lives in this git repo, not only in local Obsidian.\n- ChatGPT + Claude + Cursor are peers on that folder (2026-09-17).\n- Veta offer is vertical agent systems, not Veta Ads retainers, unless Ian reopens ads.\n- Price on value of the cluster replaced. Read-only phase before write-access.\n\n## Where to look next\n\n| Need | File |\n|---|---|\n| Map of maps | `🗺️ Master MOC.md` |\n| Full context | `context.md` |\n| Decisions | `decisions-log.md` |\n| What the others just did | `ledger.md` |\n| Pick up their work | `handoffs/` |\n| Ethospheres | `ethospheres.md` |\n| Agency | `veta-agency.md` |\n| ChatGPT wiring | `connectors/chatgpt/setup.md` |\n| Claude wiring | `connectors/claude/setup.md` |\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [],
      "last_updated": "2026-09-17",
      "word_count": 376,
      "resolved_links": [],
      "backlinks": [
        "🗺️ Master MOC"
      ]
    },
    {
      "id": "clients/autoflow",
      "path": "clients/autoflow.md",
      "folder": "clients",
      "title": "AutoFlow",
      "body": "# AutoFlow\n\nLast updated: 2026-09-01\n\nAI-powered lead scoring + email automation SaaS.\n\n## Stack\n\nClaude API + Supabase + Vercel. Target: SMB B2B sales teams.\n\n## Core features to spec (from skill — not claimed shipped)\n\n- Lead scoring engine (Claude classifies leads from CRM webhook)\n- Email sequence generator\n- Engagement tracker (open/click → score)\n- CRM sync (HubSpot / Pipedrive)\n- Dashboard (pipeline + scores)\n\nSkills: `skills/autoflow/` (feature spec, lead scoring prompt, customer validation).\n\n## Status\n\nProduct-definition stage in this repo. No production URL or customer count recorded here. If a session ships something, add the URL and date below.\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [],
      "last_updated": "2026-09-01",
      "word_count": 102,
      "resolved_links": [],
      "backlinks": [
        "context",
        "🗺️ Master MOC"
      ]
    },
    {
      "id": "clients/other-projects",
      "path": "clients/other-projects.md",
      "folder": "clients",
      "title": "Other projects and clients",
      "body": "# Other projects and clients\n\nLast updated: 2026-09-01\n\nNames from Agentic OS daily skill and repo dashboards. Do not invent status.\n\n| Name | Evidence in repo / Notion | Notes |\n|---|---|---|\n| Pacom | `pacom.html` | Active dashboard. Cleaning/coaching HQ also exists in Notion as a shared OS. |\n| ATHLOS | `athlos.html` | Active dashboard. |\n| ZaLife | `zalife.html` + Notion chatbot idea | See [[zalife]] |\n| CASTRUM | Named in `skills/agentic-os/daily-summary.md` | No file in this repo yet |\n| Alissa | Daily-summary skill | No file in this repo yet |\n| Tower Spa | Daily-summary skill | Aesthetic-adjacent name; no file yet |\n| 10th Planet | Daily-summary skill | No file in this repo yet |\n| AI Univerza | Daily-summary skill | No file in this repo yet |\n| AISOS | `aisos.html` | Dashboard present; treat as a Veta project until confirmed otherwise |\n| Taskmaster | `taskmaster.html` | Internal tool surface |\n\nWhen a client becomes a real engagement, create `_claude-memory/clients/[slug].md` using the [[ethospheres]] structure and add them under Active Clients in [[context]].\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [
        {
          "target": "zalife",
          "display": "zalife",
          "resolved": "zalife"
        },
        {
          "target": "ethospheres",
          "display": "ethospheres",
          "resolved": "ethospheres"
        },
        {
          "target": "context",
          "display": "context",
          "resolved": "context"
        }
      ],
      "last_updated": "2026-09-01",
      "word_count": 185,
      "resolved_links": [
        "zalife",
        "ethospheres",
        "context"
      ],
      "backlinks": [
        "context",
        "🗺️ Master MOC"
      ]
    },
    {
      "id": "context",
      "path": "context.md",
      "folder": "",
      "title": "Context",
      "body": "# Context\n\nLast updated: 2026-09-17\n\n## Who\n\n**Ian Veber** (`ian.veber@gmail.com`). Founder / operator. Timezone: Europe/Ljubljana. Solo-founder stage — he is project lead, delivery, and ops.\n\nDo not ask him to re-explain businesses, clients, or decisions that are already in this folder.\n\n## Shared operators\n\nChatGPT, Claude, and Cursor are peers on this memory cloud. They do not share chats. They share `_claude-memory/`. See `docs/memory-cloud.md`.\n\n## Active businesses\n\n### Veta — AI-native vertical agent agency (primary operating company)\n\nShips complete agent systems that replace a functional cluster inside a specialty service business. Not seats, not hours, not generic strategy decks.\n\n- Repo: `github.com/ianveber/cloude-code`\n- Positioning, catalog, principles: `docs/`\n- Daily business manager: `CLAUDE.md` (07:00 Europe/Ljubljana)\n- Notion: [VETA HQ](https://app.notion.com/p/344a5cb8d3d2813ca1a7f27074efb068), [BUSINESS OS](https://app.notion.com/p/345a5cb8d3d281cba3f7cb57bf9b5898)\n- Earlier brand track in Notion: **Veta Ads** — geometric red/navy, ads & creative. Agency positioning in this repo has moved to vertical agent systems. Treat Veta Ads as the prior creative/ads identity, not the current offer.\n\n### Ethospheres — premium ethosome cosmesotherapy brand (primary venture)\n\nPre-launch. EU. Professional channel first (derm, plastics, medi-spa), D2C second. Proprietary ethosome delivery. Bootstrapped, lean team (Ian + 1 ops). See [[ethospheres]].\n\n### AutoFlow — AI lead scoring + email automation SaaS\n\nClaude API + Supabase + Vercel. Target: SMB B2B sales teams. See [[clients/autoflow]].\n\n### Ian Freelance (Notion)\n\nCinematic / AI-video track inside Business OS. Signature tools noted there: Kling 3.0, Seedance 2.0, Higgsfield Cinema 2.5, Nano Banana, Claude, DaVinci Resolve.\n\n## Active / named clients (Veta + related)\n\nFrom daily-summary skill and dashboards. Status in each file is a snapshot, not invented progress.\n\n| Name | Notes | Memory |\n|---|---|---|\n| Ethospheres | Own brand, pre-launch | [[ethospheres]] |\n| AutoFlow | Own SaaS | [[clients/autoflow]] |\n| ZaLife / zalife.eu | Youth leadership; parent onboarding chatbot idea in Notion | [[zalife]] |\n| Pacom | Dashboard in repo (`pacom.html`) | [[clients/other-projects]] |\n| ATHLOS | Dashboard in repo (`athlos.html`) | [[clients/other-projects]] |\n| CASTRUM | Named in Agentic OS daily skill | [[clients/other-projects]] |\n| Alissa | Named in Agentic OS daily skill | [[clients/other-projects]] |\n| Tower Spa | Named in Agentic OS daily skill | [[clients/other-projects]] |\n| 10th Planet | Named in Agentic OS daily skill | [[clients/other-projects]] |\n| AI Univerza | Named in Agentic OS daily skill | [[clients/other-projects]] |\n\n## Active verticals (Veta)\n\nIn development: specialty dental, specialty legal, aesthetic medicine.\n\nRoadmap: maritime, fintech back-office, B2B SaaS ops.\n\n## Operating constraints\n\n- Never send / draft / schedule email without explicit approval this session\n- Never modify, close, comment on, or reassign GitHub issues without confirmation\n- Never delete Notion or GitHub items; archive only when confirmed\n- Never delete, modify, or close Google Calendar events\n- No paid ads as a Veta service. Acquirer agent is organic only\n- No selling hours. Engagements are scoped agent systems\n- Clients own what Veta builds\n\n## Tools already connected (Cursor Cloud, 2026-09-17)\n\nGitHub, Notion (Ian Veber's workspace), Google Calendar, Gmail, Google Drive, Linear, Supabase, Vercel, Higgsfield, Datadog, Figma, Playwright, Chrome DevTools.\n\nChatGPT joins this cloud via Custom GPT Actions (fine-grained PAT, Contents on this repo only). Claude.ai joins via Project + knowledge pack. See `connectors/README.md`.\n\nLocal Mac-only paths (not visible to Cursor Cloud):\n\n- Obsidian vault: `/Users/ianveber/Documents/Obsidian Vault/`\n- Research reports: `/Users/ianveber/Desktop/Cloude CODE/agents/research-agent/reports`\n- n8n: `ian199999.app.n8n.cloud`\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [
        {
          "target": "ethospheres",
          "display": "ethospheres",
          "resolved": "ethospheres"
        },
        {
          "target": "clients/autoflow",
          "display": "clients/autoflow",
          "resolved": "clients/autoflow"
        },
        {
          "target": "zalife",
          "display": "zalife",
          "resolved": "zalife"
        },
        {
          "target": "clients/other-projects",
          "display": "clients/other-projects",
          "resolved": "clients/other-projects"
        }
      ],
      "last_updated": "2026-09-17",
      "word_count": 551,
      "resolved_links": [
        "ethospheres",
        "clients/autoflow",
        "zalife",
        "clients/other-projects"
      ],
      "backlinks": [
        "clients/other-projects",
        "🗺️ Master MOC"
      ]
    },
    {
      "id": "decisions-log",
      "path": "decisions-log.md",
      "folder": "",
      "title": "Decisions log",
      "body": "# Decisions log\n\nLast updated: 2026-09-17\n\nAppend-only. Newest first. Do not rewrite history — add a superseding entry.\n\n---\n\n## 2026-09-17 — Memory Space viewer with LLM colors\n\n**Decision:** `_claude-memory/` gets a local Obsidian-style viewer at `memory-space/`. Each note is colored by writer: Claude orange, ChatGPT blue, Cursor purple, Ian teal.\n\n**How:** YAML `source` / `sources` plus `<!-- source:name -->` blocks. Open with `./scripts/memory-space.sh`. Do not deploy that folder publicly.\n\n**Do not:** Keep a second unsynced wiki. This is a view of the same git files.\n\n---\n\n## 2026-09-17 — Claude.ai Project deferred\n\n**Decision:** Do not set up the Claude.ai browser Project now. Ian will do it later if he wants Claude in the browser on the same memory.\n\n**Live today:** git `_claude-memory/` on `main`; Cursor; Claude Code (this repo); ChatGPT Custom GPT `Veta Memory` (Actions + knowledge pack). Obsidian linked via `~/Desktop/cloude-code`.\n\n**Later:** `connectors/claude/setup.md`.\n\n**Do not:** Nag Ian to create the Claude.ai Project in every session.\n\n---\n\n## 2026-09-17 — Private memory cloud for ChatGPT + Claude + Cursor\n\n**Decision:** One private knowledge base: `./_claude-memory/` in `ianveber/cloude-code`. ChatGPT (Custom GPT Actions + knowledge pack), Claude (Code + Claude.ai Project), and Cursor all read and write it. Cross-model work goes through `ledger.md` and `handoffs/`, not pasted chats.\n\n**Why:** The three models cannot share a conversation. They can share files. Cursor Cloud still cannot see the Mac Obsidian vault. ChatGPT cannot see the git working tree unless it calls GitHub.\n\n**Do not:** Keep a second wiki inside a ChatGPT Project or Claude Project. Do not enable Obsidian Sync on `_claude-memory`. Re-upload `connectors/chatgpt/knowledge-pack.md` only as a snapshot. Live writes go to git.\n\n**Setup:** `connectors/README.md`. Architecture: `docs/memory-cloud.md`.\n\n---\n\n## 2026-09-01 — Shared memory lives in this git repo\n\n**Decision:** Claude Code and Cursor share one memory folder: `./_claude-memory/` in `ianveber/cloude-code`. Obsidian on the Mac should symlink that folder. Notion stays the human ops hub, not a second copy of these notes.\n\n**Why:** Cursor Cloud cannot read `/Users/ianveber/Documents/Obsidian Vault/`. Claude was already instructed to use that path. Without a repo copy, the two agents drift.\n\n**Do not:** Keep a private unsynced Obsidian-only memory after the symlink is in place.\n\n---\n\n## 2026-05-04 — Veta is a vertical agent agency, not ads-as-a-service\n\n**Decision:** Current offer is complete agent systems for specialty service verticals (dental, legal, aesthetic medicine). Acquirer agent is organic only. No paid-media retainers as a product.\n\n**Source:** `docs/positioning.md`, `docs/service-catalog.md`, `docs/principles.md` (dated with playbooks on 2026-05-04).\n\n**Related prior identity:** Notion (2026-04) still describes **Veta Ads** as geometric red/navy performance creative. That is the earlier brand track. Do not pitch Veta as an ads agency unless Ian reopens that line.\n\n---\n\n## Pricing and engagement model (locked in catalog)\n\n- Tier 1 Cluster Sprint: one cluster, 6–8 weeks, ~$18K–$45K\n- Tier 2 Vertical Stack: 2–4 clusters, 10–16 weeks, ~$55K–$120K\n- Tier 3 Embedded Partner: monthly retainer after handoff\n- Price on value of the cluster replaced, not hours\n- Read-only phase before write-access; client sign-off required\n- Clients own the system; retainer is improvement, not lock-in\n\n---\n\n## Ethospheres (locked from skills + dashboard)\n\n- Brand is **Ethospheres** (etho + spheres). USPTO/Trademarkia check noted as 0 conflicts in dashboard notes; file Class 3 before public announcement\n- Channel: professional (clinics) first, D2C second\n- Tech story: ethosome vesicles (phospholipid + ethanol, ~100–300nm) for transdermal delivery\n- Manufacturing: Korean OEM with vesicular capability; Ethospheres must own SKU-specific formulations\n- Team constraint: bootstrapped, Ian + 1 ops\n- No celebrity / \"revolutionary\" voice. Talk like a dermatologist colleague\n\n---\n\n## Agentic OS stack (from skills)\n\n- n8n cloud: Email, Calendar, Project, Knowledge agents\n- Local: File Agent via launchd\n- Daily research agent: Haiku for research, Sonnet for synthesis; 06:00 via launchd\n- Business manager briefing: 07:00 Europe/Ljubljana → `./reports/YYYY-MM-DD-daily-briefing.md`\n\n---\n\n## Still open (not decided here)\n\n- Whether Veta Ads creative retainers remain a live offer alongside the agent agency\n- Local Obsidian notes that were not imported on 2026-09-01 — merge after `scripts/link-obsidian-memory.sh`\n",
      "source": "cursor",
      "sources": [
        "cursor",
        "ian"
      ],
      "spans": [],
      "links": [],
      "last_updated": "2026-09-17",
      "word_count": 658,
      "resolved_links": [],
      "backlinks": [
        "🗺️ Master MOC"
      ]
    },
    {
      "id": "ethospheres",
      "path": "ethospheres.md",
      "folder": "",
      "title": "Ethospheres",
      "body": "# Ethospheres\n\nLast updated: 2026-09-01\nStatus: Pre-launch. Primary venture.\n\n## One line\n\nPremium EU cosmesotherapy brand. Ethosome delivery for aesthetic professionals first, sophisticated consumers second.\n\n## Positioning (internal)\n\nEthospheres is the ethosome delivery skincare system for aesthetic professionals and sophisticated consumers who need clinical-grade transdermal penetration without a prescription. Conventional serums sit on the stratum corneum. Ethospheres encapsulate actives (PDRN, peptides, retinoids, astaxanthin, etc.) in phospholipid-ethanol vesicles that can pass that barrier.\n\nVoice: precise, scientific, non-condescending. Evidence-backed, direct, professional. Off-brand: \"transformed!\", \"revolutionary\", celebrity proof.\n\n## Channel and GTM\n\n- Primary: B2B clinics — dermatologists, plastic surgeons, medi-spas (SI/HR first-wave mentioned in GTM skill)\n- Secondary: D2C digital\n- Acquisition: education + GEO, not paid ads\n- Founding Partner sketch (dashboard): 45% wholesale, first order min ~$300, training access, protocol cards\n- Constraint: bootstrapped, Ian + 1 ops — high-leverage, low-cost actions only\n\n## Product / formulation\n\nPlanned SKU concepts from formulation skill: Barrier Repair Serum, Peptide Eye Complex, Vitamin C Brightening Serum, Ceramide Lipid Cream, AHA Renewal Treatment. Dashboard also references an ILLUMINATE / tranexamic angle for pigmentation.\n\nCritical contract: own the **specific formulation** per SKU. Base ethosome tech may stay with the OEM. Exclusivity window 12–24 months in Western markets is the negotiation target.\n\n## Manufacturing\n\nNeed Korean OEM with real vesicular / ethosome capability, EU GMP / ISO 22716 or EU export experience, KOTRA-visible preferred. Standard cosmetic CMOs cannot formulate ethosomes. See skill `skills/ethospheres/korean-oem-research.md`.\n\nDrive folder: [Ethospheres](https://drive.google.com/drive/folders/1zpxpEV4BmO06MWOfYkooTvX3kZBw_wf6) (owner: asya.grafy.bio.institute@gmail.com).\n\n## AI / GEO build (intended, not claimed done)\n\n- Site architecture for AI citation (`ethospheres.com`): Home, /technology, /products, /protocols, /science, /professional + `llms.txt`\n- Share of Model tracking: weekly queries across ChatGPT, Claude, Perplexity, Gemini\n- Professional newsletter, protocol library, consultation widget\n- This is also Veta's live showcase in aesthetic medicine\n\n## Files in this repo\n\n- `skills/ethospheres/` — GTM, GEO writer, OEM research, SKU brief, competitor scan, KOTRA inquiry\n- `dashboard.html` — Ethospheres phase board\n- `verticals/aesthetic-medicine/playbook.md` — clinic-side automation clusters (Veta offer into this vertical)\n- `knowledge/ethosome-technology.md` and `knowledge/geo-strategy.md` in this memory folder\n\n## Do not invent\n\nNo launch date, revenue, signed OEM, or live site metrics are recorded here. If a session produces any of those, write them in this file before ending.\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [],
      "last_updated": "2026-09-01",
      "word_count": 369,
      "resolved_links": [],
      "backlinks": [
        "clients/other-projects",
        "context",
        "🗺️ Master MOC"
      ]
    },
    {
      "id": "handoffs/2026-09-17-cursor-to-chatgpt",
      "path": "handoffs/2026-09-17-cursor-to-chatgpt.md",
      "folder": "handoffs",
      "title": "Handoff — cursor → chatgpt / claude",
      "body": "# Handoff — cursor → chatgpt / claude\n\nDate: 2026-09-17\nStatus: open\n\n## Goal\n\nWhen you write `_claude-memory/` notes, stamp who wrote them so Memory Space can color the vault.\n\n## Context already in memory\n\n- [[memory-space]]\n- `docs/memory-space.md`\n- Colors: Claude orange, ChatGPT blue, Cursor purple, Ian teal\n\n## Done so far\n\nCursor built `memory-space/` (Notes / Graph / Ledger / search). Index: `python3 scripts/build-memory-space.py`. Open: `./scripts/memory-space.sh`.\n\n## Your next actions\n\n1. On any file you change, set `source: chatgpt` or `source: claude` and merge yourself into `sources:`.\n2. If you only add a section, wrap it in `<!-- source:chatgpt -->` or `<!-- source:claude -->` … `<!-- /source -->`.\n3. Do not label Cursor's older notes as yours.\n\n## Do not\n\n- Deploy `memory-space/` publicly\n- Invent client progress\n- Skip the YAML stamp — without it the note stays purple (Cursor) or uncolored\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [
        {
          "target": "memory-space",
          "display": "memory-space",
          "resolved": "memory-space"
        }
      ],
      "last_updated": null,
      "word_count": 145,
      "resolved_links": [
        "memory-space"
      ],
      "backlinks": []
    },
    {
      "id": "handoffs/2026-09-17-cursor-to-ian",
      "path": "handoffs/2026-09-17-cursor-to-ian.md",
      "folder": "handoffs",
      "title": "Handoff — cursor → ian",
      "body": "# Handoff — cursor → ian\n\nDate: 2026-09-17\nStatus: done for now (Claude.ai Project deferred)\n\n## Live\n\n- `_claude-memory/` on `main`\n- Cursor + Claude Code\n- ChatGPT Custom GPT `Veta Memory`\n- Obsidian via `~/Desktop/cloude-code`\n\n## Later (only if Ian asks)\n\nClaude.ai Project: `connectors/claude/setup.md`\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [],
      "last_updated": null,
      "word_count": 45,
      "resolved_links": [],
      "backlinks": []
    },
    {
      "id": "handoffs/README",
      "path": "handoffs/README.md",
      "folder": "handoffs",
      "title": "Handoffs",
      "body": "# Handoffs\n\nLast updated: 2026-09-17\n\nShort notes from one model to another. Not a chat log. The receiving model should do the work, update memory, then move the file to `handoffs/done/` or delete it after logging the result in `ledger.md`.\n\n## File name\n\n```\nYYYY-MM-DD-<from>-to-<to>.md\n```\n\n`from` / `to`: `chatgpt` | `claude` | `cursor` | `ian`\n\n## Template\n\n```markdown\n# Handoff — {from} → {to}\n\nDate:\nStatus: open\n\n## Goal\nOne paragraph. What done looks like.\n\n## Context already in memory\nList files the receiver must read first.\n\n## Done so far\nBullets. Paths to diffs / PRs / drafts.\n\n## Your next actions\nNumbered. Specific.\n\n## Do not\nAnything the receiver might get wrong (scope, tone, tools).\n```\n\n## Open\n\nSee files in this folder except `README.md` and `done/`.\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [],
      "last_updated": "2026-09-17",
      "word_count": 130,
      "resolved_links": [],
      "backlinks": []
    },
    {
      "id": "knowledge/ethosome-technology",
      "path": "knowledge/ethosome-technology.md",
      "folder": "knowledge",
      "title": "Ethosome technology",
      "body": "# Ethosome technology\n\nLast updated: 2026-09-01\n\nWorking knowledge for Ethospheres and GEO content. Not a published paper. Do not over-claim clinical results that are not cited.\n\n## What they are\n\nEthosomes are phospholipid vesicles with a meaningful ethanol fraction. Typical size cited in our materials: ~100–300 nm. Ethanol fluidises the stratum corneum and the vesicle membrane, so the carrier can deform and carry actives past the barrier more effectively than conventional liposomes or free serums that sit on the surface.\n\n## Why it matters for the brand\n\nHigh-value actives (peptides, retinoids, vitamin C, PDRN, tranexamic acid, astaxanthin) often fail because they do not reach the viable epidermis / dermis. The brand story is mechanism first: encapsulation + barrier passage, then result.\n\n## Competitive frame\n\nKorean cosmesotherapy clinics have used ethosome-style systems for years (ISOV multi-layering is the protocol reference in the dashboard). Ethospheres' job is an English-language, professional-accessible system with transparent protocols — not a mystery serum.\n\n## Claims discipline\n\n- Explain mechanism. Do not say \"revolutionary\" or guarantee outcomes\n- Regulatory: EU Cosmetics Regulation 1223/2009 on every SKU brief\n- OEM must actually run vesicular systems; a standard cream CMO is a miss\n\nSee `skills/ethospheres/geo-article-writer.md` for GEAF article shape.\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [],
      "last_updated": "2026-09-01",
      "word_count": 200,
      "resolved_links": [],
      "backlinks": [
        "🗺️ Master MOC"
      ]
    },
    {
      "id": "knowledge/geo-strategy",
      "path": "knowledge/geo-strategy.md",
      "folder": "knowledge",
      "title": "GEO strategy",
      "body": "# GEO strategy\n\nLast updated: 2026-09-01\n\nGEO = Generative Engine Optimisation. Structure pages so Claude, ChatGPT, Gemini, Perplexity cite them.\n\n## Ethospheres\n\nGEAF-shaped articles:\n\n1. H1 answers the likely query\n2. What the science says (data, mechanisms)\n3. How it works in practice\n4. Common misconceptions\n5. Key takeaways (5 bullets, short)\n6. Source line: Ethospheres Science Hub\n\nAllow AI search bots that cite; be deliberate about training crawlers. Dashboard notes: allow Claude-SearchBot, OAI-SearchBot, PerplexityBot; block GPTBot / Google-Extended — treat that as an intent, confirm before changing production robots.txt.\n\nNorth-star marketing metric for launch: Share of Model on a fixed query set, not vanity social.\n\n## Veta (agency)\n\nAcquirer agent owns organic search + AI-answer presence for dental / legal / aesthetics queries. No paid campaigns. See `agents/acquirer/seo-geo-playbook.md`.\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [],
      "last_updated": "2026-09-01",
      "word_count": 129,
      "resolved_links": [],
      "backlinks": [
        "🗺️ Master MOC"
      ]
    },
    {
      "id": "ledger",
      "path": "ledger.md",
      "folder": "",
      "title": "Ledger",
      "body": "# Ledger\n\nLast updated: 2026-09-17\n\nAppend-only. Newest first. Every ChatGPT, Claude, or Cursor session that changes shared knowledge adds one entry. This is how the three models combine work without sharing a chat.\n\n## Format\n\n```\n## YYYY-MM-DD — {chatgpt | claude | cursor | ian}\n\n- Worked on:\n- Files changed:\n- For the other models:\n```\n\n---\n\n## 2026-09-17 — cursor\n\n- Worked on: Memory Space — Obsidian-style vault viewer with LLM colors (Claude orange, ChatGPT blue, Cursor purple).\n- Files changed: `memory-space/`, `scripts/build-memory-space.py`, `scripts/memory-space.sh`, `_claude-memory/memory-space.md`, `docs/memory-space.md`, agent source-stamp protocol.\n- For the other models: Stamp `source:` / `sources:` when you write. Partial blocks: `<!-- source:chatgpt -->` or `<!-- source:claude -->`. Ian opens the vault with `./scripts/memory-space.sh`.\n\n---\n\n## 2026-09-17 — ian / cursor\n\n- Worked on: Ian finished ChatGPT `Veta Memory` GPT. Claude.ai Project skipped for now; do later.\n- Files changed: `decisions-log.md`, this ledger, handoff marked deferred.\n- For the other models: Do not ask Ian to set up Claude.ai this session. Cursor + ChatGPT + Claude Code already share `_claude-memory/`.\n\n---\n\n## 2026-09-17 — cursor (Mac path was wrong)\n\n- Worked on: Ian's Terminal failed because `~/Desktop/Cloude CODE` does not exist. Setup now clones to `~/Desktop/cloude-code` if needed.\n- Files changed: `connectors/YOU-DO-THIS.md`, `scripts/mac-bootstrap.sh`\n- For the other models: Do not tell Ian to cd into Desktop/Cloude CODE.\n\n---\n\n## 2026-09-17 — cursor (merged + remaining Mac/account steps)\n\n- Worked on: Merged PR #8 to main. Cloud VM has no Mac, no ChatGPT login, no Claude.ai login.\n- Files changed: `connectors/YOU-DO-THIS.md` updated to remaining steps only.\n- For the other models: Memory cloud is on `main`. Ian still links Obsidian and creates the GPT/Project.\n\n---\n\n## 2026-09-17 — cursor (Obsidian upgrade)\n\n- Worked on: How to upgrade Obsidian so the Mac vault uses the private memory cloud (app update + symlink + memory-sync).\n- Files changed: `connectors/obsidian/`, `scripts/upgrade-obsidian.sh`, `scripts/memory-sync.sh`, `SYNC.md`.\n- For the other models: After merge, Ian runs `./scripts/upgrade-obsidian.sh` on the Mac, then `./scripts/memory-sync.sh` when he edits notes. Do not turn on Obsidian Sync. Do not git-init the personal vault.\n\n## 2026-09-17 — cursor\n\n- Worked on: Private memory cloud so ChatGPT, Claude, and Cursor share one knowledge base.\n- Files changed: `docs/memory-cloud.md`, `connectors/**`, `_claude-memory/BOOT.md`, `_claude-memory/ledger.md`, `_claude-memory/handoffs/`, protocol updates in `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/memory.mdc`, `SYNC.md`.\n- For the other models: Ian's remaining clicks are in `connectors/YOU-DO-THIS.md`. Merge PR #8, then Mac symlink, PAT, ChatGPT GPT, Claude Project.\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [],
      "last_updated": "2026-09-17",
      "word_count": 401,
      "resolved_links": [],
      "backlinks": [
        "memory-space",
        "🗺️ Master MOC"
      ]
    },
    {
      "id": "memory-space",
      "path": "memory-space.md",
      "folder": "",
      "title": "Memory Space",
      "body": "# Memory Space\n\nLast updated: 2026-09-17\n\nCustom vault for this folder — same job as Obsidian, plus a color for **which LLM wrote the data**.\n\nOpen from the repo root:\n\n```bash\n./scripts/memory-space.sh\n```\n\nThat builds the index and serves `http://127.0.0.1:8765/memory-space/`. Private. Do not host this folder on a public URL.\n\n## Colors\n\nThe three lamps in the header are the rule:\n\n| Writer | Color | YAML | Block marker |\n|---|---|---|---|\n| Claude | orange | source: claude | source:claude |\n| ChatGPT | blue | source: chatgpt | source:chatgpt |\n| Cursor | purple | source: cursor | source:cursor |\n| Ian | teal | source: ian | source:ian |\n\nFile-level color comes from YAML `source` / `sources`. Mixed notes show multiple dots and a pie node on the graph. Wrap a paragraph when only part of a note is yours, using an HTML comment `source:NAME` … `/source`.\n\nThe next three blocks are the **color legend** (this file was still written by Cursor). They show how each writer will look once they log real work.\n\n<!-- source:claude -->\n**Claude · orange.** Notes and blocks Claude writes use orange — tree dot, graph node, left rail, and this rail.\n<!-- /source -->\n\n<!-- source:chatgpt -->\n**ChatGPT · blue.** Notes and blocks ChatGPT writes use blue. Live writes still go to git via Custom GPT Actions.\n<!-- /source -->\n\n<!-- source:cursor -->\n**Cursor · purple.** Cursor seeded this memory cloud and built Memory Space. Most notes start purple until the others write.\n<!-- /source -->\n\n## Views\n\n- **Notes** — file tree, wiki links `[[like this]]`, backlinks\n- **Graph** — constellation of notes; node color is the writer\n- **Ledger** — `ledger.md` timeline, colored by model\n- **Search** — `/` or Cmd+K\n\nSee [[🗺️ Master MOC]], [[ledger]], [[SYNC]], and `docs/memory-space.md`.\n",
      "source": "cursor",
      "sources": [
        "cursor",
        "claude",
        "chatgpt"
      ],
      "spans": [
        {
          "source": "claude",
          "text": "**Claude · orange.** Notes and blocks Claude writes use orange — tree dot, graph node, left rail, and this rail.",
          "start": 1016,
          "end": 1168
        },
        {
          "source": "chatgpt",
          "text": "**ChatGPT · blue.** Notes and blocks ChatGPT writes use blue. Live writes still go to git via Custom GPT Actions.",
          "start": 1170,
          "end": 1324
        },
        {
          "source": "cursor",
          "text": "**Cursor · purple.** Cursor seeded this memory cloud and built Memory Space. Most notes start purple until the others write.",
          "start": 1326,
          "end": 1490
        }
      ],
      "links": [
        {
          "target": "like this",
          "display": "like this",
          "resolved": null
        },
        {
          "target": "🗺️ Master MOC",
          "display": "🗺️ Master MOC",
          "resolved": "🗺️ Master MOC"
        },
        {
          "target": "ledger",
          "display": "ledger",
          "resolved": "ledger"
        },
        {
          "target": "SYNC",
          "display": "SYNC",
          "resolved": "SYNC"
        }
      ],
      "last_updated": "2026-09-17",
      "word_count": 300,
      "resolved_links": [
        "🗺️ Master MOC",
        "ledger",
        "SYNC"
      ],
      "backlinks": [
        "handoffs/2026-09-17-cursor-to-chatgpt",
        "🗺️ Master MOC"
      ]
    },
    {
      "id": "README",
      "path": "README.md",
      "folder": "",
      "title": "Shared agent memory",
      "body": "# Shared agent memory\n\nThis folder is the **private cloud** for ChatGPT, Claude, and Cursor.\n\nAll three read and write these files. Obsidian on your Mac is the local editor — it should point at this same folder (see [`SYNC.md`](SYNC.md)). Architecture: `docs/memory-cloud.md`.\n\n## Provenance\n\nSeeded 2026-09-01 from this repo (`docs/`, `skills/`, `CLAUDE.md`, dashboards) plus Notion (Business OS, VETA HQ, Multi-Business Hub). The local Obsidian vault at `/Users/ianveber/Documents/Obsidian Vault/_claude-memory/` was **not** reachable from Cursor Cloud. If that vault is richer, copy or merge it into this folder, then run `scripts/link-obsidian-memory.sh` so Obsidian and git stay one copy.\n\n## Session rule\n\nAt the start of every session, read in this order:\n\n1. `🗺️ Master MOC.md`\n2. `context.md`\n3. `decisions-log.md`\n4. `ledger.md`\n5. Open files in `handoffs/`\n\nThen open client or knowledge files only if the task needs them. Confirm with: `Memory loaded — [one line].`\n\nAt session end, write decisions, status changes, and new files back here. Append `ledger.md`. Update `Last updated` on every file you change. Stamp `source:` / `sources:` (Claude orange, ChatGPT blue, Cursor purple).\n\nBrowse the vault like Obsidian, with writer colors: `./scripts/memory-space.sh` → `memory-space/`.\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [],
      "last_updated": null,
      "word_count": 186,
      "resolved_links": [],
      "backlinks": []
    },
    {
      "id": "SYNC",
      "path": "SYNC.md",
      "folder": "",
      "title": "ChatGPT ↔ Claude ↔ Cursor ↔ Obsidian sync",
      "body": "# ChatGPT ↔ Claude ↔ Cursor ↔ Obsidian sync\n\nLast updated: 2026-09-17\n\nUpgrade path for the Mac vault: `connectors/obsidian/setup.md`.\n\n## What is connected\n\n| Surface | Role | How it stays in sync |\n|---|---|---|\n| **This repo** `./_claude-memory/` | Private cloud / source of truth | Git on `main`. All three models read/write these files. |\n| **Cursor** | Code + ops agent | Native repo access. Rule: `.cursor/rules/memory.mdc`. |\n| **Claude Code** | Code + ops agent | `CLAUDE.md` + `AGENTS.md`. |\n| **ChatGPT** | Web operator | Custom GPT Actions → GitHub Contents API. Snapshot fallback: uploaded knowledge pack. |\n| **Claude.ai** | Web operator | Project instructions + knowledge pack (or GitHub connector). |\n| **Obsidian** | Local notebook | Symlink + `./scripts/memory-sync.sh`. Upgrade: `connectors/obsidian/setup.md`. |\n| **Notion** | Human hub + live ops | MCP. Not a second memory dump. Hub: https://app.notion.com/p/3cea5cb8d3d2814f8cb2ecd4e05ed0e9 |\n\nFull architecture: `docs/memory-cloud.md`. Connectors: `connectors/README.md`.\n\nCursor Cloud cannot see your Mac disk. Anything a cloud agent must know lives in this git repo.\n\n## Upgrade Obsidian (Mac)\n\nTwo steps. Details: `connectors/obsidian/setup.md`.\n\n1. **App:** Obsidian → Check for updates.\n2. **Vault:** from the repo root:\n\n```bash\n./scripts/upgrade-obsidian.sh\n```\n\nThat runs `link-obsidian-memory.sh`:\n\n1. Copies any existing Obsidian `_claude-memory/` files into this repo if they are newer or missing here\n2. Backs up the old vault folder to `_claude-memory.pre-sync-backup/`\n3. Replaces the vault folder with a symlink to this repo\n\nOpen Obsidian after that. The `_claude-memory` notes should still appear; they now are these git files.\n\nThen wire ChatGPT and Claude.ai using `connectors/README.md`.\n\nColored vault (same notes, LLM colors): `./scripts/memory-space.sh` — Claude orange, ChatGPT blue, Cursor purple. Docs: `docs/memory-space.md`.\n\n## Daily loop\n\n```\nObsidian (you)\n    ↑ symlink\nrepo/_claude-memory  ←git→  Cursor + Claude Code\n         ↑\n         └── GitHub API (Actions) ← ChatGPT Custom GPT\n         └── upload pack / GitHub connector ← Claude.ai\n```\n\n1. Agent starts → reads this folder (and `ledger.md` + `handoffs/`) → `Memory loaded — …`\n2. Work happens\n3. Agent ends → updates files here, appends `ledger.md`, writes a handoff if another model should continue\n4. Commit + push (Cursor/Claude) or PUT via Actions (ChatGPT) so the other two see it\n\n## Combining work across models\n\nDo not paste chat transcripts. Write state:\n\n- Durable facts → `context.md` / client files / `decisions-log.md`\n- \"I just did X\" → `ledger.md`\n- \"You do Y next\" → `handoffs/YYYY-MM-DD-from-to-to.md`\n\n## What not to do\n\n- Do not keep a second unsynced copy only on the Mac, only in a ChatGPT Project, or only in a Claude Project\n- Do not ask any agent to remember context that is not written here\n- Do not send email, close GitHub issues, delete Notion items, or change Calendar events without explicit confirmation (see `CLAUDE.md`)\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [],
      "last_updated": "2026-09-17",
      "word_count": 456,
      "resolved_links": [],
      "backlinks": [
        "agentic-os",
        "memory-space",
        "🗺️ Master MOC"
      ]
    },
    {
      "id": "veta-agency",
      "path": "veta-agency.md",
      "folder": "",
      "title": "Veta Agency",
      "body": "# Veta Agency\n\nLast updated: 2026-09-01\n\n## What it is\n\nAI-native vertical agent agency. Ships production agent systems that take over one functional cluster inside a specialty service business. Practitioner-level vertical knowledge before the discovery call.\n\nNot: AI consulting, SaaS seats, digital marketing retainers, staff augmentation, \"AI for any business.\"\n\n## Offer\n\n| Tier | What | Typical |\n|---|---|---|\n| 1 Cluster Sprint | One cluster, 6–8 weeks, read-only then write, handoff + 30-day support | $18K–$45K |\n| 2 Vertical Stack | 2–4 clusters, 10–16 weeks, unified exception dashboard | $55K–$120K |\n| 3 Embedded Partner | Monthly improvement retainer after handoff | MRR |\n\nFull catalog: `docs/service-catalog.md`. Pricing logic: `ops/pricing-architecture.md`.\n\n## Active verticals\n\n1. Specialty dental (implant, ortho, OMS)\n2. Specialty legal (immigration, estate, IP)\n3. Aesthetic medicine (MedSpa, plastics, cosmetic derm) — first-run baseline, 0 engagements in playbook as of 2026-05-04\n\n## How we operate\n\n- Daily sweep before 09:30 local (`ops/run-book.md`) — blockers, exception queues, AR, inbox. 15 minutes.\n- Weekly Friday review 60–90 min — engagement status, pipeline, acquirer, cash, decisions\n- Business manager agent: `CLAUDE.md`, 07:00 Europe/Ljubljana, `./reports/`\n- Acquirer agent: organic SEO/GEO/content/partnerships only (`agents/acquirer/`)\n- One named project lead per engagement (currently Ian)\n\n## Principles (do not violate)\n\nVertical depth over horizontal breadth. Ship systems, not decks. Name stubs. Read-only before write. Clients own the build. Price on value. No silent failures. Slow down at compliance. Compound playbooks.\n\nCanonical text: `docs/principles.md` and [[veta-internal/veta-principles]].\n\n## Notion vs this repo\n\n- This repo is the current agency OS (positioning, playbooks, delivery, skills)\n- Notion VETA HQ (2026-04) is still structured as Freelance HQ: AI Video, Marketing, Finance, Weekly Planner + Client Tracker\n- Keep both. Do not delete Notion. Write agency strategy changes here and in `docs/`\n\n## Files created in this memory seed\n\nSee [[🗺️ Master MOC]]. Sync files: `_claude-memory/*`, `AGENTS.md`, `.cursor/rules/memory.mdc`, `scripts/link-obsidian-memory.sh`. Three-model cloud: `docs/memory-cloud.md`, `connectors/`.\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [
        {
          "target": "veta-internal/veta-principles",
          "display": "veta-internal/veta-principles",
          "resolved": "veta-internal/veta-principles"
        },
        {
          "target": "🗺️ Master MOC",
          "display": "🗺️ Master MOC",
          "resolved": "🗺️ Master MOC"
        }
      ],
      "last_updated": "2026-09-01",
      "word_count": 314,
      "resolved_links": [
        "veta-internal/veta-principles",
        "🗺️ Master MOC"
      ],
      "backlinks": [
        "🗺️ Master MOC"
      ]
    },
    {
      "id": "veta-internal/vertical-aesthetic-medicine",
      "path": "veta-internal/vertical-aesthetic-medicine.md",
      "folder": "veta-internal",
      "title": "Vertical — aesthetic medicine (memory)",
      "body": "# Vertical — aesthetic medicine (memory)\n\nLast updated: 2026-09-01\nCanonical: `verticals/aesthetic-medicine/playbook.md`\nEngagements completed (as of playbook): 0\n\n## In scope\n\nMedSpa, plastics, cosmetic derm, cosmetic dentistry overlap. Out: hospital plastics, insurance-driven derm, oncology aesthetics.\n\n## Highest-leverage clusters\n\n1. Consultation follow-up / conversion\n2. Post-treatment check-in + review ask (no clinical advice from the agent)\n3. Pre-treatment prep + consent\n4. Membership / package renewal\n\nCulture: nothing that feels cheap or spammy. Frame automation as a better patient experience.\n\nEthospheres is the in-house brand in this vertical; Veta playbook is the clinic-ops offer sold to other practices.\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [],
      "last_updated": "2026-09-01",
      "word_count": 96,
      "resolved_links": [],
      "backlinks": [
        "🗺️ Master MOC"
      ]
    },
    {
      "id": "veta-internal/veta-kpis",
      "path": "veta-internal/veta-kpis.md",
      "folder": "veta-internal",
      "title": "Veta KPIs (memory)",
      "body": "# Veta KPIs (memory)\n\nLast updated: 2026-09-01\nCanonical: `ops/kpi-framework.md`\n\nThree layers:\n\n1. **Agency health** — MRR (Tier 3 only), monthly build cash, weighted pipeline, concentration (<40% one client), AR aging\n2. **Delivery quality** — on-time milestones, exception rates, handoff pass\n3. **Client outcomes** — hours recovered, revenue recovered, review/conversion lifts per vertical playbook\n\nCadence: weekly delivery + pipeline; monthly all three layers; quarterly trends. Daily KPIs: none — daily is a 15-minute sweep, not a metrics dive.\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [],
      "last_updated": "2026-09-01",
      "word_count": 77,
      "resolved_links": [],
      "backlinks": [
        "🗺️ Master MOC"
      ]
    },
    {
      "id": "veta-internal/veta-positioning",
      "path": "veta-internal/veta-positioning.md",
      "folder": "veta-internal",
      "title": "Veta positioning (memory)",
      "body": "# Veta positioning (memory)\n\nLast updated: 2026-09-01\nCanonical: `docs/positioning.md`\n\n## Thesis\n\nService businesses in high-stakes verticals have repeatable, expensive workflows and no engineering capacity. Veta replaces a defined cluster with an agent system built for that industry.\n\n## We are / we are not\n\n**Are:** practitioners who ship production systems, scoped to a cluster, handed off with docs.\n\n**Are not:** strategy consultants, SaaS, digital marketing agency, staffing layer, horizontal \"AI for anyone.\"\n\n## ICP\n\nSpecialty service business, 5–150 people, high-stakes repeatable ops, owner / practice manager / COO as buyer. No internal engineering team.\n\n## Pitch (keep this wording close)\n\nA practice runs on a handful of high-stakes workflows. Those currently run on staff time, disconnected tools, and manual coordination. Veta replaces one cluster (intake, scheduling, follow-up, etc.) with a system that runs, surfaces exceptions, and can be operated by the client's team. Build in 6–10 weeks. They own it.\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [],
      "last_updated": "2026-09-01",
      "word_count": 150,
      "resolved_links": [],
      "backlinks": [
        "🗺️ Master MOC"
      ]
    },
    {
      "id": "veta-internal/veta-principles",
      "path": "veta-internal/veta-principles.md",
      "folder": "veta-internal",
      "title": "Veta principles (memory)",
      "body": "# Veta principles (memory)\n\nLast updated: 2026-09-01\nCanonical: `docs/principles.md`\n\n1. Vertical depth beats horizontal breadth\n2. Ship systems, not deliverables\n3. Name stubs vs locked-in\n4. Read-only before write\n5. Clients own what we build\n6. Price on value, not time\n7. No silent failures\n8. Slow down at compliance boundaries\n9. One throat to choke\n10. Compound the playbooks\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [],
      "last_updated": "2026-09-01",
      "word_count": 60,
      "resolved_links": [],
      "backlinks": [
        "veta-agency",
        "🗺️ Master MOC"
      ]
    },
    {
      "id": "veta-internal/veta-services",
      "path": "veta-internal/veta-services.md",
      "folder": "veta-internal",
      "title": "Veta services (memory)",
      "body": "# Veta services (memory)\n\nLast updated: 2026-09-01\nCanonical: `docs/service-catalog.md`\n\n- **Tier 1 — Cluster Sprint:** one cluster, 6–8 weeks, $18K–$45K, 30-day bug-fix window\n- **Tier 2 — Vertical Stack:** 2–4 clusters, 10–16 weeks, $55K–$120K, 3 months improvement retainer included\n- **Tier 3 — Embedded Partner:** monthly retainer, monitoring + backlog, not on-call infra\n\nNot included in any tier: replacing the client's core EHR/CRM, compliance certification, paid ads, generic chatbot seats.\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [],
      "last_updated": "2026-09-01",
      "word_count": 70,
      "resolved_links": [],
      "backlinks": [
        "🗺️ Master MOC"
      ]
    },
    {
      "id": "zalife",
      "path": "zalife.md",
      "folder": "",
      "title": "ZaLife",
      "body": "# ZaLife\n\nLast updated: 2026-09-01\n\nYouth leadership / bootcamp (zalife.eu). Veta project dashboard: `zalife.html`.\n\n## Known work\n\n- Notion idea (2026-04-25): AI-powered parent onboarding chatbot for zalife.eu — WhatsApp or web chat (Make.com + Claude API) that walks parents through discovery\n- Research-agent queries: youth leadership bootcamp Slovenia; leadership programs for teenagers in Europe\n\n## Status\n\nNo signed scope, revenue, or launch milestone is recorded in this seed. Update this file when a phase or owner is confirmed.\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [],
      "last_updated": "2026-09-01",
      "word_count": 78,
      "resolved_links": [],
      "backlinks": [
        "clients/other-projects",
        "context",
        "🗺️ Master MOC"
      ]
    },
    {
      "id": "🗺️ Master MOC",
      "path": "🗺️ Master MOC.md",
      "folder": "",
      "title": "Master MOC",
      "body": "# Master MOC\n\nLast updated: 2026-09-17\n\nMap of maps. Start here every session.\n\n## How agents use this vault\n\n- ChatGPT, Claude, and Cursor all load from `./_claude-memory/` in this repo (the private cloud)\n- Architecture: `docs/memory-cloud.md`. Wiring: `connectors/README.md`. Local editor: [[SYNC]]. Colored vault: [[memory-space]] (`./scripts/memory-space.sh`) — Claude orange, ChatGPT blue, Cursor purple\n- Also read [[ledger]] and `handoffs/` so you can continue the other models' work\n- Confirm load with one line. Do not ask Ian to re-explain what is already here\n\n## Core (every session)\n\n- [[context]] — who Ian is, businesses, constraints\n- [[decisions-log]] — locked decisions\n- [[ledger]] — what ChatGPT / Claude / Cursor last wrote\n- [[BOOT]] — short pack for ChatGPT and Claude.ai uploads\n- [[SYNC]] — how all three models + Obsidian stay in sync\n- `connectors/obsidian/setup.md` — upgrade the Mac app and vault\n\n## Primary work\n\n- [[ethospheres]] — cosmesotherapy brand (primary client/venture)\n- [[veta-agency]] — AI-native vertical agent agency\n- [[agentic-os]] — personal operating agents\n- [[clients/autoflow]] — lead-scoring SaaS\n- [[clients/other-projects]] — Pacom, ZaLife, ATHLOS, remaining Veta clients\n- [[zalife]] — ZaLife youth leadership (research-agent target)\n\n## Veta internal\n\n- [[veta-internal/veta-positioning]]\n- [[veta-internal/veta-services]]\n- [[veta-internal/veta-principles]]\n- [[veta-internal/veta-kpis]]\n- [[veta-internal/vertical-aesthetic-medicine]]\n\n## Knowledge\n\n- [[knowledge/ethosome-technology]]\n- [[knowledge/geo-strategy]]\n\n## Repo pointers (not duplicated here)\n\n| Need | Path |\n|---|---|\n| Private memory cloud | `docs/memory-cloud.md` + `connectors/` |\n| Daily briefing agent | `CLAUDE.md` |\n| Agency OS | `docs/` |\n| Skills | `skills/` |\n| Vertical playbooks | `verticals/` |\n| Delivery | `delivery/` |\n| Memory Space (Obsidian-style, writer colors) | `memory-space/` + `docs/memory-space.md` |\n| Dashboards | `dashboard.html`, `agentic-os.html`, `zalife.html`, `pacom.html`, `athlos.html` |\n| Notion Business OS | https://app.notion.com/p/345a5cb8d3d281cba3f7cb57bf9b5898 |\n| Notion VETA HQ | https://app.notion.com/p/344a5cb8d3d2813ca1a7f27074efb068 |\n| Notion Multi-Business Hub | https://app.notion.com/p/345a5cb8d3d281b9b8ecc0fc663fef81 |\n| Claude + Cursor + Obsidian sync (Notion draft) | https://app.notion.com/p/3cea5cb8d3d2814f8cb2ecd4e05ed0e9 |\n\n## Open merge note\n\nLocal Obsidian vault was not imported on first Cursor Cloud seed. If `_claude-memory.pre-sync-backup/` exists after running the link script, merge any richer notes into these files.\n",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "spans": [],
      "links": [
        {
          "target": "SYNC",
          "display": "SYNC",
          "resolved": "SYNC"
        },
        {
          "target": "memory-space",
          "display": "memory-space",
          "resolved": "memory-space"
        },
        {
          "target": "ledger",
          "display": "ledger",
          "resolved": "ledger"
        },
        {
          "target": "context",
          "display": "context",
          "resolved": "context"
        },
        {
          "target": "decisions-log",
          "display": "decisions-log",
          "resolved": "decisions-log"
        },
        {
          "target": "BOOT",
          "display": "BOOT",
          "resolved": "BOOT"
        },
        {
          "target": "ethospheres",
          "display": "ethospheres",
          "resolved": "ethospheres"
        },
        {
          "target": "veta-agency",
          "display": "veta-agency",
          "resolved": "veta-agency"
        },
        {
          "target": "agentic-os",
          "display": "agentic-os",
          "resolved": "agentic-os"
        },
        {
          "target": "clients/autoflow",
          "display": "clients/autoflow",
          "resolved": "clients/autoflow"
        },
        {
          "target": "clients/other-projects",
          "display": "clients/other-projects",
          "resolved": "clients/other-projects"
        },
        {
          "target": "zalife",
          "display": "zalife",
          "resolved": "zalife"
        },
        {
          "target": "veta-internal/veta-positioning",
          "display": "veta-internal/veta-positioning",
          "resolved": "veta-internal/veta-positioning"
        },
        {
          "target": "veta-internal/veta-services",
          "display": "veta-internal/veta-services",
          "resolved": "veta-internal/veta-services"
        },
        {
          "target": "veta-internal/veta-principles",
          "display": "veta-internal/veta-principles",
          "resolved": "veta-internal/veta-principles"
        },
        {
          "target": "veta-internal/veta-kpis",
          "display": "veta-internal/veta-kpis",
          "resolved": "veta-internal/veta-kpis"
        },
        {
          "target": "veta-internal/vertical-aesthetic-medicine",
          "display": "veta-internal/vertical-aesthetic-medicine",
          "resolved": "veta-internal/vertical-aesthetic-medicine"
        },
        {
          "target": "knowledge/ethosome-technology",
          "display": "knowledge/ethosome-technology",
          "resolved": "knowledge/ethosome-technology"
        },
        {
          "target": "knowledge/geo-strategy",
          "display": "knowledge/geo-strategy",
          "resolved": "knowledge/geo-strategy"
        }
      ],
      "last_updated": "2026-09-17",
      "word_count": 339,
      "resolved_links": [
        "SYNC",
        "memory-space",
        "ledger",
        "context",
        "decisions-log",
        "BOOT",
        "ethospheres",
        "veta-agency",
        "agentic-os",
        "clients/autoflow",
        "clients/other-projects",
        "zalife",
        "veta-internal/veta-positioning",
        "veta-internal/veta-services",
        "veta-internal/veta-principles",
        "veta-internal/veta-kpis",
        "veta-internal/vertical-aesthetic-medicine",
        "knowledge/ethosome-technology",
        "knowledge/geo-strategy"
      ],
      "backlinks": [
        "memory-space",
        "veta-agency"
      ]
    }
  ],
  "edges": [
    {
      "from": "agentic-os",
      "to": "SYNC"
    },
    {
      "from": "clients/other-projects",
      "to": "zalife"
    },
    {
      "from": "clients/other-projects",
      "to": "ethospheres"
    },
    {
      "from": "clients/other-projects",
      "to": "context"
    },
    {
      "from": "context",
      "to": "ethospheres"
    },
    {
      "from": "context",
      "to": "clients/autoflow"
    },
    {
      "from": "context",
      "to": "zalife"
    },
    {
      "from": "context",
      "to": "clients/other-projects"
    },
    {
      "from": "handoffs/2026-09-17-cursor-to-chatgpt",
      "to": "memory-space"
    },
    {
      "from": "memory-space",
      "to": "🗺️ Master MOC"
    },
    {
      "from": "memory-space",
      "to": "ledger"
    },
    {
      "from": "memory-space",
      "to": "SYNC"
    },
    {
      "from": "veta-agency",
      "to": "veta-internal/veta-principles"
    },
    {
      "from": "veta-agency",
      "to": "🗺️ Master MOC"
    },
    {
      "from": "🗺️ Master MOC",
      "to": "SYNC"
    },
    {
      "from": "🗺️ Master MOC",
      "to": "memory-space"
    },
    {
      "from": "🗺️ Master MOC",
      "to": "ledger"
    },
    {
      "from": "🗺️ Master MOC",
      "to": "context"
    },
    {
      "from": "🗺️ Master MOC",
      "to": "decisions-log"
    },
    {
      "from": "🗺️ Master MOC",
      "to": "BOOT"
    },
    {
      "from": "🗺️ Master MOC",
      "to": "ethospheres"
    },
    {
      "from": "🗺️ Master MOC",
      "to": "veta-agency"
    },
    {
      "from": "🗺️ Master MOC",
      "to": "agentic-os"
    },
    {
      "from": "🗺️ Master MOC",
      "to": "clients/autoflow"
    },
    {
      "from": "🗺️ Master MOC",
      "to": "clients/other-projects"
    },
    {
      "from": "🗺️ Master MOC",
      "to": "zalife"
    },
    {
      "from": "🗺️ Master MOC",
      "to": "veta-internal/veta-positioning"
    },
    {
      "from": "🗺️ Master MOC",
      "to": "veta-internal/veta-services"
    },
    {
      "from": "🗺️ Master MOC",
      "to": "veta-internal/veta-principles"
    },
    {
      "from": "🗺️ Master MOC",
      "to": "veta-internal/veta-kpis"
    },
    {
      "from": "🗺️ Master MOC",
      "to": "veta-internal/vertical-aesthetic-medicine"
    },
    {
      "from": "🗺️ Master MOC",
      "to": "knowledge/ethosome-technology"
    },
    {
      "from": "🗺️ Master MOC",
      "to": "knowledge/geo-strategy"
    }
  ],
  "ledger": [
    {
      "date": "2026-09-17",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "heading": "2026-09-17 — cursor",
      "body": "## 2026-09-17 — cursor\n\n- Worked on: Memory Space — Obsidian-style vault viewer with LLM colors (Claude orange, ChatGPT blue, Cursor purple).\n- Files changed: `memory-space/`, `scripts/build-memory-space.py`, `scripts/memory-space.sh`, `_claude-memory/memory-space.md`, `docs/memory-space.md`, agent source-stamp protocol.\n- For the other models: Stamp `source:` / `sources:` when you write. Partial blocks: `<!-- source:chatgpt -->` or `<!-- source:claude -->`. Ian opens the vault with `./scripts/memory-space.sh`.\n\n---",
      "files": [
        "memory-space/",
        "scripts/build-memory-space.py",
        "scripts/memory-space.sh",
        "_claude-memory/memory-space.md",
        "docs/memory-space.md"
      ]
    },
    {
      "date": "2026-09-17",
      "source": "ian",
      "sources": [
        "ian",
        "cursor"
      ],
      "heading": "2026-09-17 — ian / cursor",
      "body": "## 2026-09-17 — ian / cursor\n\n- Worked on: Ian finished ChatGPT `Veta Memory` GPT. Claude.ai Project skipped for now; do later.\n- Files changed: `decisions-log.md`, this ledger, handoff marked deferred.\n- For the other models: Do not ask Ian to set up Claude.ai this session. Cursor + ChatGPT + Claude Code already share `_claude-memory/`.\n\n---",
      "files": [
        "decisions-log.md"
      ]
    },
    {
      "date": "2026-09-17",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "heading": "2026-09-17 — cursor (Mac path was wrong)",
      "body": "## 2026-09-17 — cursor (Mac path was wrong)\n\n- Worked on: Ian's Terminal failed because `~/Desktop/Cloude CODE` does not exist. Setup now clones to `~/Desktop/cloude-code` if needed.\n- Files changed: `connectors/YOU-DO-THIS.md`, `scripts/mac-bootstrap.sh`\n- For the other models: Do not tell Ian to cd into Desktop/Cloude CODE.\n\n---",
      "files": [
        "connectors/YOU-DO-THIS.md",
        "scripts/mac-bootstrap.sh"
      ]
    },
    {
      "date": "2026-09-17",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "heading": "2026-09-17 — cursor (merged + remaining Mac/account steps)",
      "body": "## 2026-09-17 — cursor (merged + remaining Mac/account steps)\n\n- Worked on: Merged PR #8 to main. Cloud VM has no Mac, no ChatGPT login, no Claude.ai login.\n- Files changed: `connectors/YOU-DO-THIS.md` updated to remaining steps only.\n- For the other models: Memory cloud is on `main`. Ian still links Obsidian and creates the GPT/Project.\n\n---",
      "files": [
        "connectors/YOU-DO-THIS.md"
      ]
    },
    {
      "date": "2026-09-17",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "heading": "2026-09-17 — cursor (Obsidian upgrade)",
      "body": "## 2026-09-17 — cursor (Obsidian upgrade)\n\n- Worked on: How to upgrade Obsidian so the Mac vault uses the private memory cloud (app update + symlink + memory-sync).\n- Files changed: `connectors/obsidian/`, `scripts/upgrade-obsidian.sh`, `scripts/memory-sync.sh`, `SYNC.md`.\n- For the other models: After merge, Ian runs `./scripts/upgrade-obsidian.sh` on the Mac, then `./scripts/memory-sync.sh` when he edits notes. Do not turn on Obsidian Sync. Do not git-init the personal vault.",
      "files": [
        "connectors/obsidian/",
        "scripts/upgrade-obsidian.sh",
        "scripts/memory-sync.sh",
        "SYNC.md"
      ]
    },
    {
      "date": "2026-09-17",
      "source": "cursor",
      "sources": [
        "cursor"
      ],
      "heading": "2026-09-17 — cursor",
      "body": "## 2026-09-17 — cursor\n\n- Worked on: Private memory cloud so ChatGPT, Claude, and Cursor share one knowledge base.\n- Files changed: `docs/memory-cloud.md`, `connectors/**`, `_claude-memory/BOOT.md`, `_claude-memory/ledger.md`, `_claude-memory/handoffs/`, protocol updates in `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/memory.mdc`, `SYNC.md`.\n- For the other models: Ian's remaining clicks are in `connectors/YOU-DO-THIS.md`. Merge PR #8, then Mac symlink, PAT, ChatGPT GPT, Claude Project.",
      "files": [
        "docs/memory-cloud.md",
        "connectors/**",
        "_claude-memory/BOOT.md",
        "_claude-memory/ledger.md",
        "_claude-memory/handoffs/",
        "AGENTS.md",
        "CLAUDE.md",
        ".cursor/rules/memory.mdc",
        "SYNC.md"
      ]
    }
  ],
  "tree": [
    {
      "id": "",
      "title": "vault",
      "path": "",
      "children": [
        {
          "id": "agentic-os",
          "title": "Agentic OS",
          "path": "agentic-os.md",
          "source": "cursor",
          "sources": [
            "cursor"
          ]
        },
        {
          "id": "BOOT",
          "title": "BOOT — Veta Memory Cloud",
          "path": "BOOT.md",
          "source": "cursor",
          "sources": [
            "cursor"
          ]
        },
        {
          "id": "SYNC",
          "title": "ChatGPT ↔ Claude ↔ Cursor ↔ Obsidian sync",
          "path": "SYNC.md",
          "source": "cursor",
          "sources": [
            "cursor"
          ]
        },
        {
          "id": "context",
          "title": "Context",
          "path": "context.md",
          "source": "cursor",
          "sources": [
            "cursor"
          ]
        },
        {
          "id": "decisions-log",
          "title": "Decisions log",
          "path": "decisions-log.md",
          "source": "cursor",
          "sources": [
            "cursor",
            "ian"
          ]
        },
        {
          "id": "ethospheres",
          "title": "Ethospheres",
          "path": "ethospheres.md",
          "source": "cursor",
          "sources": [
            "cursor"
          ]
        },
        {
          "id": "ledger",
          "title": "Ledger",
          "path": "ledger.md",
          "source": "cursor",
          "sources": [
            "cursor"
          ]
        },
        {
          "id": "🗺️ Master MOC",
          "title": "Master MOC",
          "path": "🗺️ Master MOC.md",
          "source": "cursor",
          "sources": [
            "cursor"
          ]
        },
        {
          "id": "memory-space",
          "title": "Memory Space",
          "path": "memory-space.md",
          "source": "cursor",
          "sources": [
            "cursor",
            "claude",
            "chatgpt"
          ]
        },
        {
          "id": "README",
          "title": "Shared agent memory",
          "path": "README.md",
          "source": "cursor",
          "sources": [
            "cursor"
          ]
        },
        {
          "id": "veta-agency",
          "title": "Veta Agency",
          "path": "veta-agency.md",
          "source": "cursor",
          "sources": [
            "cursor"
          ]
        },
        {
          "id": "zalife",
          "title": "ZaLife",
          "path": "zalife.md",
          "source": "cursor",
          "sources": [
            "cursor"
          ]
        }
      ],
      "folders": [
        {
          "id": "clients",
          "title": "clients",
          "path": "clients",
          "children": [
            {
              "id": "clients/autoflow",
              "title": "AutoFlow",
              "path": "clients/autoflow.md",
              "source": "cursor",
              "sources": [
                "cursor"
              ]
            },
            {
              "id": "clients/other-projects",
              "title": "Other projects and clients",
              "path": "clients/other-projects.md",
              "source": "cursor",
              "sources": [
                "cursor"
              ]
            }
          ]
        },
        {
          "id": "handoffs",
          "title": "handoffs",
          "path": "handoffs",
          "children": [
            {
              "id": "handoffs/2026-09-17-cursor-to-chatgpt",
              "title": "Handoff — cursor → chatgpt / claude",
              "path": "handoffs/2026-09-17-cursor-to-chatgpt.md",
              "source": "cursor",
              "sources": [
                "cursor"
              ]
            },
            {
              "id": "handoffs/2026-09-17-cursor-to-ian",
              "title": "Handoff — cursor → ian",
              "path": "handoffs/2026-09-17-cursor-to-ian.md",
              "source": "cursor",
              "sources": [
                "cursor"
              ]
            },
            {
              "id": "handoffs/README",
              "title": "Handoffs",
              "path": "handoffs/README.md",
              "source": "cursor",
              "sources": [
                "cursor"
              ]
            }
          ]
        },
        {
          "id": "knowledge",
          "title": "knowledge",
          "path": "knowledge",
          "children": [
            {
              "id": "knowledge/ethosome-technology",
              "title": "Ethosome technology",
              "path": "knowledge/ethosome-technology.md",
              "source": "cursor",
              "sources": [
                "cursor"
              ]
            },
            {
              "id": "knowledge/geo-strategy",
              "title": "GEO strategy",
              "path": "knowledge/geo-strategy.md",
              "source": "cursor",
              "sources": [
                "cursor"
              ]
            }
          ]
        },
        {
          "id": "veta-internal",
          "title": "veta-internal",
          "path": "veta-internal",
          "children": [
            {
              "id": "veta-internal/vertical-aesthetic-medicine",
              "title": "Vertical — aesthetic medicine (memory)",
              "path": "veta-internal/vertical-aesthetic-medicine.md",
              "source": "cursor",
              "sources": [
                "cursor"
              ]
            },
            {
              "id": "veta-internal/veta-kpis",
              "title": "Veta KPIs (memory)",
              "path": "veta-internal/veta-kpis.md",
              "source": "cursor",
              "sources": [
                "cursor"
              ]
            },
            {
              "id": "veta-internal/veta-positioning",
              "title": "Veta positioning (memory)",
              "path": "veta-internal/veta-positioning.md",
              "source": "cursor",
              "sources": [
                "cursor"
              ]
            },
            {
              "id": "veta-internal/veta-principles",
              "title": "Veta principles (memory)",
              "path": "veta-internal/veta-principles.md",
              "source": "cursor",
              "sources": [
                "cursor"
              ]
            },
            {
              "id": "veta-internal/veta-services",
              "title": "Veta services (memory)",
              "path": "veta-internal/veta-services.md",
              "source": "cursor",
              "sources": [
                "cursor"
              ]
            }
          ]
        }
      ]
    }
  ],
  "stats": {
    "notes": 24,
    "links": 33,
    "ledger_entries": 6
  }
};
