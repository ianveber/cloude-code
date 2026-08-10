# AIS Acquisition System

How AIS acquires its own clients. The dogfood deployment of the Acquirer Agent + cofounder time. AIS sells to itself first — every agent we deploy to clients runs internally for AIS first, so we know how it behaves before clients depend on it.

This document covers the AIS-specific configuration. The canonical Acquirer Agent spec lives at `agents/acquirer-agent.md`; this file describes how we configure it for ourselves.

---

## AIS's own ICP

We sell to verticals we've drafted playbooks for (per `verticals/`). Within those, the prospect ICP:

### Specialty legal
- EU-based boutique firms (Slovenia, DACH, Italy, Netherlands, UK, Ireland)
- €1M–€10M annual firm revenue, 3–25 lawyers
- Specialty: IP, M&A, immigration, regulatory
- Buyer: managing partner or named-equity partner with personal P&L stake
- Trigger signals: recent practice expansion (new lawyer hires), recent client growth (firm in growth phase signals investment readiness), partner publication or speaking activity (signals investment in firm visibility)

### B2B SaaS demand-gen
- €1M–€10M ARR mid-market SaaS
- Sales-led or hybrid PLG+sales motion
- Geographic concentration: SI + DACH + Nordics first, US selective
- Buyer: founder CEO or CRO/VP GTM
- Trigger signals: hiring SDR/BDR role (active demand-gen hiring), recent funding round (capital available for systems investment), exec move into CRO role (new exec evaluating GTM stack)

### Slovenian businesses
- €1M–€20M annual revenue, owner-operated, 5–80 employees, 5+ years operating
- Sub-sectors: aesthetic medicine, dental, accounting, real estate, construction, hospitality, specialty B2B services, specialty manufacturing
- Buyer: owner-operator (lastnik)
- Trigger signals: owner-operator publicly discussing growth bottleneck, business expansion (new location, new product line), staff hire that suggests scaling phase

### Hard exclusions (we don't pursue)
- Enterprise (>€10M ARR — committee buyers)
- Pre-PMF startups (can't afford us, pivot too often)
- Companies looking for paid-media management
- Companies wanting "AI strategy consulting"
- Geographies outside our reach without partner network

---

## Channel mix

Three channels. Cofounder time allocation per quarter.

### 1. Content (Acquirer Agent runs)

**Target:** 4 long-form articles per month (per `sales/content-system.md`).

Topics rotated across the three verticals + AI-native operating thought leadership. Topics chosen for AI-search citation likelihood, not for traffic volume.

**Cofounder time:** ~3 hours/month total (review + approve)
**Agent time:** primary production (drafting, GEAF formatting, syndication queueing)

### 2. Qualified outbound (Acquirer Agent + cofounder review)

**Target:** 20–50 first-touches per month across all three verticals.

Quality over volume. Each first-touch is hyper-personalized against a specific intent signal. Cofounder approves every first-touch in build phase; automation expands as the system proves itself.

**Cofounder time:** ~6 hours/month (review approvals, handle replies)
**Agent time:** primary execution (signal monitoring, enrichment, drafting, sequencing)

### 3. Partnerships (cofounder-led)

**Target:** 1 new partnership conversation per cofounder per quarter; ongoing maintenance of existing partners.

Partnerships are relationship work — Acquirer Agent assists (identifies prospects, drafts initial outreach) but cofounder owns the conversation.

**Cofounder time:** ~8 hours/month across all three cofounders
**Agent time:** identification + initial outreach drafting + reciprocity tracking

### Channel split (total cofounder time)

| Channel | Cofounder hours/month |
|---|---|
| Content review | 3 |
| Outbound approval + reply handling | 6 |
| Partnership work | 8 |
| **Total** | **~17 hours/month across all 3 cofounders** |

That's ~6 hours per cofounder per month dedicated to acquisition — modest, sustainable, leveraged by the Acquirer Agent doing the volume work.

---

## Cadence

### Weekly

- **Monday:** Acquirer Agent delivers Week's signal digest to cofounder Slack
- **Tuesday:** lead cofounder reviews + approves outbound queue for the week
- **Wednesday–Thursday:** outbound sends throughout the week, scheduled by Acquirer
- **Throughout the week:** cofounders handle replies (Closer Agent classifies, routes to right cofounder)
- **Friday:** weekly acquisition digest — what shipped, what's queued, what replied

### Monthly

- **First Monday:** cross-cofounder acquisition review (30 min) — pipeline health, channel performance, pivots needed
- **Second Monday:** content topic selection for the month (which 4 articles, what verticals)
- **Throughout month:** publish 4 long-form articles, run outbound to target, ongoing partnership work
- **Last Friday:** monthly acquisition retrospective + planning for next month

### Quarterly

- **First week:** quarterly review — ICP refresh, channel performance retrospective, voice sample refresh, partnership review
- **Throughout quarter:** consistent execution of weekly + monthly rhythm

---

## Cofounder time vs agent time split

The principle: cofounders own judgment, relationships, and approval. The Acquirer Agent owns identification, drafting, and execution.

### Cofounder owns

- Final approval on first-touch outbound (in build phase; selectively automated in operate)
- All reply handling that goes past initial classification
- Partnership conversations (every one)
- Content topic selection (monthly)
- Voice approval on content (sampled monthly)
- Discovery calls (when inbound qualifies)

### Acquirer Agent owns

- Signal monitoring (24/7 across configured sources)
- ICP-fit scoring of identified prospects
- Multi-source enrichment
- First-touch drafting (queued for cofounder approval)
- Multi-touch sequencing
- Reply classification (first pass)
- Content drafting (4 articles/month, queued for cofounder approval)
- Content syndication queueing
- Partnership outreach drafting (queued for cofounder approval)
- Performance tracking and weekly digest delivery

### Builder workflow (internal, not deployed to clients) owns

- Generating engagement-specific scoping artifacts from inbound qualified prospects
- Drafting initial proposal content (cofounder finalizes)
- Maintaining the internal AIS engagement folder structure

---

## Target inbound rate

Target as of Q3 2026 (system fully operational):

- **Qualified inbound conversations per month:** 8–12
- **Discovery calls held per month:** 6–10 (some inbound disqualifies pre-discovery)
- **Advance to scoping:** 3–5
- **Signed engagements:** 1–2

Annual run rate at target: 12–24 signed engagements per year.

Mix expectation: 60% from outbound + replies, 25% from inbound (content + partnerships), 15% from direct referrals from existing clients.

### Pipeline math (at target)

Build fee average across mixed verticals: ~€45K
Operate retainer average: ~€7K/month
Average engagement lifetime: 18 months (conservative)

Per-engagement revenue: €45K + (€7K × 18) = €171K
At 12 signed engagements/year: €2.05M annual run rate
At 24 signed engagements/year: €4.1M annual run rate

Target Q4 2026 (in formation phase): 4–6 engagements signed in the year. Run-rate target is Q4 2027.

---

## AIS as its own first case study

We sell vertical agent agency services. Our own acquisition is run by a vertical agent agency stack. The dogfood case study writes itself — and we should write it formally.

### What we publish (the AIS case study)

- The Acquirer Agent's signal-to-meeting conversion rate for AIS's own pipeline
- Content production cadence (4 articles/month with X% citation rate within 90 days)
- Cofounder time-per-engagement in acquisition (hours, leverage ratio vs equivalent agency)
- Per-vertical performance breakdown
- Voice locking effectiveness on AIS-internal content (drift detection numbers, sampling ratings)

### When to publish

- First version: 90 days after Acquirer Agent enters operate phase for AIS (target: end of Q3 2026)
- Updates: quarterly with rolling 90-day metrics
- Annual version: full-year retrospective at end of each calendar year

### Where to publish

- AIS's own site (primary)
- LinkedIn (cofounder posts, content syndication)
- Selected guest publications (Mladi Podjetnik / Slovenian business press, B2B SaaS founder communities, legal-tech publications)
- Direct send to high-fit inbound prospects ("here's how we run our own")

---

## Failure modes for AIS-internal acquisition

### Failure 1 — Acquirer Agent doesn't get cofounder approval cycles

Acquirer drafts outbound; cofounder approval queue piles up; nothing sends. Acquisition stalls because of cofounder bandwidth.

*Early warning:* outbound approval queue > 30 items pending; oldest item >5 days old.
*Mitigation:* cofounder allocates dedicated Tuesday morning time for approval (calendared, protected). If even that doesn't clear the queue, tighten Acquirer Agent's quality filter (less volume, higher signal threshold).

### Failure 2 — Content production lapses

Articles don't ship because no one approves topic selection, or cofounder doesn't approve the draft. Content cadence drops from 4/month to 1/month. Citation rate decays.

*Early warning:* zero articles shipped in a 2-week window.
*Mitigation:* simplify topic selection process (cofounder picks from Acquirer's 5 suggested topics rather than greenfield brainstorm). Smaller cofounder commitment to approval ("read this in 15 min and approve or comment").

### Failure 3 — Voice drifts on AIS-internal outputs

Sampled outputs increasingly read "agency-typical" rather than "AIS-specific." Our own dog food becomes the failure mode we sold against.

*Early warning:* sampled content scored Weak by reviewer cofounder; "this sounds like every other AI agency blog post."
*Mitigation:* quarterly voice refresh per `agents/16-sample-voice-locking.md`. Each cofounder contributes 3–5 new voice samples per quarter.

### Failure 4 — Inbound spike that AIS can't service

Marketing/content campaign succeeds beyond expectation; inbound exceeds discovery-call capacity. Prospects get slow responses; conversation rate drops; the spike is wasted.

*Early warning:* discovery-call calendar booked >2 weeks out.
*Mitigation:* temporarily tighten inbound qualifying (more must-pass gates before scheduling discovery), schedule additional discovery slots, accelerate cofounder discovery-call capacity by streamlining post-call note-writing.

### Failure 5 — Partnership pipeline goes cold

Partnership relationships need maintenance (quarterly check-ins, mutual support, reciprocity). If neglected, referral flow drops to zero in 6–9 months.

*Early warning:* monthly partner check-ins skipped for 2+ consecutive months; no new referrals from established partners in 90 days.
*Mitigation:* explicit partner-relationship calendar; each cofounder owns 3–5 partner relationships with quarterly named check-ins.

---

## Stack used internally (AIS's own deployment)

### Acquirer Agent
- Signal sources: LinkedIn (Sales Navigator API for SI/DACH/Nordics), Crunchbase (funding events for B2B SaaS targets), legal-vertical signal sources (Lex Machina for IP firm signals, news APIs for M&A activity), Slovenian business signals (Bizi.si changes, Mladi Podjetnik content engagement)
- Outbound infrastructure: dedicated AIS sending domain, properly authenticated (SPF/DKIM/DMARC), warmed monthly
- Enrichment: Apollo + Clay (modest seat allocation since volume is low)
- Content publishing: AIS site (Next.js + MDX), syndication to LinkedIn, mirrored on Mladi Podjetnik for Slovenian content

### Closer Agent
- Inbound classification (replies, web form submissions)
- Routing to right cofounder per vertical
- Scheduling via Cal.com integration
- Pre-call brief generation

### Knowledge Agent
- AIS's own institutional knowledge: vertical playbooks (from `verticals/`), agent specs (from `agents/`), prior outbound + content performance data
- Voice samples: cofounder writings (this repo, founder blog posts, founder LinkedIn content, founder talks transcribed)
- 3 voice profiles (one per cofounder) + AIS-collective voice for unattributed content

### Retention Agent
- Tracks existing AIS client health (per `agents/retention-agent.md`)
- Surfaces expansion signals
- Manages renewal calendar

---

## Monthly review process

First Monday of each month, ~30 min internal meeting. All three cofounders.

### Agenda

1. **Performance review (10 min)**
   - Outbound sent vs target
   - Reply rates
   - Content published vs target
   - Citations / inbound conversations
   - Partnerships activity
2. **Pipeline review (10 min)**
   - Discovery calls held
   - Advanced to scoping
   - Signed engagements
   - Pipeline health by vertical
3. **Tactical adjustments (10 min)**
   - Channel mix shifts if any channel is under/over-performing
   - Content topic priorities for next month
   - Partnership outreach priorities for next month

### Output

Action items captured in `/agency/sales/monthly-retros/YYYY-MM.md` (one file per month) for retrospective review and trend tracking.

---

## Quarterly review process

First Friday of each quarter, ~90 min internal meeting. All three cofounders + ~30 min prep each.

### Agenda

1. **Quarterly retrospective (30 min)**
   - Performance vs targets
   - Channel performance retrospective
   - Vertical-by-vertical performance
2. **ICP refresh (15 min)**
   - Have any signals proven more/less valuable than expected?
   - Have any sub-segments emerged as best-fit?
   - Any segments to drop?
3. **Voice refresh (15 min)**
   - Each cofounder commits 3–5 new voice samples for next quarter
   - Discussion of any voice drift observed
4. **Partnership review (15 min)**
   - Existing partners: state of relationship, referrals delivered, reciprocity owed
   - New partner targets for the quarter
5. **Forward look (15 min)**
   - Next quarter targets
   - Major themes / experiments
   - Resource allocation discussion

### Output

Quarterly review document in `/agency/sales/quarterly-retros/QXYYYY.md`. Updates the AIS ICP definition, voice sample index, and partnership tracker.
