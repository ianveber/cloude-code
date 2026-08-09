# Scoping Questionnaire

Used in Phase 2 (Scoping) to capture everything needed to draft an accurate SOW. Combination of live conversation (2 sessions, 60–90 min each) and async questionnaire (sent between sessions, completed by client).

Outputs go into `/engagements/[client-name]/scoping/` as the source-of-truth for SOW drafting.

This file is both the questionnaire itself (for cofounder use) and the structured doc clients fill in.

---

## How to use

### Session 1 — Function deep-dive (60–90 min)

Cofounder leads. Walk through sections 1–4. Take detailed notes (or use meeting recorder with transcript).

End of session: send Section 5–9 as an async questionnaire for client to complete within 5 business days.

### Async period (3–5 business days)

Client completes Sections 5–9 in a shared document or fills in this template as a returnable doc. Cofounder reviews completed answers; flags ambiguities for Session 2.

### Session 2 — Technical and organizational scoping (60–90 min)

Cofounder leads. Walk through Sections 10–12. Resolve any ambiguities from the async questionnaire.

End of session: cofounder ready to draft SOW.

### SOW drafting (3 business days post-Session 2)

Cofounder lead drafts SOW using `delivery/sow-template.md`. Cross-cofounder review before send.

---

## Section 1 — The function being owned

> **What function are you asking AIS to own? State it in one sentence.**
> (If you can't say it in one sentence without "and" appearing multiple times, the function isn't bounded. Re-scope before continuing.)

> **What are the inputs to this function? Where do they come from?**

> **What are the outputs? Who receives them?**

> **What's the current end-to-end cycle time?** (e.g. "8–14 days from intake to scoped memo")

> **What's the current volume?** (per day / per week / per month, whichever is most natural)

---

## Section 2 — Current state

> **Who currently does this work? Names and roles, please.**

> **How long have they been doing it? Has the function been stable or evolving?**

> **What tools do they use? List every tool that touches this function.**

> **Where does data for this function live?** (CRM, file system, email, spreadsheets, paper, etc.)

> **Where are the bottlenecks today?** (specific steps, not "everything")

> **What's the cost of the function currently?** (Salary of people doing it, tool costs, opportunity cost on senior time, lost-revenue cost of delays)

---

## Section 3 — Desired future state

> **What does success look like 12 months after deployment?** (Quantitative if possible — "intake-to-scope under 48 hours, partner time on routine scoping <30 min/week")

> **What's the biggest thing you'd want the agent stack to do that humans can't?** (Speed? Consistency? 24/7 availability? Hyper-personalization?)

> **What are you willing to trade off?** (e.g. "I'll accept slightly less personalized output if it ships 10× faster")

> **What's non-negotiable?** (e.g. "Every output that touches a client must pass partner review")

---

## Section 4 — Stakeholder context

> **Who is the sponsoring decision-maker on your side?** (Name, title, role, decision authority)

> **Who would be the named function owner during operate phase?** (Name, title, role; this person samples outputs and handles escalations)

> **Who else is affected by this function being owned by an agent stack?** (List by role or name. Who might feel threatened? Who might be skeptical? Who's an enthusiastic supporter?)

> **Is there anyone in your organization who could veto or stall this deployment?** (IT? Security? Legal? Long-tenured operator?)

> **What internal communication has happened about this engagement so far?** (Has the broader team been told? What was the framing?)

---

## Section 5 — ICP / function-specific scope (async)

If the function involves customer or prospect targeting (Acquirer Agent deployments, Closer Agent for outbound-driven engagements):

> **Describe your ICP in 2–3 sentences.** (Industry, size, role, function shape — be specific)

> **Who are your 5 most representative current customers?** (Names, why each is representative)

> **Who are 3 customers you wish you hadn't taken on?** (Names, what made them wrong-fit)

> **Are there industries, company types, or buyer roles you explicitly want to exclude?**

> **Do you have a documented ICP, or is this conversation it?**

---

## Section 6 — Voice and brand (async)

> **Whose voice should agent outputs sound like?** (Specific named person, or "the company voice as a whole")

> **Can you provide 16+ samples of that voice within 5 business days of engagement start?** (Yes/No — if No, we run an extraction-interview workflow)

> **What kind of samples are available?** (Customer emails, blog posts, internal messages, prior published content, etc.)

> **Are there specific words, phrases, or stylistic patterns you want emphasized or avoided?**

> **Are there compliance constraints on outputs?** (Regulated language, prohibited claims, mandatory disclaimers, jurisdictional rules)

---

## Section 7 — Tool inventory (async)

For each tool the function touches:

> | Tool | Vendor | Version / plan | API access? | Who has admin? | Notes |
> |---|---|---|---|---|---|
> | CRM | | | | | |
> | Email | | | | | |
> | Calendar | | | | | |
> | Communication (Slack/Teams) | | | | | |
> | Document storage | | | | | |
> | Vertical-specific tool 1 | | | | | |
> | Vertical-specific tool 2 | | | | | |
> | Other relevant | | | | | |

> **Any tools the deployed agent stack must NOT touch?** (Regulatory, contractual, or organizational reasons)

> **Any tools you're planning to switch in the next 12 months?** (Affects integration planning)

---

## Section 8 — Data and security (async)

> **What's the most sensitive data the agent stack will touch?** (Customer PII, financial records, health records, privileged communications, etc.)

> **What's your organization's policy on cloud-deployed AI handling this data?**

> **Are there jurisdictional data residency requirements?** (e.g. EU data stays in EU)

> **Do you have a security/compliance person we should involve in scoping?** (Name, role)

> **Are there contractual constraints with your customers about how their data is processed?** (e.g. DPAs limiting AI use)

---

## Section 9 — Success metrics (async)

> **What's the single most important metric this engagement will move?**

> **Where is that metric today (baseline)? Where do you want it 12 months from now?**

> **Who tracks that metric currently? How?**

> **What secondary metrics matter?** (List up to 5)

> **Are there leading indicators we should track during build phase?** (Earlier signals that the engagement is on or off track)

---

## Section 10 — Integration scoping (Session 2)

Walked through live. Cofounder + client's most-technical operator present.

> Map the data flows: where does data enter the function, where does it leave, what transformations happen in between.

> For each integration: API documentation review, authentication method, rate limits, sandbox availability for testing.

> Identify any custom development needed beyond standard integrations.

> Identify any tools that require new licenses or seats (and who pays — client or AIS, itemized in SOW).

> Identify any tools where the existing license doesn't cover programmatic access (needs upgrade or workaround).

> Sketch the architecture: which agents talk to which tools, where Knowledge Agent's index lives, where audit trails are written.

---

## Section 11 — Risks (Session 2)

Walked through live. Honest conversation, not a checkbox exercise.

> **What's the most likely way this engagement fails?**

> **Have you tried something like this before? What happened?**

> **Is there organizational politics around this engagement?**

> **Is there a deadline (real or perceived) driving this engagement?** (Some deadlines are artificial; some are real)

> **What happens if we miss the 10–16 week build phase target?**

> **Is there a budget contingency for unexpected scope additions?**

> **What's your tolerance for the engagement requiring more from your team than expected?**

---

## Section 12 — Timeline and commercial (Session 2)

> **Desired build-phase start date:**
> **Desired operate-phase start date:**
> **Build fee budget:**
> **Operate retainer budget (monthly):**

> **Any external events the engagement should align with?** (Product launch, board meeting, fiscal year, etc.)

> **What's your invoicing process? Net 7 / 14 / 30?**

> **Who signs the SOW on your side? Anyone else who needs to review?**

> **Are there standard MSA / DPA / NDA terms your organization requires?** (Send these to us; we'll incorporate or push back)

---

## What the cofounder does with the completed questionnaire

1. Review the full document. Look for inconsistencies between live-session answers and async answers (the most common source of mistakes).
2. Flag any sections where the client's answers don't pass the four-axis test (in case anything changed since discovery).
3. Compare requested scope to the relevant vertical playbook's standard scope. Note variances.
4. Compare requested timeline to standard build-phase length. Note any compression risks.
5. Draft the SOW using `delivery/sow-template.md`, populated with scoping answers.
6. Cross-cofounder review SOW draft. At minimum: another cofounder reviews scope boundaries and pricing.
7. Send SOW to client. Schedule 30-min SOW review call within 5 business days.

---

## Common questionnaire-completion problems

### Client returns the questionnaire with placeholder answers

> "Section 5: We'll figure out our ICP during the engagement."

Push back: "We need at least a hypothesis to scope the engagement. If you genuinely don't have an ICP, we should expand build phase by 2–3 weeks to include ICP definition work; that affects the build fee. Which is it?"

### Client skips sections

Common with security/compliance sections. Often because the client doesn't have the answer and needs to ask their IT or legal counterpart.

Response: "Section 8 needs answers before we can finalize SOW. Who in your organization owns those answers? Want us to schedule a 30-min call with them?"

### Client provides incompatible answers across sections

E.g. claims 80% margin lift target but won't share baseline numbers; wants 6-week build but the function spec maps to comprehensive engagement shape.

Response: walk through the inconsistency in Session 2. Force a resolution rather than papering over.

### Client wants to skip Session 2

"Let's just send the SOW based on Session 1 and the questionnaire."

Response: Session 2 covers integration and risk — the two things most likely to surprise us during build. Don't skip. Compress to 45 min if needed, but don't skip.

---

## Output: completed scoping package

By end of Phase 2, `/engagements/[client-name]/scoping/` should contain:

- `session-1-notes.md` (or transcript)
- `async-questionnaire.md` (completed by client)
- `session-2-notes.md` (or transcript)
- `architecture-sketch.md` (from Section 10)
- `risks.md` (from Section 11)
- `sow-draft-v1.md` (then v2, v3 as iterated)

This package is the basis for everything downstream. If it's thin, build phase will run into discovery-style surprises that should have surfaced now.
