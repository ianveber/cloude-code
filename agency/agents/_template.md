# Agent Spec Template

Canonical structure for every agent in the AIS roster. Every file in this directory follows this shape. Skipping sections produces agent specs that don't survive deployment — fill all sections.

---

## Section 1 — Name + one-line purpose

Agent name (Acquirer, Closer, etc.) and one sentence describing the function it owns. Not a description of the technology — a description of the function.

**Example:**
> **Acquirer Agent.** Owns top-of-funnel demand generation via non-paid channels: content (GEO/AEO long-form), partnerships, and qualified outbound.

---

## Section 2 — Function ownership

What bounded function does this agent own end-to-end? What stays outside the agent's responsibility?

State explicitly: the function the agent owns, the function-adjacent work the agent does NOT own, the handoff boundaries with other agents and with humans.

**Example:**
> Owns: signal monitoring → enrichment → first-touch drafting → multi-touch sequencing → reply classification.
> Does not own: the actual sales conversation (handoff to human closer or to Closer Agent), the proposal generation (Closer Agent), the post-close onboarding (Onboarder Agent).
> Hard boundary: never sends external comms without human approval inside the build phase; approval is automated only in operate phase after the 30-day ladder completes.

---

## Section 3 — Inputs

What data, signals, or triggers does the agent consume? Be specific about sources and shapes.

**Example:**
> - Intent signals: Greenhouse/Lever job postings (API), BuiltWith tech-stack data (API), LinkedIn exec moves (programmatic via scraping or Sales Navigator API), Crunchbase funding events (RSS + API)
> - ICP definition: structured ICP document maintained by Knowledge Agent
> - Voice samples: 16+ archived samples maintained by Knowledge Agent
> - Sequence triggers: response classifications from Closer Agent

---

## Section 4 — Outputs

What artifacts does the agent produce? Where do they go?

**Example:**
> - Daily prioritized signal list (top 20 ICP-fit prospects), delivered to client's Slack and named human owner
> - First-touch drafts (email + LinkedIn DM), queued for approval in client's outbound tool
> - Weekly performance digest, delivered to named human owner

---

## Section 5 — Tools and integrations

What APIs, services, and integrations does the agent need to function? Be explicit about required vs optional.

**Example:**
> Required:
> - Claude API (or compatible LLM) for generation
> - Email sending platform with API (Outreach, Salesloft, Apollo, Instantly, or similar)
> - CRM API (Salesforce, HubSpot, Pipedrive, or Close)
> - At least one intent signal source API (typically Apollo + one of BuiltWith / Common Room)
>
> Optional:
> - Clay (data enrichment automation)
> - LinkedIn Sales Navigator API (scoped access)
> - Calendly / Cal.com (scheduling integration)

---

## Section 6 — Human owners

AIS-side owner during build phase. Client-side owner during operate phase. What they approve. What they escalate.

**Example:**
> **AIS-side owner during build:** Anej Vučič. Approves: ICP refinement decisions, voice-lock acceptance, intent signal source weighting. Escalates: scope changes, deliverability anomalies, ethical edge cases (e.g. signal data sources of questionable provenance).
>
> **Client-side owner during operate:** VP GTM or Head of SDR Ops. Approves: weekly sampled outputs, ICP refinements, partnership additions. Escalates: cross-team conflicts (e.g. SDR team friction), legal/compliance flags, requests for outside-scope work.

---

## Section 7 — Escalation rules

When does the agent stop and hand off to a human? What's the escalation path?

Be specific about thresholds, not just types.

**Example:**
> - Any first-touch draft with confidence score <0.7 → queue for human review, do not auto-send
> - Any reply classified as "complaint" or "legal threat" → immediate escalation to client-side owner, do not auto-respond
> - Any signal source returning anomalous data (e.g. 10× expected volume, sudden zero volume) → pause and escalate to AIS-side owner
> - Any cross-channel deliverability metric dropping >15% week-over-week → pause volume, escalate

---

## Section 8 — Success metrics

How do we know it's working? Quantitative + qualitative.

**Example:**
> **Quantitative (tracked weekly):**
> - Signal-to-meeting conversion rate (target: >2%)
> - First-touch reply rate (target: >8% on email, >15% on LinkedIn)
> - Cost per meeting (target: <€300 in operate phase)
> - Deliverability metrics (open rate >40%, spam complaint rate <0.1%)
>
> **Qualitative (reviewed monthly):**
> - Sampled output quality (rated Strong/Acceptable/Weak by client-side owner)
> - Voice-locking integrity (does output sound like the client?)
> - ICP fit accuracy (are the prospects actually right-fit?)

---

## Section 9 — Failure modes

Three to five known ways this agent breaks. Each with early-warning sign and mitigation.

**Example:**
> **Failure: Spam classification.** Outbound volume + lack of personalization triggers email provider spam filters. Reply rate drops. Sender reputation damaged.
> *Early warning:* Open rate drops below 30%, spam complaint rate above 0.1%.
> *Mitigation:* Pause volume immediately. Audit sender reputation. Re-warm domain. Increase personalization depth.

---

## Section 10 — Configuration patterns by vertical

How the agent gets tuned for each live vertical. Reference the vertical playbooks in `/verticals/` for fuller context.

**Example:**
> **Slovenian businesses:** Slovenian-language outputs. Cadence includes in-person coffee meeting offers, not just Zoom. Local partnership outreach takes precedence over qualified outbound.
> **Specialty legal:** Outbound restricted to non-conflicted prospects (cross-checked against firm's conflict database). Content emphasises GEO/AEO over outbound. Partnership outreach focused on legal-tech consultants and bar associations.
> **B2B SaaS demand-gen:** Full intent stack. Real-time signal action (within 24h of trigger). Higher outbound volume, tighter response-classification feedback loop.

---

## Section 11 — Voice and output requirements

Voice-locking expectations for this agent's outputs. Output quality bar. Review cadence.

**Example:**
> - 16+ voice samples required before any externally-facing output is enabled (specialty legal: 25–30 samples)
> - Outputs reviewed weekly by client-side owner in operate phase
> - Quarterly voice refresh: re-collect 5 fresh samples to detect drift
> - Any sampled output rated "Weak" triggers immediate prompt-rule tightening before next batch

---

## Section 12 — Memory and learning

What does the agent persist across runs? How does it improve over time?

**Example:**
> Persisted:
> - All sent outbound + classified outcomes (in client CRM + Knowledge Agent index)
> - Signal-to-outcome correlation data (which signal types convert best)
> - Voice samples (Knowledge Agent)
> - ICP refinements over time
>
> Learning loop:
> - Weekly: Acquirer reviews prior 7 days of classified outcomes, updates signal weights
> - Monthly: human owner reviews learned weights, approves or overrides
> - Quarterly: ICP refresh based on best-fit customer retrospective

---

## Section 13 — Cost model

Typical monthly cost (inference + tooling) per engagement. What drives variation.

**Example:**
> **Typical monthly direct cost:** €800–€1,800 per engagement
> - Claude API: €300–€600 (varies with signal volume and first-touch generation count)
> - Enrichment tools (Apollo + Clay): €400–€900
> - Signal monitoring (BuiltWith, Common Room): €100–€300
>
> **Scales with:** outbound volume (linearly with first-touch generation), ICP breadth (sub-linearly), client's existing tooling stack (some tools we can use the client's seat, some require AIS-side seats).

---

## How to use this template

1. Copy the template into a new file at `agents/[agent-name].md`
2. Fill in each section completely
3. Cross-reference vertical playbooks (`/verticals/`) for vertical-specific configurations
4. Have one cofounder review before the agent is deployed in any engagement
5. Update the spec after each engagement — agents evolve as deployments reveal new failure modes and configurations

A spec that skips sections produces deployments that fail. The discipline is to do the work upfront.
