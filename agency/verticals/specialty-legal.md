# Specialty Legal — Boutique IP, M&A, Immigration, Regulatory Firms

AIS owns the client-intake function — from first inquiry through scoped engagement memo — for boutique specialty legal firms running 50–500 intakes per year.

---

## Why we picked this vertical

**Function-bounded:** Intake is bounded — ~6 sub-steps (capture, qualify, conflict check, scope question routing, partner brief, scoping memo). All encoded. An agent stack can own end-to-end with appropriate human escalation.

**Buyer-authoritative:** Managing partner or senior named-equity partner. Personal P&L stake in firm efficiency. Can sign €30K–€80K without partnership vote in most boutique structures (1–25 lawyer firms).

**Work-encoded:** Intake forms, conflict-of-interest checks, scoping memos, scheduling — all documents and structured decisions. The embodied parts (in-person partner meetings, court appearances, deal-room negotiation) stay with the firm; we only own the encoded intake-and-scoping layer.

**Margin-viable:** Build fee €40K average + operate retainer €7K/mo. Direct costs (cofounder time + inference + occasional contractor) run ~28% of revenue. Contribution margin clears 70%. The senior-partner buyer values reclaimed billable time at €300–€800/hr, so payback math is favourable from the partner's perspective.

The vertical compounds well: published case studies cite specifically (intake-to-scope time, partner hours reclaimed), and boutique legal is a referral-heavy community. One published case study with a named firm produces inbound across the sub-vertical for years.

---

## ICP signals

### Firmographic

- **Location:** EU-based primarily (especially Slovenia, Austria, Germany, Italy, Netherlands, Czech Republic). UK and Ireland acceptable post-Brexit. US firms accepted but require additional jurisdiction-specific scoping.
- **Revenue band:** €1M–€10M annual revenue. Sweet spot €2M–€6M.
- **Employee count:** 3–25 lawyers (plus support staff). Single-lawyer firms are too small; 25+ lawyer firms introduce committee dynamics.
- **Structure:** Boutique. Not affiliated with multi-jurisdiction megafirm. Independent ownership.
- **Specialty:** Specifically focused. Multi-practice general firms fail the bound test. We work with firms whose practice is one of:
  - **IP law** — patent prosecution, IP portfolio management, IP litigation
  - **M&A and corporate transactions** — boutique deal counsel, post-merger integration legal
  - **Immigration law** — corporate immigration, investor visas, family-based immigration
  - **Regulatory law** — financial services regulation, healthcare regulation, antitrust, data protection
  - Acceptable adjacent specialties: tax, employment, real estate development, biotech transactional

### Role

The buyer is a managing partner or named-equity partner. Title varies by jurisdiction (Managing Partner, Senior Partner, Equity Partner). Personal characteristics:

- 8–25 years at the firm
- Personal book of business worth €500K+ annually
- Billing rate €300–€800/hr
- Manages 3–10 other lawyers (associates or junior partners)
- Owns intake conversion as a personal KPI (whether or not it's formally tracked)
- Has been pitched legal AI before (probably by CoCounsel, Harvey, Casetext, or one of the vertical legal-AI startups) — usually rejected because the offer was framed as "AI research tool" not "function owner"

### Function-shape

Current intake operation typically looks like:

- 50–500 inquiries per year (web form, referrals, direct partner contact, BD outreach)
- Inquiries land in a mix of: web form auto-email, individual partner inboxes, Practice Management Software (Clio, MyCase, Practice Panther, or jurisdiction-specific equivalents)
- Conflict check is a manual database lookup, often by a paralegal, often delayed 1–4 days
- Scoping memos drafted by senior associates or partners, taking 1–3 hours each, often delayed 5–14 days from first contact
- Engagement letter generated from a template with manual scope-specific edits
- ~20–40% of inquiries close to engagement (varies by specialty and firm strength)

The function is held together by paralegals, junior associates, and senior partner time. Bottlenecks are conflict check (1–4 days), scoping memo drafting (5–14 days), and follow-up on inquiries that didn't immediately convert (rarely done systematically).

---

## Pain map

### Pain 1 — Conflict checks bottleneck intake

Average 1–4 days from inquiry to conflict-check clearance. Manual database lookup by paralegal. Sometimes requires partner involvement when a borderline conflict needs judgment. Delays first prospect contact past competitor responses. Lost engagements directly attributable to slow intake response.

### Pain 2 — Scoping memos eat senior partner time

Each scoping memo takes 1–3 hours of partner billable-rate time. Much of it is copy-paste from prior engagements with case-specific adjustments. Partner can't bill the time spent on scoping (it's pre-engagement work). At €400/hr average opportunity cost, a firm doing 80 scoping memos per year burns €128K–€384K of partner billable capacity on scoping work that mostly recombines prior memos.

### Pain 3 — Intake form abandonment

Web intake forms have ~50–70% abandonment because they're long, unfriendly, and ask too many questions before the prospect knows whether the firm will even take their matter. Prospects who abandon are lost — no recovery sequence. Most firms can't quantify the loss because they don't track abandoned-form visitors.

### Pain 4 — Lost intake follow-up

Inquiries that don't convert immediately (because of timing, scope misfit, partner unavailability, or just slow firm response) don't get systematic follow-up. Most firms have no documented 30/60/90-day re-engagement process. Prospects go to competitors or solve the problem differently. Lost revenue impossible to measure because nobody tracks it.

### Pain 5 — Cross-jurisdictional intake friction

For firms whose specialty involves multi-jurisdiction matters (cross-border M&A, international IP, immigration with multi-country touch), the intake form often can't capture jurisdictional complexity, forcing manual re-routing and re-questioning. Slow, error-prone, off-putting to sophisticated clients.

---

## Agent stack

Standard specialty legal deployment uses 2–3 agents from the canonical roster.

### Closer Agent (always deployed — the primary function owner)

- Owns the intake-form replacement (a conversational interface that adapts questions to the matter type)
- Runs initial qualifying questions (jurisdiction, urgency, scope range, timeline)
- Wires to conflict-check API (firm's existing database — Clio, MyCase, custom, etc.)
- Routes qualified intakes to the right partner with a structured brief
- Drafts initial scoping memos for partner review (week-4 deployment after voice locking)
- Schedules partner intake calls via partner's calendar API
- Drafts engagement letters using firm templates with scope-specific population
- Manages 30/60/90-day follow-up on inquiries that didn't immediately convert
- **AIS-side owner during build:** Ian Veber
- **Client-side owner during operate:** Intake paralegal or office manager (the operator), with sponsoring partner accountable for final outputs

### Knowledge Agent (always deployed)

- Ingests firm's existing scoping memos (5–10 years of redacted historical memos)
- Ingests firm's standard engagement letter templates and scope variations
- Ingests firm's conflict-check criteria and conflict-resolution patterns
- Ingests jurisdictional rule references the firm uses regularly
- Serves this knowledge to the Closer Agent for memo drafting and scope qualification
- **AIS-side owner during build:** Ian Veber
- **Client-side owner during operate:** Sponsoring partner (the knowledge belongs to the firm)

### Acquirer Agent (sometimes deployed — only if acquisition is also in scope)

- GEO/AEO content on the firm's specialty (e.g. "EU patent strategy for biotech founders launching in 2026," "Cross-border M&A diligence for US-EU deals under €50M")
- Partnership outreach to referring sources (accelerators, IP brokers, immigration consultancies, M&A advisors)
- Qualified outbound to in-house counsel at companies showing relevant signals (new patent applications, recent acquisitions, regulatory filings)
- **AIS-side owner during build:** Anej Vučič
- **Client-side owner during operate:** Marketing lead (if any) or managing partner

We sometimes deploy Acquirer Agent. We always deploy Closer and Knowledge. A "Closer + Knowledge only" engagement is the most common shape for firms whose pipeline is already healthy but whose intake-to-scope process is the bottleneck.

---

## Pricing band

**Build fee:** €25K–€80K
- **€25K–€40K:** 3–10 lawyer firm, 50–150 intakes/year, common PMS (Clio, MyCase), single-jurisdiction or simple multi-jurisdiction (e.g. EU only)
- **€40K–€60K:** 10–20 lawyer firm, 150–300 intakes/year, possibly custom CRM, moderate jurisdictional complexity
- **€60K–€80K:** 15–25 lawyer firm, 300+ intakes/year, complex compliance review process, multi-jurisdictional (e.g. US + EU + APAC), or specialty requiring deep technical knowledge ingestion (e.g. life sciences IP)

**Operate retainer:** €6K–€10K/month
- **€6K–€7K:** smaller firm, lower intake volume, simpler maintenance
- **€7K–€8.5K:** standard
- **€8.5K–€10K:** larger firm, high intake volume, more sampling and tighter monitoring required

**Rationale:** Specialty legal sits at the high-complexity tier (compliance review, conflict-checking, multi-jurisdictional handling possible) and the standard engagement shape (2–3 agents typical). The senior-partner buyer values reclaimed billable time at €300–€800/hr, so a €40K build + 12 months of €7K retainer (€124K total) pays back from partner time alone inside 18 months at most firm sizes, faster at high-volume firms.

Contribution margin target: 65–72%.

---

## Discovery script

Run in English by default. Confirm with the partner — some EU specialty firms prefer the discovery conversation in their native language (German, Italian, Dutch). Voice-of-firm subsequent material is in whatever language the firm uses for client comms.

### Must-pass questions

1. **"Who at the firm signs off on engagements in the €40K–€80K range?"** Pass: the partner on the call, or one other named partner reachable in a week. Fail: management committee, RFP, "we'll need to think about it as a partnership."

2. **"After deployment, who would be the named internal operator of the intake system?"** Pass: a specific named person (paralegal, office manager, intake coordinator). Fail: "we'll figure it out" or "the partner."

3. **"Who would be the named partner sponsor — accountable for final review and policy decisions?"** Pass: the partner on the call. Fail: someone not on the call yet, or "the partnership collectively."

4. **"Are you OK with us running a 30-day onboarding ladder before external deployment?"** Pass: yes. Fail: "we need it live for the next big client immediately."

5. **"Is your conflict-check database API-accessible, or could it be made so?"** Pass: yes (or yes-with-some-work — e.g. PMS-vendor support call required). Fail: paper-only conflict database, or "I don't know what an API is."

6. **"What's the firm's policy on cloud-deployed AI handling client matters?"** Pass: cloud-OK with appropriate security review. Fail: on-prem only.

### Sizing questions

7. **"Roughly how many intake inquiries per year does the firm currently process?"**
8. **"What's the current bottleneck — getting more inquiries, qualifying them faster, or scoping them faster?"**
9. **"What's your current PMS / intake tooling stack?"**
10. **"Average billable rate across the partnership?"**

### Risk-detection questions

11. **"Who on staff would feel threatened by an agent-driven intake system? Paralegals? Junior associates?"**
12. **"Has the firm tried legal AI before (CoCounsel, Harvey, Casetext, Lex Machina, etc.)? What happened?"**
13. **"Are there client-side data privacy or confidentiality requirements specific to your specialty?"** (e.g. M&A engagements with public-company clients, immigration matters with HIPAA-adjacent medical records, IP with trade-secret-laden disclosures)
14. **"What's your firm's policy on conflict-of-interest resolution when a borderline case comes up — partner judgment, partnership vote, or external counsel?"**

---

## Proposal anchor

The anchor framing for every specialty legal proposal:

> **"Cut average intake-to-scoped-memo time from [current] to under 48 hours, freeing [X] hours/week of partner billable time, with full audit trail and compliance-review checkpoints on every output."**

### Math (typical mid-sized firm)

Current state:
- 80 scoping memos per year
- 2 partner-hours per memo at €400/hr = €64K/year of partner time on scoping
- Average 9-day delay intake-to-scoped-memo
- Estimated 5–10% of inquiries lost to delay (€50K–€150K/year in lost engagements at €5K-€25K average engagement size)

Post-deployment state:
- 80 scoping memos drafted by Closer Agent + Knowledge Agent stack
- 0.25 partner-hours per memo (review-and-approve) at €400/hr = €8K/year
- Average 30-hour delay intake-to-scoped-memo
- Estimated 5% of inquiries lost to delay (€25K–€75K/year)

Partner time reclaimed: 140 hours/year (€56K at billable opportunity cost)
Lost-inquiry revenue recovered: €25K–€75K/year

Build fee €40K + 12 months operate retainer €84K = €124K total year-1 investment.
Year-1 payback: €81K–€131K (partner time + lost revenue), reaching neutral in 14–18 months.
Year-2 onwards: only operate retainer (€84K), pure return.

---

## Failure modes

### Failure 1 — Partner sponsorship evaporates after build phase

Partner signed the engagement, attended the kickoff, then disappeared after build phase started. Junior staff handled the rest of the engagement and lacked authority to make onboarding-ladder decisions. Agents drifted, voice locking incomplete, deployment delayed indefinitely.

*Early warning:* Partner cancels week-2 review meeting. Or week-2 review happens but the partner is distracted. Pause and escalate to a partner-only conversation. Be explicit: "We can't continue without your active sponsorship; here's what we need from you each week."

### Failure 2 — Compliance review owner missing

Agent-drafted scoping memos and conflict-check escalations need lawyer review before going to clients. If no one owns that review function, week-4 ladder step gets stuck (we can't responsibly deploy externally) or skipped (compliance risk).

*Early warning:* "Who reviews agent outputs before they go to clients?" answered with vague hand-waving in week 2. Or the named compliance reviewer doesn't show up for scheduled review windows. Escalate to partner and either get a named, calendared reviewer or pause external deployment.

### Failure 3 — Conflict-check database integration breaks unexpectedly

Firm's PMS vendor changes API behavior, or the conflict database has unexpected schema. Closer Agent fails to surface borderline conflicts. Misdirected intake. Real risk: a conflicted matter advances past intake.

*Early warning:* Conflict-check API returns unexpected responses in testing. Test thoroughly during build phase with intentional edge-case lookups. Have a fallback: any borderline case escalates to paralegal manually.

### Failure 4 — Voice locking fails on legal register

Legal writing has specific register requirements that vary by jurisdiction and sub-specialty. Generic AI output reads as non-lawyerly to a sophisticated buyer. If voice samples don't sufficiently cover the firm's specific writing patterns, drafted memos sound off — and a partner who has spent 15 years building a reputation for clear writing rejects the system.

*Early warning:* In week 2 draft mode, partner reviews and says "this doesn't sound like us" or "this reads like a chatbot." Collect more samples (target 25–30 for legal — higher than the standard 16 because the register is more specific), iterate.

### Failure 5 — Client of the firm objects to AI-handled intake

A sophisticated client (e.g. a Fortune 500 GC) explicitly states they don't want AI handling their intake. Firm panics, considers killing the engagement. Recoverable if anticipated.

*Early warning:* During scoping, ask the firm: "Have any of your clients expressed views on AI use in legal services?" If yes, scope the engagement to include a human-routing override for named clients who request it. Document this in the engagement charter so the firm can offer it as a feature ("AI-assisted intake with full human-routing available on request") rather than fight it.

---

## Kill criteria

Walk away from a specialty legal prospect when:

- Prospect insists on on-premises deployment (we don't do on-prem; pricing model breaks)
- Prospect's firm structure requires partnership vote on engagements (committee buyer = decline)
- Prospect's specialty is general practice or multi-practice (fails the bound test)
- Prospect's specialty involves jurisdictions we can't safely scope (e.g. heavy China practice without internal China expertise)
- Prospect treats AI as research tool ("we just want help researching cases") — wrong category, refer to CoCounsel, Harvey, or Casetext
- Prospect's revenue is below €1M (price band doesn't fit)
- Prospect has prior negative AI deployment experience and starts the conversation defensive about every term — sometimes recoverable, sometimes not; if a 30-minute reset call doesn't shift the tone, decline
- Sponsoring partner can't get to the first scoping call (signals soft sponsorship; high failure-mode risk)
- Prospect requires unusual confidentiality patterns we can't deliver (e.g. air-gapped local AI inference with no logging — refer out)

---

## Acquirer Agent specifics

### Where buyers hang out

- **LinkedIn** — specialty-specific groups (e.g. EU Patent Lawyers, M&A Lawyers EU, AILA for immigration)
- **Specialty bar associations** — INTA for IP, AILA for immigration, ABA M&A subcommittee, jurisdiction-specific bars
- **Legal-tech podcasts** — Lawyer Forward, The Geek in Review, Above the Law's podcasts
- **Practice management conferences** — ALA Annual, ILTACON, Clio Cloud Conference, MyCase conferences
- **Specialty CLE programs** — continuing legal education on intake, BD, practice management
- **Local jurisdictional events** — Slovenian Bar Association events for SI firms, IBA regional conferences

### Cited content shapes

- Long-form practice-management articles (e.g. "How boutique IP firms automate conflict checking in 2026")
- Specific-specialty case studies (anonymized OK)
- Comparison articles between manual intake and agent-driven intake (vendor-neutral, evidence-led)
- Partner-as-author bylines (we ghostwrite, partner publishes) — high credibility, strong syndication
- Jurisdictional regulatory updates with practice implications (e.g. "What the EU AI Act means for legal-AI deployment in client matters")

### Partnerships worth building

- **Legal-tech consultants** — specialists in PMS implementation, change management. Strong referral relationships.
- **Practice management vendors** (Clio, MyCase, Practice Panther) — integration partnerships, listed-partner programs
- **Specialty CLE providers** — speaker placements for cofounders at relevant programs
- **Bar association BD committees** — speaker placements, panel participation
- **Legal-design / legal-ops consultancies** — adjacent, complementary, refer-friendly

### Avoid

- Generic legal-marketing agencies (push paid search and SEO; awkward partnership)
- Direct competitors (legal-AI vendors who position as "AI tools" — we're a different category, but the brand association is muddied)

---

## Case study angle

### Headline metric

> **"Specialty [IP/M&A/Immigration/Regulatory] firm cut intake-to-scope time by [80%+] in 14 weeks, reclaiming [120+] hours/year of partner billable time."**

### Story structure

1. **Firm context** — size, jurisdiction, specialty, current intake volume (anonymized as needed; we'll often need to anonymize firm name but keep specifics)
2. **Pain** — partner time bottleneck, intake form abandonment rate, specific quote from sponsoring partner
3. **Deployment** — Closer + Knowledge agents, 10–14 week build phase, jurisdictional considerations
4. **Onboarding ladder execution** — week-by-week with sample outputs (redacted where needed)
5. **Outcomes** — intake-to-scope time delta, partner time reclaimed, change in lost-inquiry rate, change in engagement letter close rate
6. **What didn't work** — honest. A voice-locking iteration that took longer than expected. An integration that required a vendor support call. A first-month edge case the agent didn't handle well and how we tightened the rules.
7. **Compliance / confidentiality discussion** — how we structured cloud deployment with appropriate audit trail; how the firm's clients were notified (or not) of AI use in intake.

---

## Vertical-specific knowledge requirements

### Must-know

- Conflict-of-interest rules in EU jurisdictions (especially Slovenia, Germany, Austria, Italy) and US (Model Rules of Professional Conduct, especially Rule 1.7 and 1.9) — at a level adequate for designing conflict-check logic, NOT for giving legal advice
- Engagement letter structures by specialty (IP engagement letters differ from M&A engagement letters in material ways)
- Major specialty bar association structures (which partners we sell to belong to which)
- Practice management software (Clio, MyCase, Practice Panther, jurisdictional equivalents like LEAP, NetDocuments) — demo familiarity at minimum
- EU AI Act implications for legal-AI deployment (especially provisions on high-risk systems and human oversight)
- GDPR + Slovenian / EU data protection requirements for legal client data
- Privilege and confidentiality concepts (attorney-client privilege, work product, advokatska skrivnost) at conceptual level

### Nice-to-have

- Familiarity with major case databases (Westlaw, LexisNexis, Beck-Online for German law) for understanding the firm's broader tech stack
- Awareness of CoCounsel, Harvey, Casetext, Lex Machina, Kira, and other legal-AI competitors — what they do, where we differ
- Knowledge of jurisdictional regulatory bodies that affect data residency for client matters (especially relevant for cross-border M&A)
- Familiarity with insurance carrier requirements for firms (some E&O carriers have specific AI-use clauses)

### Partnership for

- Detailed jurisdictional regulatory advice (we don't give legal advice; partner with a legal-tech consultancy or the client's own ethics counsel if a deployment question touches professional responsibility rules)
- Privilege and confidentiality assessment for cloud deployment (have a legal-tech security consultant on call who can validate our deployment architecture against the firm's specific requirements)
- Bar-specific advertising / marketing compliance review (Acquirer Agent outputs that name attorneys or claim outcomes need jurisdictional advertising-rule review)
- Insurance carrier liaison (some E&O carriers want a written description of AI use in client matters — partner with a legal insurance broker if the client requires this)
