# Acquirer Agent

Owns top-of-funnel demand generation via **non-paid channels only**: content (GEO/AEO long-form), partnerships, and qualified outbound. Never runs paid media — this is structural (see `docs/principles.md` rule 3).

---

## Function ownership

**Owns:**
- Real-time intent monitoring across defined signal sources
- ICP-filtering and prioritization of signals
- Multi-source enrichment of qualified targets
- Personalized first-touch generation (email + LinkedIn DM + content placement)
- Multi-touch sequencing across 5–8 touches over 4–6 weeks
- Partnership outreach to ecosystem players (referral sources, complementary services)
- Long-form content production in GEAF format for AI-driven search citation

**Does not own:**
- The actual sales conversation (handoff to Closer Agent or human closer)
- Proposal generation (Closer Agent)
- Post-close onboarding (Onboarder Agent)
- **Paid media of any kind** — Google Ads, Meta Ads, programmatic, paid LinkedIn, paid sponsorships in newsletters. If a vertical or engagement needs paid media, AIS refers out to a paid-media partner.

**Hard boundary:** never sends external comms without human approval inside the build phase. Approval can be automated in operate phase only after 30-day ladder completion and only for low-risk message classes (e.g. follow-up touches within an existing sequence, not first-touch new-prospect outreach).

---

## Inputs

- **Intent signals:**
  - Job postings (Greenhouse / Lever / Workday public pages — programmatic scraping with respect for robots.txt and rate limits)
  - Tech-stack changes (BuiltWith API, Wappalyzer)
  - Exec moves (LinkedIn Sales Navigator API where licensed, news APIs as fallback)
  - Funding events (Crunchbase API, news APIs, RSS feeds)
  - G2 / Capterra review activity for client's category (where vertical-relevant)
  - Common Room community signals (for B2B SaaS verticals)
  - Vertical-specific: patent filings (specialty legal), property transactions (Slovenian real estate), regulatory filings (fintech, regulated industries)
- **ICP definition:** structured ICP document maintained by Knowledge Agent. Refreshed quarterly based on best-fit customer retrospective.
- **Voice samples:** 16+ archived samples maintained by Knowledge Agent (25–30 for specialty legal).
- **Sequence triggers:** response classifications from Closer Agent (e.g. "not-now → re-engage in Q3").
- **Content calendar:** rolling 90-day content plan, owned by AIS-side owner with monthly review.

---

## Outputs

- **Daily prioritized signal list:** top 20 ICP-fit prospects, ranked by signal strength + ICP fit. Delivered to client's Slack channel and named human owner via email digest.
- **First-touch drafts:** queued for approval in client's outbound tool (Outreach, Salesloft, Apollo, Instantly). Includes the specific signal reference + personalization hook + call-to-action.
- **Sequenced follow-up touches:** auto-progress after first touch (post-approval in build, automated in operate).
- **Long-form content:** GEAF-formatted articles, posted to client's site, syndicated where relevant. Cadence: 4 articles/month typical (varies by engagement scope).
- **Partnership outreach drafts:** personalized outreach to identified referral-source prospects. Always human-approved before send, regardless of phase.
- **Weekly performance digest:** signal volume, conversion to meeting, content syndication metrics. Delivered to named human owner.
- **Monthly retrospective:** what worked, what didn't, ICP/signal-weight recommendations.

---

## Tools and integrations

**Required:**
- Claude API (or compatible LLM) for generation
- Email sending platform with API (Outreach, Salesloft, Apollo, Instantly, Lemlist, or similar)
- CRM API (Salesforce, HubSpot, Pipedrive, Close, or vertical-specific)
- Apollo or equivalent enrichment + outbound stack
- At least one intent signal source API (typically Apollo + one specialized source per vertical)
- Slack API for daily signal digest delivery
- CMS API for content publishing (WordPress, Webflow, Ghost, or custom)

**Optional but common:**
- Clay (data enrichment automation, scoring layer)
- LinkedIn Sales Navigator API (scoped, respect TOS)
- BuiltWith API (tech-stack monitoring)
- Common Room (community signal aggregation, B2B SaaS)
- Crunchbase API (funding events)
- Schedules and calendar tools (Calendly, Cal.com — usually only for outreach booking link inclusion)

**Forbidden tools (will not integrate with):**
- Google Ads / Meta Ads / TikTok Ads / any paid-media platform APIs
- Programmatic ad platforms (DV360, The Trade Desk)
- Influencer marketplaces (we don't run sponsored content campaigns)

---

## Human owners

**AIS-side owner during build:** Anej Vučič.
- Approves: ICP refinement decisions, voice-lock acceptance, intent signal source weighting, content topic priorities, partnership outreach lists
- Escalates: scope changes that require cofounder consensus, deliverability anomalies, ethical edge cases (e.g. signal data sources of questionable provenance, scraping that approaches TOS limits), requests from client to add paid-media work (always escalates to cofounders for explicit refusal or refer-out)

**Client-side owner during operate:** VP GTM, Head of SDR Ops, founder CEO, or marketing lead — varies by engagement.
- Approves: weekly sampled outputs (one batch of ~10 outbound + one batch of ~5 partnership outreach + one content piece), ICP refinements, partnership additions, content calendar adjustments
- Escalates: cross-team conflicts (e.g. SDR team friction with the deployment), legal/compliance flags, requests for outside-scope work (e.g. "can the agent also build us a webinar funnel?"), client-side personnel changes affecting operator role

---

## Escalation rules

The agent stops and escalates when:

- **First-touch draft confidence score <0.7** → queue for human review, do not auto-send
- **Personalization hook references something the agent isn't sure about** (e.g. ambiguous job posting, unclear exec role) → queue with explicit "ambiguity flag"
- **Reply classified as "complaint," "legal threat," or "unsubscribe request"** → immediate escalation, do not auto-respond
- **Signal source returning anomalous data** (10× expected volume, sudden zero volume, format change) → pause that source and escalate
- **Cross-channel deliverability metric dropping >15% week-over-week** (open rate, reply rate, spam complaint rate) → pause volume, escalate
- **Bot detection trigger** on LinkedIn or other platform (account flagged, captcha appears) → immediate pause, escalate
- **Content topic in restricted-domain territory** (specialty legal: discussing specific named cases; B2B SaaS: making competitor claims; Slovenian: anything touching contentious political/social topics) → human-approval required, agent does not auto-publish

---

## Success metrics

**Quantitative (tracked weekly, reviewed in monthly digest):**

| Metric | Target | Failure threshold |
|---|---|---|
| Signal-to-meeting conversion rate | >2% (operate phase) | <0.5% triggers review |
| First-touch reply rate (email) | >8% | <3% triggers review |
| First-touch reply rate (LinkedIn DM) | >15% | <6% triggers review |
| Cost per meeting (excluding cofounder time) | <€300 in operate phase | >€500 triggers review |
| Email open rate | >40% | <25% triggers deliverability audit |
| Spam complaint rate | <0.1% | >0.3% triggers immediate pause |
| Content syndication (citations / quarter) | >5 per published piece | <1 per piece triggers content review |
| Partnership outreach reply rate | >25% | <10% triggers list-quality review |

**Qualitative (monthly review with client-side owner):**

- Sampled output quality rated Strong / Acceptable / Weak (target: <20% Weak)
- Voice-locking integrity (does output sound like the client?)
- ICP fit accuracy (are the prospects actually right-fit?)
- Content placement quality (which AI search engines / referrers are citing? are they ones we want?)

---

## Failure modes

### Failure 1 — Spam classification cascade

Outbound volume + insufficient personalization + sender-reputation degradation triggers email provider spam filters. Reply rate drops. Domain reputation damaged across all channels, sometimes permanently.

*Early warning:* Open rate drops below 30%, spam complaint rate above 0.1%, bounce rate increasing week-over-week.
*Mitigation:* Pause volume immediately. Audit sender reputation via tools like Sender Score, Talos. Re-warm sending domain (4–6 weeks of gradual volume rebuild). Increase personalization depth on remaining outreach. Consider rotating to secondary sending domain.

### Failure 2 — Signal-to-meeting conversion collapses on a previously-strong signal source

A signal source (e.g. job postings of a certain type) that was previously high-converting suddenly stops converting. Reasons vary: signal got commoditized (everyone else is also acting on it), the market shifted, the signal-to-buyer connection broke (e.g. job postings being made by external recruiters not by internal hiring teams).

*Early warning:* Conversion rate on that signal source drops >50% week-over-week for two consecutive weeks.
*Mitigation:* Pause that signal source. Investigate root cause (manual review of recent outreach). Adjust signal weighting in monthly retrospective. Test alternative signals.

### Failure 3 — Voice locking drifts and client objects

After several weeks of operate phase, the client reviews an output and says "this doesn't sound like us anymore." Voice has drifted because (a) new samples haven't been added quarterly as required, (b) prompt evolution introduced new patterns, or (c) the underlying model shifted (Claude updated, behavior changed).

*Early warning:* Quarterly voice refresh hasn't happened in 4+ months; new sampled outputs scored Weak by client-side owner increasing month-over-month.
*Mitigation:* Trigger emergency voice refresh — collect 5–10 new samples, re-prompt with updated samples, re-run a batch of outputs for client review. Schedule next quarterly refresh on calendar to prevent recurrence.

### Failure 4 — Partnership outreach burns a relationship

Personalized partnership outreach goes wrong — recipient feels stalked, mis-addressed, or insulted. Damages a relationship that could have been valuable. If recipient is high-status, can damage AIS or client reputation more broadly via word-of-mouth.

*Early warning:* Partnership reply rate sharply lower than expected for a given segment; specific complaint received; cofounder gets a "what was this outreach?" message in their personal network.
*Mitigation:* Pause partnership outreach immediately. Audit recent sends. Apologize directly from a cofounder (not from the agent or the client) if needed. Tighten partnership outreach criteria — narrower target list, deeper enrichment, longer human review window.

### Failure 5 — Long-form content gets penalized by AI search engines

GEAF content stops getting cited despite good shape. Reasons: AI search engines' citation rules changed, content quality declined, syndication strategy stopped working, competitive content saturated the topic space.

*Early warning:* Quarterly citation count per published piece declining; specific pieces that performed previously now invisible in Perplexity / Claude / ChatGPT citations.
*Mitigation:* Manual review of recent content. Run citation-tracking tools (Share of Model queries via Knowledge Agent). Adjust GEAF format (test different sectioning, citation density, vocabulary specificity). Consider topic-pivot if topic saturation is the issue.

---

## Configuration patterns by vertical

### Slovenian businesses
- Slovenian-language outputs for all customer-facing copy. English OK for cofounder-internal handoffs.
- Cadence includes in-person coffee meeting offers ("kava sestanek"), not just Zoom.
- Local partnership outreach takes precedence over qualified outbound (the Slovenian network is small and warm; outbound to cold lists is less efficient than warm intros).
- Content publishes on client's site + Mladi Podjetnik / Finance.si syndication where possible.
- Signal sources weighted toward Slovenian-specific (local job board AJPES, Bizi.si business changes, Slovenian news).
- Volume lower than international engagements (the entire reachable market is smaller).

### Specialty legal
- Outbound restricted to non-conflicted prospects (cross-checked against firm's conflict database in real-time before any send).
- Content emphasis: GEO/AEO long-form over outbound. Specialty legal buyers cite content way more than they respond to outbound.
- Partnership outreach focused on legal-tech consultants, bar associations, specialty conferences, referring law firms in adjacent specialties.
- LinkedIn outreach restricted to non-bar-rule-restricted message types (no soliciting in jurisdictions with strict advertising rules — agent has jurisdictional rule database).
- Voice locking at 25–30 samples (legal register is more specific).
- Content topic selection requires partner-level review before agent drafts.

### B2B SaaS demand-gen
- Full intent stack active (job postings + tech-stack + exec moves + funding + G2/community signals).
- Real-time signal action — agent triggers outreach within 24h of signal firing.
- Higher outbound volume (50–150 first-touches/week typical) than other verticals.
- Tighter response-classification feedback loop with Closer Agent (Closer's classifications feed back into Acquirer's signal weighting weekly).
- A/B testing of first-touch variants by sub-segment (managed by Acquirer with monthly review).
- Content emphasis on practitioner-focused long-form (founder CEOs cite specific practical content).

---

## Voice and output requirements

- **Voice-locking threshold:** 16+ archived samples for B2B SaaS and Slovenian. 25–30 for specialty legal (more specific register).
- **Output review cadence (operate phase):**
  - Weekly: 10 outbound samples + 5 partnership outreach samples + 1 content piece reviewed by client-side owner
  - Monthly: full output retrospective with quality scoring
  - Quarterly: voice refresh — 5–10 new samples collected, prompts updated
- **Output quality bar:** target <20% of sampled outputs rated Weak. >20% Weak triggers immediate prompt-rule tightening before next batch.
- **Drift detection:** Knowledge Agent runs monthly automated similarity check between recent outputs and voice samples; flags drift before client notices.

---

## Memory and learning

**Persisted across runs:**
- All sent outbound + classified outcomes (in client CRM + Knowledge Agent index)
- Signal-to-outcome correlation data (which signal types convert best for which sub-segments)
- Voice samples (Knowledge Agent)
- ICP refinements over time
- Content performance data (citations, traffic, conversions traceable to content)

**Learning loops:**
- **Weekly:** Acquirer reviews prior 7 days of classified outcomes, updates signal weights (human-approved)
- **Monthly:** human owner reviews learned weights, approves or overrides; content topic priorities reset based on prior month's performance
- **Quarterly:** ICP refresh based on best-fit customer retrospective; voice refresh; signal source review (add/remove sources)

---

## Cost model

**Typical monthly direct cost per engagement:** €800–€1,800

| Component | Range | Driver |
|---|---|---|
| Claude API (Anthropic) | €300–€700 | Generation volume — first-touches × sequence depth + content production volume |
| Enrichment (Apollo + Clay or equivalent) | €400–€900 | Signal volume + ICP breadth — more signals = more enrichment lookups |
| Signal monitoring (BuiltWith, Common Room, Crunchbase) | €100–€300 | Number of intent sources active |
| Content infrastructure (CMS, syndication tooling) | €50–€100 | Content cadence + syndication channel count |

**Scales with:**
- Outbound volume (linearly with first-touch generation count)
- ICP breadth (sub-linearly — wider ICP means more enrichment cost but per-prospect cost goes down at scale)
- Client's existing tooling stack (some tools we use client's seat at no marginal cost; some require AIS-side seat — itemized at scoping)

**Not in cost model:**
- Cofounder time (tracked separately in engagement P&L)
- Client-side tool seats client already owns (pass-through, no markup)
- One-time tool migrations during build phase (itemized in build fee)
