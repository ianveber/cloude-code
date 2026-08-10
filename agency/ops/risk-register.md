# Risk Register

Strategic risks to AIS as a business. What could go wrong, how likely, how serious, what we're doing about it, when we'll review next.

Reviewed quarterly. Updated whenever new risks emerge or existing risks shift.

The register is honest. Some risks are real and immediate; some are real and chronic; some are theoretical but worth tracking. Don't soften the assessment to feel better — accurate risk understanding is the basis of good decisions.

---

## Risk severity scoring

| Probability | Definition |
|---|---|
| Low | <20% chance of materializing within 24 months |
| Medium | 20–60% chance within 24 months |
| High | >60% chance within 24 months |

| Impact | Definition |
|---|---|
| Low | Manageable, no strategic pivot required |
| Medium | Significant disruption, strategic adjustment required |
| High | Existential or near-existential — could end the agency or force major restructuring |

| Combined severity | Probability × Impact |
|---|---|
| Critical | High × High; High × Medium; Medium × High |
| Significant | Medium × Medium; Low × High; High × Low |
| Manageable | Low × Medium; Medium × Low; Low × Low |

---

## Regulatory risks

### R1 — EU AI Act compliance burden

**Probability:** High (compliance requirements taking effect through 2026–2027)
**Impact:** Medium
**Combined:** Significant

**Description:** EU AI Act introduces requirements on high-risk AI systems including transparency, human oversight, audit trails, and risk assessment. Some of AIS's deployments — particularly specialty legal intake — may qualify as "high-risk" under the Act's classifications.

**Current mitigation:**
- All deployed agents have named human owners (compliance with human oversight requirements)
- Full audit trails on every agent action (compliance with transparency requirements)
- 30-day onboarding ladder includes risk assessment as part of build phase
- SOW Section 8.2 documents data processing for client review

**Gaps:**
- Formal risk assessment document per deployment not yet templated
- AI Act conformity assessment process not established
- Notified-body engagement procedures not documented

**Owner:** Nejc (legal cofounder)
**Next review:** Quarterly. Specific: Q3 2026 (status of formal AI Act compliance documentation by then).

---

### R2 — GDPR + jurisdictional data residency

**Probability:** Medium
**Impact:** Medium
**Combined:** Significant

**Description:** Client data processed through agent stacks may be subject to GDPR (EU) or sector-specific data residency requirements. Cloud-deployed agents may store or process data in jurisdictions that the client's data isn't supposed to leave.

**Current mitigation:**
- SOW Section 8.2 + Schedule B DPA template
- Cloud deployment patterns favor EU regions (Frankfurt, Dublin) by default
- Knowledge Agent index storage configurable per client requirements

**Gaps:**
- Schedule B DPA template needs Nejc-level legal finalization
- Specific data residency assertions per deployment (where in cloud each agent runs) not always documented
- Sub-processor disclosure (Claude API, hosting providers, etc.) not formalized per client

**Owner:** Nejc + Ian
**Next review:** Q3 2026

---

### R3 — Profession-specific rules (bar advertising, medical, financial)

**Probability:** Medium (varies by vertical)
**Impact:** Medium
**Combined:** Significant

**Description:** Certain verticals (specialty legal, regulated medical practices, regulated financial services) have profession-specific rules about communications, solicitation, claims-making, and AI use. Acquirer Agent outputs and Closer Agent outputs from these deployments could inadvertently violate.

**Current mitigation:**
- Vertical playbooks include compliance notes (`verticals/specialty-legal.md` covers bar rules)
- Closer Agent has jurisdictional rule database for specialty legal
- Voice samples reviewed by sponsoring partner before deployment

**Gaps:**
- Comprehensive jurisdictional rule database for bar advertising rules not yet built (per-jurisdiction lookup needed)
- Medical / financial vertical playbooks don't exist yet (not in current roster) but would need similar compliance infrastructure
- Insurance carrier liaison process not formalized

**Owner:** Lead cofounder per vertical
**Next review:** Q4 2026 (specialty legal compliance review)

---

## Market risks

### R4 — AI commoditization (model differentiation collapses)

**Probability:** High (already happening, accelerating)
**Impact:** Low (we don't differentiate on model)
**Combined:** Manageable

**Description:** Claude / GPT / Gemini commoditize. Anyone can rent reasoning equivalent to ours. Buyers may perceive AI agency value as commoditized accordingly.

**Current mitigation:**
- AIS positioning explicit (per `docs/positioning.md`): we don't differentiate on model. We differentiate on vertical depth, engineering discipline, operator accountability.
- Pricing model rewards execution discipline, not model access (build fee + operate retainer).
- Case studies show outcomes, not model usage.

**Gaps:**
- Buyer education needed: most prospects assume AI agency = AI access; takes work to reframe
- Competitor positioning isn't always this honest; market remains noisy

**Owner:** All cofounders (positioning consistency)
**Next review:** Quarterly

---

### R5 — Vertical competition increasing

**Probability:** Medium
**Impact:** Medium
**Combined:** Significant

**Description:** Other agencies pivot to vertical agent agency model. Competition increases in our chosen verticals. Wins become harder to come by.

**Current mitigation:**
- Vertical selection deliberate (per `verticals/_selection-framework.md`)
- Slovenian businesses vertical has language + local trust moat
- Specialty legal vertical has high switching costs once deployed
- B2B SaaS vertical: pace of innovation matters; we move fast

**Gaps:**
- Don't track vertical-competitor activity systematically
- No formal competitive intelligence process

**Owner:** Lead cofounder per vertical
**Next review:** Quarterly

---

### R6 — AI search engine algorithm changes

**Probability:** High
**Impact:** Medium
**Combined:** Critical

**Description:** Perplexity / Claude / ChatGPT / Gemini change citation algorithms. Content that previously got cited stops getting cited. SoM drops without explanation. Inbound from content channel collapses.

**Current mitigation:**
- Diversified content distribution (not solely dependent on any single AI engine)
- Multi-engine SoM tracking
- Content shape designed to be citation-friendly across engines

**Gaps:**
- Can't influence AI engine algorithm changes
- No formal early-warning system for algorithm shifts (just rely on observation)
- No fallback acquisition channel if content fully fails

**Owner:** Ian (technical brain owns monitoring infrastructure)
**Next review:** Quarterly

---

### R7 — Macroeconomic recession affecting client budgets

**Probability:** Medium
**Impact:** Medium
**Combined:** Significant

**Description:** EU recession, US recession, or sector-specific downturn affects client willingness to spend €25K–€100K on AI agent systems. Pipeline slows. Existing engagements may cancel.

**Current mitigation:**
- Retainer-based revenue model is more recession-resistant than pure-build model
- Multi-vertical exposure spreads sector-specific risk
- Slovenian SMB vertical price point (€18K–€50K) more affordable than international

**Gaps:**
- No formal recession playbook
- Cash position not yet at the level that would buffer a 6+ month slowdown
- Retainer termination is 60-day notice — slowdown could compress revenue quickly

**Owner:** Nejc + cross-cofounder
**Next review:** Quarterly (with attention to macro signals)

---

## Talent risks

### R8 — Cofounder burnout

**Probability:** Medium-High
**Impact:** High
**Combined:** Critical

**Description:** Three cofounders running a high-intensity service business. Build phases are demanding. Acquisition is constant. Personal sustainability is at risk.

**Current mitigation:**
- Cofounder utilization tracked (per `ops/kpi-framework.md`)
- Quarterly cofounder satisfaction check
- Vacation coverage protocols in `ops/runbook.md`
- Plan to hire orchestrator at appropriate scale (per `ops/escape-velocity-targets.md`)

**Gaps:**
- No formal burnout-detection protocol beyond self-reporting
- 3-cofounder structure means one absence shifts significant load to other two
- Slovenian business culture's tendency toward over-work isn't well-counterbalanced

**Owner:** All cofounders (collective responsibility)
**Next review:** Quarterly (with explicit cofounder satisfaction check)

---

### R9 — Cofounder departure

**Probability:** Low (within 24 months)
**Impact:** High
**Combined:** Significant

**Description:** One of the three cofounders leaves AIS (career change, relocation, conflict, life event). Equity structure complications. Operational gaps.

**Current mitigation:**
- Founders' agreement with vesting (per Ian's Obsidian vault — AIS Slovenia decisions log shows vesting under discussion)
- Cross-cofounder visibility on all engagements (no single point of failure on any client)
- Documented operating system (this repo) reduces cofounder-knowledge dependency

**Gaps:**
- Vesting agreement not yet finalized (legal blocker)
- Buy-out terms in case of departure not defined
- Insurance (key-person) not in place

**Owner:** Nejc
**Next review:** Quarterly (until vesting agreement signed); annually thereafter

---

### R10 — Capacity ceiling at 3 cofounders

**Probability:** High (we will hit this)
**Impact:** Medium
**Combined:** Critical

**Description:** Three cofounders can sustainably run ~6–10 active engagements. Beyond that, capacity is the bottleneck for further growth. Hiring becomes necessary; hiring well is hard.

**Current mitigation:**
- Escape-velocity targets project hiring milestones (per `ops/escape-velocity-targets.md`)
- First hire planned for orchestrator role (Q2 2027 target)
- Productized delivery workflow makes hiring easier than ad-hoc work

**Gaps:**
- No identified candidate for first hire yet
- Hiring criteria not yet documented
- Onboarding for first non-cofounder hire not designed
- Compensation model for non-cofounder employees not defined

**Owner:** Nejc + cross-cofounder
**Next review:** Q1 2027 (when first hire becomes imminent)

---

## Technical risks

### R11 — Anthropic/Claude API behavior changes

**Probability:** Medium
**Impact:** Medium-High
**Combined:** Significant

**Description:** Claude API behavior shifts (model updates, capability changes, pricing changes, rate limit changes) affect deployed agent quality, cost, or reliability. AIS engagements may degrade without warning.

**Current mitigation:**
- Multi-model architecture consideration (not yet implemented; could switch to alternative LLM if needed)
- Voice locking samples are model-portable (re-tune across models if needed)
- Pricing pass-through to clients for inference cost variations (per SOW Section 3.3)

**Gaps:**
- No formal multi-model abstraction layer
- Model behavior change detection happens via observation, not active monitoring
- Client communication protocol for API-driven quality changes not defined

**Owner:** Ian
**Next review:** Quarterly

---

### R12 — Vector DB or infrastructure vendor failures

**Probability:** Low-Medium
**Impact:** Medium
**Combined:** Significant

**Description:** A core infrastructure dependency (vector DB provider, hosting provider, key SaaS tool) fails or pivots. AIS deployments depend on the dependency.

**Current mitigation:**
- Vendor selection considers continuity (established providers preferred)
- Per-engagement architecture documented (so re-architecting is possible if needed)
- Knowledge Agent's content is exportable in standard formats

**Gaps:**
- No formal vendor risk assessment per deployment
- Backup vendor identification not formalized
- Migration playbook (e.g. moving from Pinecone to Weaviate) not documented

**Owner:** Ian
**Next review:** Annually

---

### R13 — Voice locking degradation as base models shift

**Probability:** Medium
**Impact:** Medium
**Combined:** Significant

**Description:** Claude (or alternative LLMs) update their base model behavior. Voice locking that worked before stops working as well. Outputs drift from voice samples even with no change on AIS side.

**Current mitigation:**
- Monthly drift detection (per `agents/16-sample-voice-locking.md`)
- Quarterly voice refresh
- Drift-detection threshold tightening planned

**Gaps:**
- Detection happens via observation; no predictive system
- Cross-model voice portability not tested (would matter for model swap)

**Owner:** Ian
**Next review:** Quarterly

---

### R14 — Client-side tool integration breakage

**Probability:** Medium-High (across all engagements)
**Impact:** Low-Medium (per individual engagement)
**Combined:** Manageable per engagement; Significant in aggregate

**Description:** Client-side tool (CRM, PMS, email platform, etc.) changes its API behavior. AIS deployment breaks. Engagement disrupted until fixed.

**Current mitigation:**
- Integration monitoring (per `agents/_template.md` Section 9)
- Documented manual fallback procedures
- Cofounder on-call for integration emergencies

**Gaps:**
- Pre-emptive vendor change notifications not always available
- Cross-engagement vendor change impact analysis not formalized

**Owner:** Ian + lead cofounder per engagement
**Next review:** Quarterly

---

## Operational risks

### R15 — Engagement scope creep eroding margins

**Probability:** High (every engagement at some point)
**Impact:** Low-Medium per engagement
**Combined:** Significant in aggregate

**Description:** Client requests adjacent work; cofounder accommodates; scope expands without re-pricing. Margin collapses silently.

**Current mitigation:**
- Scope-change process defined (SOW Section 2.3)
- Per-engagement P&L tracked monthly
- Cofounder discipline as primary defense

**Gaps:**
- "Small additions" often slip past formal scope-change process
- Cofounder tendency to accommodate erodes discipline over time

**Owner:** Lead cofounder per engagement
**Next review:** Monthly (during engagement P&L review)

---

### R16 — Client churn cascading

**Probability:** Medium
**Impact:** Medium-High
**Combined:** Critical

**Description:** Two-or-more clients churn simultaneously. Cash flow disrupted. Retention metric collapses. Brand affected.

**Current mitigation:**
- Retention Agent surfaces churn signals early (per `agents/retention-agent.md`)
- Cofounder relationship investment per active client
- Diversified client base (across verticals and shapes)

**Gaps:**
- Cohort concentration risk not always tracked (e.g. if 3 clients are specialty legal in same jurisdiction, regulatory shift could affect all)
- No formal "client at risk" intervention protocol

**Owner:** Lead cofounder per engagement; aggregate Anej
**Next review:** Monthly

---

### R17 — Quality issue damaging brand reputation

**Probability:** Low-Medium (over time)
**Impact:** High
**Combined:** Significant

**Description:** A deployed agent produces a harmful, embarrassing, or off-brand output that becomes public. Customer-facing or industry-public failure. Brand reputation damaged. Acquisition affected for months or years.

**Current mitigation:**
- 30-day onboarding ladder catches most quality issues pre-external
- Sampling protocol catches drift in operate phase
- Escalation paths for any complaint to immediate cofounder action
- Per-engagement audit trail allows post-incident investigation

**Gaps:**
- No formal incident communication protocol with affected clients
- No PR plan for incidents that become public
- No insurance specifically for AI-related liability

**Owner:** All cofounders (collective brand responsibility)
**Next review:** Quarterly

---

### R18 — Cash flow gap during build phase

**Probability:** Medium
**Impact:** Medium
**Combined:** Significant

**Description:** Build phase requires cofounder time before second build-fee installment is paid. Multiple parallel builds compound the cash gap. Agency runs out of operating cash.

**Current mitigation:**
- Build fee 50/50 structure provides upfront cash
- Operate retainer paid monthly in advance
- Cash position monitored monthly

**Gaps:**
- Cash reserve target (€140K per `ops/economics.md`) not yet reached
- No working capital facility (line of credit) established
- Cofounder personal financial reserve bridging is not sustainable long-term

**Owner:** Nejc
**Next review:** Monthly

---

## Risk review process

### Quarterly review (~30 min, included in QBR)

1. Walk through register
2. For each risk: status changed since last review?
3. For each risk: mitigation gap closed?
4. New risks to add?
5. Risks to retire (no longer relevant)?

Output: updated risk register. Specific action items captured if needed.

### Triggered review

Outside of quarterly cadence, review the register when:
- A risk materializes (even partially)
- A regulatory change occurs
- A vendor announces a significant change
- A cofounder identifies a new risk

Don't wait for the next quarterly review to update the register when reality has shifted.

### Annual review

During annual offsite:
- Full register walked through
- Severity scoring recalibrated
- Aggregate risk posture discussed
- Insurance, legal protections, and contractual hedges reviewed
- Cofounder agreement implications discussed

---

## What the register is not

- A list of every possible bad thing (only strategic-level risks)
- A complete legal liability catalog (Nejc maintains separate legal review)
- A guarantee of risk mitigation (some risks are accepted, not mitigated)
- A static document (reviewed regularly, updated as reality shifts)
