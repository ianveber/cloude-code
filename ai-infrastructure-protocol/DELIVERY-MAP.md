# Delivery Map - what's hands-free, and what needs a human

The AI Infrastructure Protocol is **done-for-you**: AIS runs the engine, the client grants access + approves at the gates. The engine automates the heavy synthesis, code, and review. Three things always need a human: **access** (connect the client's systems), **discovery** (the scan must SEE the company), and **trust** (any real-world agent action needs approval). This map shows exactly who does what, per pillar. Full step-by-step in each pillar's `RUNBOOK.md`.

> Sell this line: *"You don't lift a finger on the building. You grant access, answer our discovery, and approve at each gate - AIS builds your entire AI operation, secured, and packaged so investors want in."*

## At a glance

| Pillar | Fully automated | AIS operator | Client actions |
|---|:--:|:--:|:--:|
| ① App (four-gate build engine) | 8 | 12 | 9 |
| ② Infrastructure - Scan → Blueprint (G0 SCAN + G1 BLUEPRINT) | 8 | 14 | 6 |
| ③ Agents (agent / automation factory) | 7 | 7 | 6 |
| ④ Investor-Readiness (Gate 4) | 6 | 15 | 8 |
| ⑤ Security - G3 SECURE (the hardening gate) | 6 | 9 | 7 |

## ① App (four-gate build engine)

**Fully automated (the engine does it):**
- Scaffold Next.js + Supabase + Vercel app from the ais-os skeleton
- Generate RLS deny-by-default policies + pgTAP negative-case tests
- Secret scan (gitleaks or built-in regex fallback)
- Input-validation heuristics on API route handlers
- Local shadow-DB security pass (app engine gate-2)
- Deployed anonymous RLS probe against every protectedRoute (gate-3)
- Render SHIP-REPORT.md handover artifact
- Hard-block any deploy below a fresh green gate-2 via deploy-guard hook

**AIS operator drives (skill in `code`):**
- O1 Receive/validate the app-kind backlog item from blueprint.json -> invoke `spec`
- O2 Scaffold the run: mkdir ~/builds/<id>, gate-check init, gate-check doctor -> invoke `3day-app-protocol`
- O3 Compile discovery answers into .protocol/spec.json + close P1 with gate-check 0 -> invoke `web-intake`
- O4 Produce 2-3 design variants for core screens (Apple-light for tools, photoreal bar for marketing) -> invoke `ian-design-standards`
- O5 Run design lint then record client sign-off: gate-check 1 --approve -> invoke `plan-design-review`
- O6 Build from ais-os skeleton, RLS deny-by-default, zod input validation, no secrets in code -> invoke `supabase`
- O7 Security pass P4: gate-check 2 (pgTAP + secret scan + input validation) -> invoke `security-review`
- O8 Wire client-supplied third-party keys into Vercel env (non-NEXT_PUBLIC for secrets) -> invoke `deploy-to-vercel`
- O9 Deploy to prod + live verify: vercel deploy --prod, gate-check 3 --url -> invoke `land-and-deploy`
- O10 Add + verify custom domain in Vercel (vercel domains inspect, dig) -> invoke `setup-deploy`
- O11 Register artifact in engagement-root .protocol/artifacts.json + confirm green SHIP-REPORT -> invoke `verification-before-completion`
- O12 Final QA sweep against live deployment (signup -> core action -> persist -> access boundary) -> invoke `qa`

**You, the client:**
- C1 Create a Supabase project (EU/Frankfurt region) and paste Project URL, anon key, service_role key, Reference ID
- C2 Create/authorize a Vercel account and invite AIS as a Member (or provide a deploy token)
- C3 Turn OFF Vercel git auto-deploy for the project if asked (keeps security gate the single choke point)
- C4 Send brand assets: logo (SVG/PNG transparent), colors (hex), fonts, product photos
- C5 Send real content: page copy, example records, user roles + who-sees-what in plain language
- C6 Provide third-party API keys the app needs (Stripe pk/sk, email, AI, maps), noting test vs live
- C7 Approve ONE design variant (design sign-off, gates the visible build)
- C8 Add DNS records at registrar: A record @ -> 76.76.21.21 for root, CNAME www/app -> cname.vercel-dns.com for subdomain
- C9 Give explicit go-live approval after live verification

## ② Infrastructure - Scan → Blueprint (G0 SCAN + G1 BLUEPRINT)

**Fully automated (the engine does it):**
- Generate the bilingual (EN+SL) discovery questionnaire from the named departments
- Live tool inventory once access is granted (agent-browser web-app mapping, scrape public surface, composio API/webhook probe → captured to evidence/scan-inventory.txt)
- Reconcile interview vs inventory and surface every mismatch as a pain or declared gap
- Quantify volume/hours/pain per process and assemble company-scan.json
- Disposition logic with fully-automate default + artifact naming per process
- Backlog ranking math (impact = volume×hours×maxPainSeverity / effort = buildDays+blockers → priorityScore, dense rank) written reproducibly to evidence/blueprint-ranking.txt
- AI-involvement rollup (asIsPercent → toBePercent, hours-weighted) and sprint split this/next/later
- Schema validation of company-scan.json and blueprint.json and machine-writing of gate-0.json / gate-1.json (stale-on-drift)

**AIS operator drives (skill in `code`):**
- O1 Kickoff capture: record company + namedDepartments[] + per-department process owner (coverage contract) -> invoke `client-onboarding-dashboard`
- O2 Generate + send the bilingual discovery pack per department driving the 8 required fields -> invoke `web-intake`
- O3 Book discovery sessions (45-60min/department owner + 30min exec kickoff) -> invoke `schedule`
- O4 Run each interview (Pass 1), anchoring hours to a concrete recent instance, one capture agent per department merged -> invoke `dispatching-parallel-agents`
- O5 Inventory the live stack (Pass 2) ONLY for consent-recorded tools: web-app map -> invoke `agent-browser`; public surface -> invoke `scrape`; API/webhook probe setting tools[].hasApi -> invoke `composio-cli`
- O6 Reconcile (Pass 3): every interview-vs-inventory mismatch becomes a pain or declared gap -> invoke `revops`
- O7 Write company-scan.json, fill coverage[] + declare every gap with a reason, set method[] -> invoke `notion-business-os`
- O8 Validate scan vs schema + run Gate 0 (5 criteria) and write gate-0.json -> invoke `verification-before-completion`
- O9 Disposition every process (default fully-automate; keep-human only with enum humanOnlyReason) + name artifacts with kind + buildsOnSkill[] -> invoke `spec`
- O10 Pressure-test dispositions against the fully-automate default via an expert lens -> invoke `advisor-christensen`
- O11 Rank backlog (impact×effort) + hours-weighted AI-involvement rollup, math to evidence -> invoke `enotna-ekonomika`
- O12 Write blueprint.json, validate vs schema + run Gate 1 (6 criteria), write gate-1.json -> invoke `verification-before-completion`
- O13 Render the client sign-off PDF (disposition table + ranked backlog + asIs→toBe headline) -> invoke `make-pdf`
- O14 Record client sign-off / send-backs in journal.jsonl and release sprint:this backlog to G2 by kind -> invoke `notion-business-os`

**You, the client:**
- C1 Name departments + one hands-on process owner each (the coverage contract Gate 0 checks)
- C2 Fill the discovery questionnaire per department before the interview (steps/tools/frequency/time)
- C3 Do the 45-60min discovery interview per department (warm-up → click-by-click process walk → pain hunt → handoffs), at their computer with normal tools open
- C4 Grant READ-ONLY access per tool (Google Workspace Viewer, CRM view-only role, Notion Can-view, Airtable read-only, Stripe Analyst; screen-share for un-shareable tools) and confirm each tool name so consent is recorded
- C5 Answer 2-3 async gap follow-up questions to keep the scan complete instead of gapped
- C6 Sign off the blueprint: flag genuine keep-human items, approve or re-order the ranked backlog, reply 'Approved' — nothing builds until then

## ③ Agents (agent / automation factory)

**Fully automated (the engine does it):**
- Turn a blueprint backlog item into an agent spec.json (11 fields)
- Draft the per-agent authority matrix from the spec (read=autonomous, send/pay/delete=draft-only by rule)
- Compose the bundled skills into the artifact and wire hitl gates at every outward step
- Run VERIFY on seeded real inputs and write verify.json
- Register the artifact in artifacts.json (security:pending, shipped:false)
- Write gate/evidence JSON and flip shipped once security is green
- Check granted scope vs spec, secrets-not-embedded, and cost cap enforcement

**AIS operator drives (skill in `code`):**
- OP-1 Intake: pull backlog item, write .protocol/agents/<slug>/spec.json with least-privilege tools + hitl entries -> invoke spec
- OP-2 Classify spec into one type and map to a builder skill -> invoke whatsapp-ai-agent / voice-builder / composio-cli / agent-browser / scrape / hook-generator / dispatching-parallel-agents
- OP-3 Draft per-agent authority.md (one row per action; read=autonomous, outward=draft-only) -> invoke spec
- OP-4 Wire service-account access with the client, confirm narrowest OAuth scopes -> invoke gws-commander and composio-cli (search->link->get-schema->dry-run)
- OP-5 Run PROPOSE->BUILD->VERIFY loop on real seeded inputs, read the produced artifact not the checkmark -> invoke verification-before-completion
- OP-6 Register in artifacts.json then route through the Security gate; only set shipped on green -> invoke cso / security-review / guard
- OP-7 Staged rollout draft->supervised->autonomous, log each dated promotion in authority.md -> invoke schedule

**You, the client:**
- CL-1 Create a dedicated service account per agent (admin.google.com Add user, or a fresh account) — never their personal login
- CL-2 Grant access: click Allow on the OAuth consent link signed in as the service account, or paste a restricted API key into the secure link (Composio/gws)
- CL-3 Sign the authority matrix — tick Approve or drafts-only per action row, with name + date; anything unticked stays drafts-only
- CL-4 Review drafts and Approve/Reject queued actions during the supervised stage
- CL-5 Approve each promotion (draft->supervised->autonomous) when asked; always reversible
- CL-6 Use the master switch to revoke any agent instantly (myaccount.google.com Security, or app Connected apps -> Revoke)

## ④ Investor-Readiness (Gate 4)

**Fully automated (the engine does it):**
- Read .protocol/artifacts.json + pillar-② scan/blueprint and extract per-agent data loops and throughput deltas
- Read the pillar-⑤ gate-3.json set into security-posture evidence (criterion 8)
- Pull the scan baseline (hours/errors per process) from company-scan.json
- Assemble the investor-package/ skeleton (00-05 files + evidence/ dir)
- Copy every cited artifact into evidence/ and check one-hop traceability
- Write gate-4.json (green only if rubric has 0 RED, all 7 lenses run, G3 green on 100% of artifacts)

**AIS operator drives (skill in `code`):**
- 2.1 G3 pre-check: confirm every registered artifact has a green gate-3, else STOP -> invoke cso
- 2.2 Send client the data request before any synthesis -> invoke web-intake
- 2.3 Extract the build log into a per-artifact working table -> invoke revops
- 2.4 Model unit economics (LTV:CAC, payback, GM 45-65%, rev/employee) with margin-expansion path -> invoke enotna-ekonomika
- 2.5 Price the value created, then model recurring/expansion -> invoke vrednostno-cenovanje then -> invoke revops
- 2.6 Size the market bottoms-up TAM/SAM/SOM -> invoke niche-research then -> invoke competitor-profiling
- 2.7 Fix category + one-line thesis (every bracket -> a GREEN cell) -> invoke pozicioniranje
- 2.8 Fill the DRAFT rubric, one number/artifact per cell, no adjectives -> invoke enotna-ekonomika
- 2.9 Run the 7-lens advisor board adversarially over the filled rubric -> invoke advisor-skok, advisor-campbell, advisor-hormozi, advisor-christensen, advisor-dunford, advisor-kim-mauborgne, advisor-marks
- 2.10 Write moat + defensibility (loop/switching-cost/replicate-time) -> invoke advisor-christensen
- 2.11 Write architecture narrative as a moat story with ASCII map -> invoke pozicioniranje
- 2.12 Build the 8-category data-room index -> invoke revops
- 2.13 Assemble evidence/ and verify one-hop traceability -> invoke verification-before-completion
- 2.14 Render package to PDF/sheet/deck -> invoke make-pdf, -> invoke xlsx, -> invoke pptx
- 2.15 Write gate-4.json with rubricStatus DRAFT -> invoke verification-before-completion

**You, the client:**
- 3.1 Export last-12-month P&L + balance-sheet cash from accounting tool (Reports -> P&L / Balance Sheet -> export Excel/CSV)
- 3.2 Send operating metrics: monthly throughput, error/rework rate, retention/churn
- 3.3 Send acquisition numbers: CAC and customer lifetime value (estimates OK if marked)
- 3.4 Answer 5 story questions (ICP, category, competitors, why-now, uncopyable thing)
- 3.5 Optionally grant read-only access: Google Sheet Share->Viewer (spreadsheets.readonly) or Drive folder Share->Viewer (drive.readonly), or just email exports
- 3.6 Approve presenting the first score with the DRAFT-RUBRIC banner
- 3.7 Pick raise stage (pre-seed/seed vs Series A) so scoring uses the right column
- 3.8 Confirm the 8-part data-room checklist: which docs exist / can be produced / are missing

## ⑤ Security - G3 SECURE (the hardening gate)

**Fully automated (the engine does it):**
- Per-artifact control loop over .protocol/artifacts.json (applicability matrix selects which of the 8 controls apply per artifact type)
- S1 secret scan of tree + git history (gitleaks or regex fallback) writing findings:0 evidence
- S3 pgTAP RLS suite on the local shadow DB via `supabase test db` (deny-by-default negative per table)
- S5 rate-limit + AI cost-ceiling probe (N+1 request -> 429) writing per-endpoint evidence
- S7 dependency audit (npm/bun/pip/cargo audit) + lockfile-tracked check
- Gate close: `gate-check 3` verifies every artifact green, runs live probes, writes gate-3.json, and marks the gate STALE on any later commit/dirty worktree

**AIS operator drives (skill in `code`):**
- Arm destructive-command + edit-boundary guardrail scoped to the artifact dir before touching any live artifact -> invoke `/guard` (or `/careful` for read-only scan passes)
- Run the adversarial find-pass per artifact using scoped phases (--code, --supply-chain, --scope llm-ai, --scope webhooks) -> invoke `/cso`
- Run the diff-scoped reviewer over G2 changes to catch security regressions -> invoke `/security-review`
- Prove S3 RLS + tenant isolation with pgTAP negatives -> invoke `/supabase-postgres-best-practices`
- Run the deployed anon-probe on every protectedRoute (must 401/403/redirect) and N+1 abuse probe on AI/public endpoints (must 429) -> invoke `/qa-only`
- Provision production secrets into the host store safely and rotate any ever-committed key, then re-run S1 -> invoke `/careful`
- Fix reds in place, re-run only the affected control, re-write its evidence file -> invoke `/code-review`
- Confirm completion status DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT before closing -> invoke `/verification-before-completion`
- Package the one-page plain-language client security summary from the gate result + evidence index -> invoke `/make-pdf`

**You, the client:**
- Confirm the access rules per system in one line each (who may see what) so RLS + scopes are provable
- Paste each production secret into the exact host box we send (Vercel Settings > Environment Variables > Production; Supabase Settings > API / Edge Function Secrets) and send back the key NAME only, never the value
- Rotate (regenerate at the source) any key we flag as exposed and paste the new value
- Invite the AIS email as Member/Developer on Vercel + Supabase so we can run the live reject-a-stranger and abuse probes
- Approve the narrow-scope OAuth consent screens for agents (Allow only if scopes match; Cancel + tell us if over-broad)
- Sign the residual-risk sign-off form for any DONE_WITH_CONCERNS item or attestation before ship (never for S1 secrets or S3 data access)
- If asked, name one break-glass attester who accepts responsibility for a single unverifiable control when tooling is genuinely down

## What we need from you - master checklist

Everything AIS needs from the client across the whole engagement, grouped by phase. AIS sends this as the kickoff packet.

**① App (four-gate build engine)**
- [ ] Supabase: Project URL + anon key + service_role key + Reference ID (created at supabase.com, EU region)
- [ ] Vercel: account created + AIS invited as Member (or a deploy token)
- [ ] Brand assets: logo (SVG/PNG), colors (hex), fonts, product photos into the shared Drive folder
- [ ] Real content: page copy, records/examples, user roles and access rules in plain words
- [ ] Third-party API keys (only those the app uses): Stripe / email / AI / maps, marked test vs live
- [ ] Design sign-off: pick ONE variant from the set we send
- [ ] Domain: registrar login access OR willingness to add the 2 DNS records we send
- [ ] Go-live approval: explicit 'go' after live verification

**② Infrastructure - Scan → Blueprint (G0 SCAN + G1 BLUEPRINT)**
- [ ] Departments + owners list (each business area + one hands-on contact, name + email)
- [ ] Completed discovery questionnaires, one per department, before interviews
- [ ] Discovery interviews booked (45-60min per department owner + 30min exec kickoff)
- [ ] Read-only access granted per in-scope tool (Google Workspace Viewer, CRM view-only, Notion Can-view, Stripe Analyst, etc.) + one-line consent confirm per tool
- [ ] Screen-share slots for any tool that can't be shared by invite
- [ ] Async follow-up answers on any number that couldn't be pinned down
- [ ] Blueprint sign-off — read the PDF, flag real keep-human items, approve/re-order the backlog, reply 'Approved'

**③ Agents (agent / automation factory)**
- [ ] Dedicated service account login for each agent (not personal SSO)
- [ ] OAuth consent clicked / restricted API key pasted per system the agent touches (e.g. Gmail gmail.compose draft-only, Calendar calendar.readonly, Stripe read invoices)
- [ ] Signed authority matrix — every action row Approve or drafts-only, name + date
- [ ] Per-agent daily cost ceiling in EUR
- [ ] Named approver (email/WhatsApp) to receive approve/reject prompts during supervision
- [ ] Any send-without-approval request in writing with their name
- [ ] Missing spec answers: trigger time, exact recipients, definition of done

**④ Investor-Readiness (Gate 4)**
- [ ] Financials: 12-mo monthly P&L (revenue, COGS incl AI/cloud, opex), balance-sheet cash, monthly burn, ARR/MRR + NRR if subscription
- [ ] Operating metrics: monthly throughput, error/rework rate, yearly retention/churn, headcount now vs ~12mo ago
- [ ] Acquisition: CAC and LTV (or avg monthly spend × months retained), estimate flagged as such
- [ ] Story inputs (2-3 sentences each): ICP + current alternative, one-phrase category, top-3 competitors + why-you, why-now, the uncopyable thing
- [ ] Decisions: raise stage, Y/N to present with DRAFT-RUBRIC banner, access preference (share read-only Sheet/Drive or email exports)
- [ ] Access (only if sharing): Google Sheet or Drive folder shared as Viewer with the AIS operator email

**⑤ Security - G3 SECURE (the hardening gate)**
- [ ] ACCESS RULES: one line per system on who may see what
- [ ] SECRETS: each production key pasted into the exact host box we send; return the key NAME only
- [ ] ROTATE: regenerate any flagged-exposed key at its source and paste the new one
- [ ] HOST ACCESS: invite AIS email as Member (Vercel) / Developer (Supabase) so we can run live probes
- [ ] OAUTH: approve the narrow-scope consent screens for any agents
- [ ] RESIDUAL RISK: a decision-maker signs the sign-off form for any accepted risk
- [ ] ATTESTER (only if requested): name one person for break-glass

## How agent autonomy grows (the trust ladder)

No agent gets real-world authority on day one. Each agent climbs a ladder, and the client approves each promotion (see `pillars/3-agents/RUNBOOK.md`):

1. **Draft-only** - the agent proposes; a human sends/acts. (Like the invoice-chaser: it writes the reminder, never sends it.)
2. **Supervised** - the agent acts, but every action is logged and reversible, reviewed daily.
3. **Autonomous** - proven safe over a set volume, the agent acts unattended within a written authority matrix; anything outside it still drafts for approval.

This ladder is the product: *the AI never acts without approval until you've seen it be right.*
