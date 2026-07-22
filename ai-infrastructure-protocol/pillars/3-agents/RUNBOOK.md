# Pillar ③ Agents — Operator + Client Runbook

The factory (SKILL.md) says *how to build* an agent. This runbook says *who touches
what, when, and with which exact clicks* — so the operator never guesses and the
client always knows precisely what to grant, decide, or approve.

Three things in this pillar are inherently **manual and human** and this runbook exists
to make them frictionless:
1. **ACCESS** — a human at the client connects their systems (Google, CRM, invoicing,
   250+ apps via Composio) and hands over least-privilege credentials.
2. **AUTHORITY** — a human decides, per agent, exactly which actions run autonomously
   vs draft-only-for-approval (the `invoice-chaser` standard: it drafts, it never sends).
3. **PROMOTION** — a human approves each step of the staged rollout (draft → supervised
   → autonomous) before the agent is trusted with more.

Everything else — the spec, the code, the verify run, the security review — the
protocol automates.

---

## 1. Hands-free vs not (this pillar)

| Fully automated (protocol) | AIS operator (human-in-the-loop) | Client (must do it themselves) |
|---|---|---|
| Turn a blueprint item into an agent `spec.json` | Run the factory build loop (PROPOSE→BUILD→VERIFY) | Create the **dedicated service account** for each agent |
| Draft the per-agent **authority matrix** from the spec | Discover the right tool slug / persona / browser flow | **Grant OAuth scopes / paste API keys** into Composio or gws |
| Compose the bundled skills into the artifact | Present the authority matrix + get client sign-off | **Sign the authority matrix** (which actions are autonomous vs draft-only) |
| Run VERIFY on seeded real inputs; write `verify.json` | Seed realistic inputs; read the *actual* output | **Approve each promotion** draft→supervised→autonomous |
| Register the artifact in `artifacts.json` | Route the artifact through the ⑤ Security gate | Approve/reject queued drafts during the supervised stage |
| Write gate + evidence JSON, flip `shipped` | Set up logging + cost-cap + rate limits in the artifact | Decide the cost ceiling (€/day) they're comfortable with |
| Cost/scope/secret checks against the spec | Own the promotion schedule; log every decision | Revoke access at any time (they hold the master switch) |

**Iron rule inherited from the factory:** any action that leaves the company or can't be
undone (send / post / pay / delete / write-to-system-of-record) is **draft-only until a
named human signs off on promoting it.** "Fully automate" automates the drafting, never
the safety.

---

## 2. Operator runbook (exact procedures)

### OP-1 — Intake: blueprint item → agent spec
1. Pull the backlog item from `blueprint.json` (disposition `augment-ai` or
   `fully-automate`).
2. Write `.protocol/agents/<slug>/spec.json` with all 11 fields (SKILL.md Step 1). Any
   missing field is a **question you owe the client**, not a default — collect it in the
   "What we need from you" checklist (§4).
3. Set `tools` to the narrowest scope that makes the actions work (`read` before `write`,
   `draft` before `send`). Over-scope is a G3 finding.
4. Give every outward/destructive action an `hitl` entry. -> invoke `spec`

### OP-2 — Classify + map to a builder skill
1. Classify the spec into exactly ONE type (chat / integration / browser-rpa / event-hook
   / orchestration) using the artifact-type → skill map (SKILL.md Step 2).
2. Split a two-type item into two specs.
   - chat/assistant → -> invoke `whatsapp-ai-agent` (persona first via -> invoke `voice-builder`)
   - move data across SaaS apps → -> invoke `composio-cli`
   - drive a web UI with no API → -> invoke `agent-browser` (mutating) / -> invoke `scrape` (read-only)
   - react to an event → -> invoke `hook-generator`
   - one goal, many sub-tasks → -> invoke `dispatching-parallel-agents`

### OP-3 — Draft the per-agent **authority matrix** (the TRUST artifact)
1. From the spec's `actions` + `tools`, generate one row per action into
   `.protocol/agents/<slug>/authority.md`, columns:
   `action | tool+scope | reversible? | default authority | client decision | approver | promoted-on`.
2. Default authority column is filled by rule, not by preference:
   read/fetch/search = `autonomous`; any send/post/pay/delete/write-to-SoR =
   `draft-only`.
3. Leave `client decision`, `approver`, `promoted-on` blank — the client fills them at
   sign-off (§3, CL-3). Do **not** build any action as autonomous that the client has
   not signed. -> invoke `spec`

### OP-4 — Wire the service-account access (with the client, never their personal login)
1. Send the client the exact grant steps (§3). Never use the client's personal SSO —
   one dedicated service account per agent.
2. Google actions → -> invoke `gws-commander`; confirm the OAuth token carries only the
   scopes the spec needs, e.g.:
   - Gmail draft-only: `https://www.googleapis.com/auth/gmail.compose` (draft, never send)
   - Calendar read: `https://www.googleapis.com/auth/calendar.readonly`
   - Sheets log: `https://www.googleapis.com/auth/spreadsheets`
3. Any-of-250-apps actions → -> invoke `composio-cli`:
   `composio search "<task>"` → `composio link <toolkit> --scope <narrowest>` →
   `composio execute <slug> --get-schema` → `composio execute <slug> --dry-run`
   (`--dry-run` proves the request shape with zero side effects).
4. Record granted scope back into the spec `tools`; a broader token than the spec is a
   G3 RED.

### OP-5 — Build loop until VERIFY is green
1. PROPOSE in `journal.jsonl`: skill + slugs/hooks + the smallest safe proof (schema +
   `--dry-run`). Nothing outward happens here.
2. BUILD: compose the skill; inject `hitl` gates at every outward step **now** (never
   retrofit). Store under `.protocol/agents/<slug>/`.
3. VERIFY on **real seeded inputs**: read the *produced artifact* (draft file, DB row,
   screenshot), not the runner's green checkmark. Assert guardrails held (outward gated,
   cost under cap, scope respected, hooks exactly-once). Write `verify.json`.
   -> invoke `verification-before-completion`
4. RED verify never advances — diagnose, fix, re-run.

### OP-6 — Register + Security gate
1. On green verify, append the artifact to `.protocol/artifacts.json` with
   `security:"pending"`, `shipped:false`.
2. Route the artifact through pillar ⑤ (scope · hitl · secrets · cost · logging · input).
   -> invoke `cso` (then -> invoke `security-review` / -> invoke `guard` as needed)
3. Only on `security:"green"` set `shipped:true`. A missing tool or unproven check is
   RED, never a skip.

### OP-7 — Staged rollout (client approves each promotion)
1. **Stage 1 — draft/shadow:** agent runs, produces drafts/queue entries only, zero
   outward actions. Client reviews the drafts.
2. **Stage 2 — supervised:** agent may execute an action *only after* the client clicks
   Approve on each one (approval queue). Log accept/reject rate.
3. **Stage 3 — autonomous:** only for actions the client explicitly signed as autonomous
   in the authority matrix (OP-3), and only after a clean supervised window (recommend
   ≥1 week / ≥20 approvals with 0 rejects).
4. Each promotion is a dated line in `authority.md` (`promoted-on`) + a journal entry.
   Never self-promote. -> invoke `schedule` (to run the agent on its trigger between stages)

---

## 3. Client actions (plain language, exact clicks)

You (the client) are in control of three things: **who the robots are, what they're
allowed to touch, and what they're allowed to do on their own.** Nothing runs on its own
until you sign for it. You can pull the plug at any time.

### CL-1 — Create a dedicated service account (so the agent is never "you")
Every agent gets its own login — never your personal one. That way you can see exactly
what it did and switch it off without touching your own access.
- **Google:** go to **admin.google.com → Directory → Users → Add new user**. Name it
  e.g. `agent-invoices@yourcompany.com`. Send us the login, or add us as a delegate.
- **No Google admin?** Create a normal new account (e.g. a fresh Gmail/Workspace user)
  used *only* by the agent, and tell us its address.

### CL-2 — Grant access (the OAuth / API-key step)
This is the one part only a human at your company can do — you're handing the agent a
narrow key to one specific system.
- **Google (Gmail / Calendar / Sheets / Drive):** we send you one consent link. Open it,
  make sure you're signed in as the **service account from CL-1**, review the permissions
  shown (e.g. *"Create drafts"* — note it will say create/manage drafts, **not send**),
  and click **Allow**. That's it.
- **Other apps (Stripe, invoicing, CRM, Slack, Notion, 250+ others):** we send you a
  Composio connect link per app. Click it → you land on that app's normal login → sign in
  → click **Authorize / Allow**. You'll see the exact permission (e.g. Stripe *"read
  invoices"*). If it asks for more than reading when we told you read-only, **stop and tell
  us** — that's a red flag we want to catch.
- **API keys (where there's no login screen):** open the app's **Settings → Developers /
  API keys**, click **Create key**, copy it, and paste it into the secure link we send
  (never email it in plain text). Example: Stripe → **Developers → API keys → Create
  restricted key → tick only "Invoices: Read"**.

### CL-3 — Sign the authority matrix (what each agent may do)
We send you a one-page table per agent. Each row is one action the agent can take, with a
plain-English label and our recommendation:
- Rows marked **"drafts only — you send"** mean the agent prepares it and a human presses
  send. (This is how the invoice reminder works: it writes the reminder, it never sends
  it.)
- Rows marked **"can do on its own"** mean the agent acts without asking — we only mark
  read-type actions (looking things up) this way by default.
- For each row: tick **Approve** or **Change to drafts-only**, write your name and the
  date, send it back. **Anything you don't tick stays drafts-only.**

### CL-4 — Approve drafts during the supervised stage
For a week or two after an agent goes live, it works in front of you:
- **Draft stage:** you'll see the agent's output in a folder/queue (e.g. Gmail **Drafts**,
  or a Google Sheet "to approve" tab). Read them. Tell us what's wrong; we fix and re-run.
- **Supervised stage:** when an agent wants to actually do an action, you get a quick
  Approve / Reject (in the queue, or a WhatsApp/email prompt). Just tap the one you want.

### CL-5 — Approve a promotion (give an agent more rope)
When an agent has run clean under supervision, we ask you one question: *"This agent has
drafted 20 reminders with zero corrections — do you want it to send them automatically
from now on?"* You reply **yes** (and we promote it) or **not yet** (it stays drafts-only).
It's always your call, and always reversible — say the word and it goes back to drafts.

### CL-6 — The master switch
You can revoke any agent instantly: **Google →** myaccount.google.com **→ Security →
Third-party access → Remove**; **any app →** its **Settings → Connected apps → Revoke**.
Tell us and we'll confirm the agent is dark.

---

## 4. What we need from you (send-to-client checklist, this pillar)

Per agent we're building:

- [ ] **Service account created** (CL-1) — the dedicated login, not your personal one.
- [ ] **Access granted** (CL-2) — you clicked Allow on the consent link(s) / pasted the
      API key into our secure link, for each system this agent touches:
  - [ ] Google scope(s): ____ (e.g. Gmail create-drafts, Calendar read)
  - [ ] App + scope: ____ (e.g. Stripe read invoices)
  - [ ] App + scope: ____
- [ ] **Authority matrix signed** (CL-3) — every row ticked Approve or drafts-only, with
      your name + date.
- [ ] **Cost ceiling confirmed** — the most you want this agent to spend per day: € ____.
- [ ] **Approver named** — who receives the approve/reject prompts during supervision:
      ____ (email / WhatsApp).
- [ ] **Any "send-without-approval" request** you're making, in writing with your name
      (we'll build the safe default otherwise, and Security still reviews it).
- [ ] **Missing spec answers** — trigger time, exact recipients, what "done" looks like:
      ____

We provide back: the spec, the authority matrix, the verify evidence, and the security
result — before the agent takes a single real action.

---

## 5. Gate evidence (what this pillar writes into `.protocol/`)

This pillar contributes to **G2 BUILD** (its own artifacts) and hands each one to
**G3 SECURE**. Concretely, per agent `<slug>` it writes:

| Path | Written by | Turns green when |
|---|---|---|
| `.protocol/agents/<slug>/spec.json` | OP-1 | all 11 fields present + internally consistent (every action's tool in `tools`; every outward action has `hitl` or a named waiver) |
| `.protocol/agents/<slug>/authority.md` | OP-3 + CL-3 | every action row has a signed client decision + approver; no unsigned autonomous action |
| `.protocol/agents/<slug>/journal.jsonl` | OP-5 | one line per PROPOSE/BUILD/VERIFY pass + each promotion (audit trail) |
| `.protocol/agents/<slug>/verify.json` | OP-5 | `result:"green"` — observed output matches expected on real inputs AND all guardrails held |
| `.protocol/artifacts.json` (append) | OP-6 | entry with `verifyResult:"green"`, then `security:"green"`, `shipped:true` |
| `.protocol/gates/gate-3.json` | pillar ⑤ (OP-6) | all six checks (credentialScope · outwardGated · secretsNotEmbedded · costCapInCode · loggingOn · inputBounded) `pass` |

**Gate 2 is green for this pillar** when every "this sprint" backlog item is built,
`verify.json` green, registered, AND `shipped:true` — which means it has already cleared
G3. An artifact stuck at `security:"pending"` keeps Gate 2 RED. The factory declares
victory on *"it works, it's safe, and it's proven,"* never on *"it works."*

Reference implementation of every file above: `pillars/3-agents/proof-run/`
(the live `invoice-chaser` run — spec, authority-shaped verify, `gate-3.json` green).
