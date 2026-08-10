# Skills Manifest — AI Infrastructure Protocol

**Purpose:** at THIS gate/step, which skill do I fire? This is the operator's routing table. It wires Ian's full 223-skill library into the five-gate journey (G0 SCAN → G1 BLUEPRINT → G2 BUILD → G3 SECURE → G4 INVESTOR-READY). Reference skills by exact name and invoke via the Skill tool: `-> invoke skill-name`.

**Operating rule:** reuse before build. Compose these skills before writing anything new. When a client needs a bespoke routine, author it with `-> invoke skill-creator`.

**Three inherently manual moments the runbook must own** (skills automate around them, never through them): (1) ACCESS — a human at the client connects systems; (2) DISCOVERY — the scan must SEE the company; (3) TRUST — a human approves any real-world agent action. Skills marked **[MANUAL GATE]** below are where the operator pauses for the client.

---

## Part 1 — Per-GATE routing table

### G0 — SCAN (pillar ② opens) — read the whole company as-is
| Skill | When / why |
|---|---|
| `web-intake` | FIRST move — generate the bilingual (EN+SL) client discovery questionnaire before touching anything. **[MANUAL GATE: DISCOVERY]** |
| `client-onboarding-dashboard` | Stand up the onboarding surface so the client can see what access is still needed. **[MANUAL GATE: ACCESS]** |
| `gws-commander` | Once client grants Google Workspace access, pull Gmail/Drive/Sheets/Calendar to observe real workflows. **[MANUAL GATE: ACCESS]** |
| `customer-research` | Structure the interview findings into who-does-what-with-which-tool. |
| `competitor-profiling` | Map the company against rivals to spot process gaps the scan should probe. |
| `competitors` | Fast competitive landscape sweep to frame the as-is map. |
| `niche-research` | Understand the company's market so process pain is read in context. |
| `deep-research` | Deep, cited dossier on the company's industry, regulations, and norms. |
| `scrape` | Pull the company's public site/data to seed the scan. |
| `agent-browser` | Log into client SaaS dashboards (with granted creds) to observe live tool usage. **[MANUAL GATE: ACCESS]** |
| `site-architecture` | Map the company's existing web/app surface. |
| `analytics` | Ingest existing analytics to quantify volume and where hours go. |
| `revops` | Read the revenue/ops funnel to locate the money-losing handoffs. |
| `notion-business-os` | If the client runs on Notion, ingest their databases as scan input. |
| `schedule` / `morning` | Set the recurring cadence for scan refresh and daily engagement briefings. |

**Gate 0 green when:** every named department/process has tools, data, volume, and pain quantified in `company-scan.json`.

### G1 — BLUEPRINT (pillar ② closes) — design the target AI operating model
| Skill | When / why |
|---|---|
| `theory-of-constraints` | Find the true bottleneck so the backlog attacks it first. |
| `revops` | Convert as-is funnel into to-be funnel with AI-inserted steps. |
| `spec` | Turn each blueprint disposition into a backlog-ready, buildable spec. |
| `office-hours` | Product-review the proposed operating model before committing the backlog. |
| `plan-ceo-review` | Pressure-test scope and business case of the blueprint. |
| `plan-eng-review` | Sanity-check the technical feasibility of each named artifact. |
| `brainstorming` | Explore keep-human / augment / automate options per process. |
| `notion-business-os` | Publish the blueprint + ranked backlog into the client's workspace. |
| the advisor board | Summon lenses (see Part 3) to challenge disposition decisions. |

**Gate 1 green when:** every scanned process has a disposition, every automation names an owner artifact, backlog is ranked by AI-involvement × impact ÷ effort.

### G2 — BUILD (pillars ①③ execute) — work the backlog
**Apps run through the four-gate app engine (`3day-protocol/`). Agents/automations run through the agent factory (`pillars/3-agents`).**

| Skill | When / why |
|---|---|
| **App track** | |
| `ian-design-standards` | Apply Ian's taste bar to every app UI by default. |
| `design-consultation` | Set design direction before building an app screen. |
| `interface-design` | Design-engineer the UI with memory + enforcement. |
| `ui-ux-pro-max` / `refactoring-ui` | Elevate layout, hierarchy, spacing. |
| `web-design-guidelines` | Review UI code against interface guidelines. |
| `design-html` / `web-specialist` | Build the HTML/CSS/JS surface. |
| `shadcn` | Add/compose component primitives. |
| `responsive-mobile` | Guarantee mobile behavior. |
| `gsap-core` / `gsap-scrolltrigger` / `gsap-timeline` / `gsap-react` / `gsap-plugins` / `gsap-performance` | Motion when the artifact needs it. |
| `supabase` / `supabase-postgres-best-practices` / `schema` | Data layer, RLS-ready from the start. |
| `clone-website` | When the build reuses/rebuilds an existing site. |
| `deploy-to-vercel` / `setup-deploy` / `land-and-deploy` / `vercel-optimize` | Ship the app. |
| `plan-eng-review` / `plan-design-review` | Gate reviews inside the app engine. |
| `qa` / `qa-only` / `browse` | Behavior QA before the app's own ship gate. |
| `verification-before-completion` / `ship` | Prove-then-ship discipline. |
| **Agent / automation track** | |
| `ai-agent-setup` | Scaffold a new agent from the blueprint spec. |
| `app-graditelj` | Slovene app/agent builder for client-facing automations. |
| `composio-cli` | Wire the agent into 250+ real apps (CRM, invoicing, comms). **[MANUAL GATE: ACCESS]** |
| `gws-commander` | Give the agent Gmail/Drive/Calendar/Sheets actions. **[MANUAL GATE: ACCESS + TRUST]** |
| `whatsapp-ai-agent` | Stand up a WhatsApp support/sales agent. |
| `voice-builder` | Voice-driven agent surfaces. |
| `agent-browser` | Agents that must operate a browser to act. |
| `hook-generator` | Wire deterministic hooks so agent actions fire on events. |
| `pair-agent` | Human-in-the-loop agent pairing during build. |
| `scrape` / `schedule` | Data intake + recurring agent runs. |
| `dispatching-parallel-agents` / `subagent-driven-development` | Build multiple backlog artifacts in parallel. |
| `setup-cowork` / `cowork-project-prompt` | Multi-agent project workspace. |
| `setup-browser-cookies` | Persist client auth for browser agents. **[MANUAL GATE: ACCESS]** |
| `prompt-engineer` | Harden each agent's system prompt. |
| **TRUST checkpoint** | Any agent that sends/pays/edits real-world state pauses for client approval before going live. **[MANUAL GATE: TRUST]** |

**Gate 2 green when:** every "this sprint" backlog item is built, registered in `.protocol/artifacts.json`, and green on its own sub-gate (app SHIP-REPORT green, or agent factory `verify.json` green).

### G3 — SECURE (pillar ⑤ — the hard gate) — nothing ships unverified
| Skill | When / why |
|---|---|
| `cso` | Chief-Security-Officer pass over the whole artifact set. |
| `security-review` | Full security review of each app/agent/API. |
| `code-review` | Correctness + reuse review of shipped code. |
| `guard` | Enforce destructive-command warnings + directory-scoped edits during hardening. |
| `careful` | Safety guardrails on any destructive operation. |
| `review` / `receiving-code-review` / `requesting-code-review` | Structured review exchange for each artifact. |
| `investigate` | Root-cause any security finding before it's cleared. |
| `plan-eng-review` | Re-review architecture for least-privilege + data-access. |
| `devex-review` | Confirm the secured build is still operable. |
| `verification-before-completion` | No check is "assumed" — prove each. |
| `benchmark` / `canary` | Perf regression + post-deploy canary monitoring. |
| advisor lenses `advisor-amodei`, `advisor-commey` | AI-safety + eval-driven review of agentic artifacts (see Part 3). |

**Gate 3 green when:** every registered artifact passes the security checklist; a missing tool or unproven check is RED, never skipped.

### G4 — INVESTOR-READY (pillar ④) — package for "I need a stake"
| Skill | When / why |
|---|---|
| `enotna-ekonomika` | Model unit economics — cost taken out, throughput added. |
| `vrednostno-cenovanje` | Value-based pricing of the new AI-run capability. |
| `pricing` | Packaging/tier strategy for the productized capability. |
| `client-pricing-sheet` | Render the transparent managed-margin cost sheet (EUR). |
| `pozicioniranje` | Position the AI-run company for investors. |
| `distribucijski-kanali` | Show the go-to-market / distribution moat. |
| `marketing-plan` | AARRR growth roadmap tied to funding milestones. |
| `product-marketing` | ICP + narrative framing of the offering. |
| `revops` | Prove the revenue-ops engine the automations now drive. |
| `competitor-profiling` | Defensibility vs. rivals in the pitch. |
| `hormozi-offer-engineer` | Engineer the investor/customer offer + value stack. |
| `deep-research` | Benchmark metrics against real market comparables. |
| the advisor board | Summon investor-grade lenses (see Part 3) to stress the thesis. |

**Gate 4 green when:** the package answers every rubric criterion with a real number/artifact from this build, not a claim. *(Rubric finalizes when Ian's investor docs arrive.)*

---

## Part 2 — Per-PILLAR skill roster

### ① App (four-gate app engine, `3day-protocol/`)
`ian-design-standards`, `design-consultation`, `design-review`, `design-shotgun`, `taste-redesign`, `taste-minimalist`, `interface-design`, `ui-ux-pro-max`, `refactoring-ui`, `web-design-guidelines`, `design-html`, `web-specialist`, `responsive-mobile`, `shadcn`, `clone-website`, `graphic-designer`, `gsap-core`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-react`, `gsap-plugins`, `gsap-performance`, `supabase`, `supabase-postgres-best-practices`, `schema`, `deploy-to-vercel`, `setup-deploy`, `land-and-deploy`, `vercel-optimize`, `plan-eng-review`, `plan-design-review`, `qa`, `qa-only`, `browse`, `verification-before-completion`, `ship`.

### ② Infrastructure (scan → blueprint)
`web-intake`, `client-onboarding-dashboard`, `customer-research`, `competitor-profiling`, `competitors`, `niche-research`, `analytics`, `analytics-dashboard`, `revops`, `notion-business-os`, `gws-commander`, `scrape`, `agent-browser`, `site-architecture`, `deep-research`, `theory-of-constraints`, `spec`, `schedule`, `morning`.

### ③ Agents (agent / automation factory)
`ai-agent-setup`, `app-graditelj`, `composio-cli`, `whatsapp-ai-agent`, `voice-builder`, `agent-browser`, `hook-generator`, `pair-agent`, `prompt-engineer`, `dispatching-parallel-agents`, `subagent-driven-development`, `scrape`, `schedule`, `cowork-project-prompt`, `setup-cowork`, `gws-commander`, `setup-browser-cookies`.

### ④ Investor (investability)
`enotna-ekonomika`, `vrednostno-cenovanje`, `distribucijski-kanali`, `pozicioniranje`, `pricing`, `client-pricing-sheet`, `marketing-plan`, `product-marketing`, `revops`, `competitor-profiling`, `hormozi-offer-engineer`, `theory-of-constraints`, `deep-research`.

### ⑤ Security (hardening gate — cross-cutting)
`cso`, `security-review`, `code-review`, `guard`, `careful`, `review`, `receiving-code-review`, `requesting-code-review`, `investigate`, `devex-review`, `plan-eng-review`, `verification-before-completion`, `benchmark`, `canary`.

---

## Part 3 — Review board (the 44 advisor-* expert lenses)

Summon an advisor as an on-demand review lens: `-> invoke advisor-<name>` (exit with "exit expert mode"). Group by the decision on the table. For a full sweep, `-> invoke autoplan` runs the CEO/design/eng/DX review pipeline in sequence.

| Summon when the decision is… | Lenses |
|---|---|
| **Offer / value / guarantees** (G4, G1 backlog framing) | `advisor-hormozi`, `advisor-campbell`, `advisor-skok` |
| **Pricing / value metric / unit economics** (G4) | `advisor-campbell`, `advisor-skok`, `advisor-marks` |
| **Positioning / category / messaging** (G4) | `advisor-dunford`, `advisor-ries-trout`, `advisor-neumeier` |
| **Differentiation / JTBD / why-they-switch** (G1, G4) | `advisor-christensen`, `advisor-kim-mauborgne` |
| **Strategy / second-level reasoning / risk** (G1, G4) | `advisor-martin`, `advisor-marks`, `advisor-tetlock`, `advisor-galef` |
| **UX / usability / interaction design** (G2 app) | `advisor-norman`, `advisor-krug`, `advisor-nielsen`, `advisor-cooper`, `advisor-redish` |
| **Audience calibration / personas** (G0, G2) | `advisor-cooper`, `advisor-norman-audience`, `advisor-young` |
| **Visual / brand / typography** (G2 app) | `advisor-vignelli`, `advisor-lupton`, `advisor-tufte`, `advisor-neumeier` |
| **Persuasion / conversion copy** (G2, G4) | `advisor-cialdini`, `advisor-schwartz`, `advisor-wiebe`, `advisor-laja` |
| **Trust / ethics / dark-pattern audit** (G3, G2) | `advisor-cofone`, `advisor-cialdini` |
| **AI safety / agent design / alignment** (G2 agents, G3) | `advisor-amodei` |
| **LLM/agent evaluation / eval-driven QA** (G2 agents, G3) | `advisor-commey`, `advisor-microsoft-azure` |
| **Systems / automation / quality / variation** (G0→G2) | `advisor-deming` |
| **Code health / legacy / testability** (G2, G3) | `advisor-feathers`, `advisor-mcconnell` |
| **Experiment design / claims falsifiability** (G1, G4) | `advisor-popper`, `advisor-nosek`, `advisor-sagan` |
| **SEO / content discoverability** (G4 GTM) | `advisor-slawski`, `advisor-shepard` |
| **Personal-brand / founder positioning** (G4) | `advisor-gadzhi`, `advisor-vernon`, `advisor-georgi`, `advisor-roof`, `advisor-oneill`, `advisor-weinberg` |

*(Remaining lenses — the full 44 `advisor-*` set — are available on demand as a general review board via `autoplan` and `office-hours`.)*

---

## Part 4 — Meta / deliverables

The protocol ships as **knowledge (PDFs) + skills**. These skills produce and maintain the deliverables at every gate.

| Skill | Use for |
|---|---|
| `make-pdf` | Render any gate deliverable (operating manual, blueprint, security standard, investor package) to publication-quality PDF. |
| `docx` | Word deliverables — client-facing reports, memos, contracts. |
| `pptx` | Investor / stakeholder decks (G4). |
| `xlsx` | Unit-economics models, backlogs, cost sheets as spreadsheets (G1, G4). |
| `pdf` | Read/parse client-supplied PDFs during scan; assemble PDF handovers. |
| `document-generate` | Generate missing documentation for any built artifact (G2, handover). |
| `skill-creator` | Author a bespoke, client-specific skill when the library has no fit — then wire it back into this manifest. |
| `spec` | Turn any gate decision into a backlog-ready, executable spec. |
| `autoplan` | Full auto-review pipeline (CEO → design → eng → DX) at any gate boundary. |
| `office-hours` | YC-style product review of the operating model or a built artifact. |
| `consolidate-memory` | Persist engagement state + decisions across sessions. |
| `copywriting` / `emails` / `content-strategy` / `marketing-psychology` | Client-facing narrative, outreach, and go-to-market content (G4). |
