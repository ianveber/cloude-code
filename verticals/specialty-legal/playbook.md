# Vertical Playbook — Specialty Legal

**Subtypes in scope:** Immigration (business and family), estate planning and trust administration, intellectual property (trademark/copyright), boutique litigation support
**Out of scope for this playbook:** BigLaw / AmLaw 200, criminal defense, personal injury (different economics), public interest / nonprofit legal

Last updated: 2026-05-04
Engagements completed in this vertical: 0 (first-run baseline)

---

## The business reality

Boutique legal practices are information-processing businesses with a compliance layer on top. An immigration firm processing 200 active matters is managing 200 parallel workflows, each with its own deadline structure, document checklist, client communication cadence, and government-agency interaction pattern. Most of that coordination work is done by paralegals and legal assistants who are overextended — and by attorneys who are doing admin work that should never touch their hourly rate.

The pain points that matter:

- **Document collection bottleneck:** Clients are slow to return required documents. Cases stall. Deadlines approach. The paralegal's job becomes nagging clients — which is a terrible use of paralegal time and creates bad client experience.
- **Status update calls:** The single most common client complaint in legal is "I don't know what's happening with my case." A large share of inbound calls and emails are status inquiries that could be answered automatically.
- **Form-heavy practice areas:** Immigration (I-485, I-130, I-140, DS-260, N-400, and dozens more), estate planning (revocable trusts, pour-over wills, healthcare directives), IP (USPTO trademark applications, DMCA notices) — these involve long, structured forms where 70–80% of the content comes directly from client intake data. The attorney's value-add is the judgment, not the form-filling.
- **Deadline docketing:** USPTO response deadlines, USCIS receipt notice timelines, court filing deadlines, statute of limitations. Missing a docket deadline can mean malpractice. Most small firms use manual calendar entries and hope nothing falls through.

The decision-maker is the managing partner (often the only partner in a boutique), a practice administrator, or an operations manager at larger boutiques. Attorneys are skeptical by professional training — they are paid to find the flaw in an argument. Your proposal will be scrutinized for overstatements and unqualified claims. Be precise, name the limitations honestly, and do not claim the agent can do anything that requires legal judgment.

**The 2026 adoption reality:** 92% of legal professionals are already using AI tools in their practice — the "should we adopt AI" conversation is over. 81% expect AI to change their business model within 3 years. 62% expect the billable hour to decline as AI commoditizes routine form-preparation and document-assembly work. The practices that build operational AI depth now are positioning for the 44% projected increase in demand for niche legal expertise — the human judgment layer becomes more valuable precisely as the administrative layer gets automated. Discovery should probe where the practice's routine work lives, not whether they're open to AI.

---

## Functional clusters available for automation

Ranked by leverage:

### Cluster 1 — Document Assembly (highest time savings per matter)

**What it is:** The paralegal collects client information through an intake questionnaire, then manually transfers that data into government forms, firm template documents, or filing packages. For an immigration firm, this might mean populating an I-130 petition, a cover letter, a fee transmittal, and a supporting document checklist from a single intake form. The transfer is tedious, error-prone, and takes 2–6 hours per matter depending on complexity.

**What we automate:**
- `docassembly-legal-map`: maps client intake data (from the firm's intake form or practice management system) to the correct fields in the target documents
- `docassembly-legal-generate`: populates the form templates, produces a draft package for attorney review
- `docassembly-legal-checklist`: generates a client-facing document checklist based on the specific matter type and client profile (e.g., "you need an I-94 because you entered on a B-2 visa; you do not need a police certificate because you've never lived outside the US")

**What it does not do:** The agent does not make legal judgments — it does not choose which form to use, decide whether a client qualifies for a benefit, or draft legal arguments. The attorney reviews every output before it leaves the firm. This must be stated explicitly in the spec and in client communications.

**Value framing:** 15 immigration matters/month × 3 hours of paralegal form-filling = 45 paralegal hours/month. At $55/hour loaded cost, that's ~$2,500/month or $30K/year — for one practice area cluster.

### Cluster 2 — Client Status Communications (highest client satisfaction impact)

**What it is:** Clients want to know where their matter stands. Currently: they call or email; the paralegal checks the case management system and responds. This is pure interrupt-driven coordination overhead with no billable value.

**What we automate:**
- `status-legal-update`: monitors the practice management system for matter stage changes (e.g., "petition submitted," "receipt notice received," "RFE issued," "approval received"); sends a templated but personalized status update to the client via email or SMS at each stage change
- `status-legal-inbound`: handles inbound status inquiries via email or SMS with a structured response that either answers from current matter state or routes to the paralegal if the inquiry is outside the scripted scope

**Volume impact:** Reduces inbound status calls by 50–70% based on implementations in comparable workflows. Paralegals report this as the single highest-quality-of-life improvement — eliminating the interruption pattern that makes deep work impossible.

**Compliance note:** Status updates describe procedural progress only — they do not provide legal advice, interpret government decisions, or predict outcomes. Templates must be reviewed and approved by a supervising attorney before deployment. The agent does not deviate from approved templates.

### Cluster 3 — Matter Intake and Conflict Check (highest onboarding leverage)

**What it is:** A new client contacts the firm. Current workflow: intake call with an attorney or paralegal (30–60 min), manual conflict check against the case management system, manual creation of the matter record, generation and delivery of the engagement letter, collection of the retainer. This process takes 2–4 hours of firm time per new matter and often runs over 1–2 days due to scheduling and back-and-forth.

**What we automate:**
- `intake-legal-screen`: structured intake questionnaire delivered via web form or SMS link; collects the information needed for conflict check and matter creation
- `intake-legal-conflict`: queries the practice management system for conflicts (same adverse party, same matter type, flagged clients) and surfaces results to the supervising attorney for review — the attorney makes the conflict determination, the agent surfaces the data
- `intake-legal-onboard`: on attorney go-ahead, creates the matter record, generates the engagement letter from the approved template, delivers it to the client for e-signature, and tracks signature completion

**What it does not do:** The agent does not make the conflict determination — it surfaces data. The attorney decides. This is non-negotiable from a bar compliance standpoint.

**Value framing:** If the firm onboards 8 new matters/month and saves 2.5 hours of paralegal time per intake, that's 20 hours/month. The faster benefit is time-to-engagement: reducing the intake-to-signed-engagement-letter timeline from 3 days to same-day improves client experience and reduces drop-off.

### Cluster 4 — Document Collection Follow-Up (prevents stalled matters)

**What it is:** The paralegal sends a document request to the client. The client doesn't respond. The paralegal follows up manually. This cycle repeats 2–5 times per matter, per document batch. For an immigration practice, a single family-based petition may require 15–30 supporting documents collected across 3–6 months.

**What we automate:**
- `docrequest-legal-track`: monitors the practice management system's document checklist for outstanding items; triggers automated follow-up to the client at defined intervals (day 5, day 12, day 21 from initial request)
- Follow-up messages include a link to a secure upload portal and a specific list of which documents are still outstanding
- Escalates to the paralegal when a client hasn't responded in 21+ days or when a deadline is within 14 days of a missing document

**Compliance note:** Document request messages do not contain legal advice. They do not explain why a document is needed (that's legal advice in some contexts). They reference the document by name and a client-friendly description only.

### Cluster 5 — Deadline Docketing and Alerts (risk management)

**What it is:** Government deadlines (USPTO Office Action response: 3 months extendable to 6; USCIS RFE response: 87 days; court filing deadlines) must be docketed accurately. Missing a USPTO response deadline abandons a trademark. Missing an RFE deadline can result in denial without appeal.

**What we automate:**
- `docket-legal-monitor`: parses incoming correspondence (email, mail scan) for deadline dates; creates calendar entries and matter notes; sends alerts to the responsible attorney and paralegal at 30, 14, and 7 days before the deadline
- `docket-legal-alert`: escalates to the managing partner if a deadline is within 7 days and the responsible attorney hasn't acknowledged it

**Important limitation:** Deadline parsing from unstructured government correspondence is imperfect. The agent flags its confidence level. Any low-confidence deadline extraction must be reviewed by a human before the calendar entry is created. This is stated explicitly in the spec.

---

## Integration map

| Software | Category | Prevalence | Integration method | Notes |
|---|---|---|---|---|
| Clio | Practice management | ~35% of small/mid firms | REST API (well-documented, actively maintained) | Best integration target; Clio has a developer ecosystem |
| MyCase | Practice management | ~15% | REST API | Good coverage |
| Filevine | Practice management | Growing, esp. litigation | REST API | Strong document management integration |
| PracticePanther | Practice management | ~10% | REST API | |
| Smokeball | Practice management | ~8%, strong in property/estate | API available | Better in AU/UK market but growing in US |
| iManage / NetDocuments | Document management | Larger boutiques | REST API | More complex integration; enterprise-focused |
| DocuSign / Adobe Sign | E-signature | Near universal | REST API | Straightforward integration |
| Relativity / Casepoint | Litigation support | Litigation focus | API available | Complex; scope separately |
| USPTO TSDR | Trademark docketing | IP firms | Web scraping / RSS | USPTO does not have a robust public API for trademark status; scraping is common but fragile |
| USCIS Case Status | Immigration tracking | Immigration firms | Web scraping | Same issue — no public API; scraping is standard but can break |

**Integration risk flag:** USPTO and USCIS scraping is an industry-standard workaround, but it's brittle — government site changes break scrapers without notice. When building deadline docketing for these agencies, build in a fallback manual review step and monitor scraper health aggressively.

---

## Compliance considerations

**Attorney-client privilege:** The content of client communications and matter strategy is privileged. Agent logs must not store the substantive content of privileged communications. The agent can log metadata (matter ID, timestamp, message type, stage change) — not content.

**Unauthorized practice of law (UPL):** The agent cannot provide legal advice, interpret legal standards, predict outcomes, or make legal judgments. Every agent output that touches a client must have attorney oversight before delivery. The distinction is clear in the spec and in client-facing communications about the system.

**Bar compliance — client communications:** Model Rules of Professional Conduct (and state equivalents) govern how attorneys communicate with clients. Automated communications must:
- Not be misleading
- Identify that the message is from the firm (not from a government agency)
- Include a mechanism to reach a human if needed
- Be reviewed and approved by a supervising attorney before deployment

**Conflict of interest:** The conflict check agent surfaces data — the attorney makes the determination. The agent spec must state this explicitly. Do not build any logic that automatically clears or declines a conflict check.

**State bar rules vary:** California, New York, Texas, and Florida all have specific rules around client communication, fee disclosure, and technology use. Flag state-specific issues during discovery and, where relevant, direct the client to confirm with their malpractice insurer.

**Before build starts on any legal engagement:**
- [ ] Client confirms which state bar(s) govern their practice
- [ ] Client's supervising attorney has reviewed the scope of agent outputs and confirmed they do not constitute UPL
- [ ] All client communication templates have attorney sign-off before the agent deploys them
- [ ] Log architecture confirmed to exclude privileged content

---

## Pricing guidance

| Cluster | Tier | Price range | Key value anchor |
|---|---|---|---|
| Document assembly (immigration) | Tier 1 | $22K–$35K | Paralegal hours/matter × matter volume |
| Document assembly (estate planning) | Tier 1 | $20K–$32K | Similar — slightly simpler forms |
| Status communications | Tier 1 | $18K–$25K | Inbound call reduction + paralegal time |
| Matter intake + onboarding | Tier 1 | $20K–$30K | Intake hours saved + time-to-engagement |
| Doc assembly + intake (combined) | Tier 1 | $35K–$52K | Combined, reduced integration overhead |
| Full back-office stack | Tier 2 | $70K–$110K | Full matter lifecycle automation |

**Note on IP firms (trademark):** USPTO docketing and trademark application assembly are high-value, but USPTO scraping fragility adds risk. Price in an ongoing monitoring retainer for scraper maintenance. Don't do a one-time build without it — the scraper will break and you'll get a support call.

---

## Discovery questions

**Document assembly:**
- "When a paralegal processes a new matter, how long does it take to prepare the initial filing package?"
- "What percentage of that time is pulling information from the intake form versus actual legal analysis?"
- "Have you had errors in filings due to data transfer mistakes — wrong date, wrong name spelling?"

**Status communications:**
- "How many inbound calls or emails per week are clients asking for a status update?"
- "What does your paralegal say when a client calls to ask where their case is?"
- "Have you ever lost a client because they felt out of the loop?"

**Intake:**
- "Walk me through what happens from the moment a new client inquiry comes in to the moment a signed engagement letter is in hand."
- "What's the typical timeline for that process?"
- "How many potential clients drop off during intake — decide to go elsewhere before they've even signed?"

**Deadline docketing:**
- "How do you currently track USPTO or USCIS deadlines?"
- "Has your firm ever missed a deadline or come close?"
- "When an Office Action or RFE comes in, what's the first thing that happens?"

---

## Common objections and responses

**"We're worried about confidentiality and privilege."**
This is the right concern to have. Here's exactly how we handle it: [describe log architecture, explain that substantive content is not logged, explain that attorney review is built into the workflow at specific points]. We've designed this with the privilege boundary as a first-class constraint, not an afterthought. Your supervising attorney reviews every client-facing template before it goes live.

**"Our clients expect to talk to a person."**
Automated status updates don't prevent clients from reaching a person — they reduce the calls that don't need a person. A client who gets a real-time notification that their receipt notice arrived doesn't need to call to ask if it arrived. When they do call, it's for something that genuinely requires attorney attention — which is a better use of everyone's time.

**"We've tried to automate before and it didn't work."**
Tell me what you tried. (Then listen.) Usually: they tried a generic tool that didn't understand their matter types, required too much configuration, or broke when their workflow changed. We build for your specific matter types and your specific workflow. The difference is vertical depth — we know what an RFE is, what a Notice of Action means, what the response timeline is.

**"Clio / MyCase already has workflow automation built in."**
Practice management workflow tools are trigger-based — if this, then that. They're useful but not intelligent. They don't draft a document from client data, they don't parse a government notice to extract a deadline, they don't prioritize a follow-up sequence based on how close a deadline is. We build on top of your practice management system, not as a replacement for it.

**"What if the AI makes a mistake in a legal document?"**
The agent produces a draft for attorney review — it doesn't file anything autonomously. Every document goes through the same attorney review it would go through today; the difference is the paralegal isn't spending 3 hours on data transfer before the attorney reviews it. If the draft has an error, the attorney catches it in review, just as they would catch a paralegal error today.

---

## Post-engagement playbook update protocol

After every completed legal engagement, the project lead must update this file with:

1. Practice area and cluster built
2. Practice management system integrated — any API surprises
3. Privilege/compliance issues encountered and how they were resolved
4. Actual paralegal hours saved at 60 days post-launch (if measurable)
5. New objections not listed above
6. What we'd scope differently

Append as: `## Engagement log — {client-slug} — {date}`
