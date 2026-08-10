# B2B SaaS Demand-Gen — AIS Slovenia

AIS owns the demand-gen function — from real-time intent monitoring through qualified-meeting handoff — for B2B SaaS companies at €1M–€10M ARR.

---

## Why we picked this vertical

**Function-bounded:** Demand-gen is bounded — intent monitoring, enrichment, sequencing, response handling, meeting handoff. ~5 sub-functions, all encoded. An agent stack can own end-to-end with named human escalation for outliers.

**Buyer-authoritative:** Founder CEO or CRO/VP of GTM at a sub-€10M ARR SaaS. Can make €40K–€60K decisions in 1–3 conversations. Above €10M ARR, the decision migrates into committee dynamics and we lose authority — that's the upper bound of our ICP.

**Work-encoded:** ICP definition, signal monitoring, enrichment, first-touch drafting, response classification, meeting scheduling — all encoded. The embodied parts (the actual sales conversation) stay with the client's AE team.

**Margin-viable:** Build fee €40K average + operate retainer €7K/mo. Direct costs ~32% (slightly higher than other verticals because data enrichment costs are real — Clay, Apollo, Common Room API costs run €500–€1500/mo per engagement). Contribution margin 60–68%. Acceptable.

The vertical pairs well with AIS's existing strengths (lead-gen agents, Claude automations) and pairs poorly with AIS's anti-strengths (no paid-media work — we don't do the demand-capture motion, only the demand-generation motion). Discipline: stay in the demand-gen lane.

---

## ICP signals

### Firmographic

- **Stage:** Mid-market SaaS at €1M–€10M ARR. Sweet spot €2M–€6M. Past PMF (won't pivot every 3 months). Not yet enterprise scale (no procurement committees yet).
- **Geography:** Europe and US. Slovenian + DACH + Nordic geographic concentration preferred first (closer to home, smaller buyer pool means our network helps).
- **Team:** 15–60 employees. Sales team of 3–15 (CRO/VP Sales + 2–10 AEs + 1–5 SDRs/BDRs).
- **GTM motion:** Sales-led or product-led-with-sales-assist. We do NOT take pure product-led-growth companies — the function we own doesn't exist in that motion.
- **Existing demand-gen function:** Already has SDR/BDR team (even if small). Already invests in pipeline generation. Not a "we'll start outbound next year" company — too early-stage to value our system.

### Role

The buyer is the **founder CEO** (if smaller) or the **CRO / VP GTM** (if slightly larger). Either has decision authority and personal P&L stake in pipeline efficiency. Personal characteristics:

- **Founder CEO buyer:** Owns sales + GTM personally because the company hasn't hired a VP yet, or hires VP recently and is still de facto pipeline owner. Knows the pipeline weekly. Pays out of company funds without board approval up to a certain threshold (typically €50K–€100K). Has tried multiple demand-gen approaches and is exhausted by churn through tooling.
- **CRO / VP GTM buyer:** Owns sales team and pipeline KPIs. Has hired SDRs and watched the model break — outbound performance degrades as the team scales. Wants a system that doesn't require hiring more humans. Has board pressure to deliver pipeline efficiency improvements.

Both have been pitched "AI for sales" before — usually by Apollo, Clay-with-integration-services, or Outreach with AI features. Usually disappointed because the previous offers were "tools you operate yourself" not "function we own for you."

### Function-shape

Typical current demand-gen operation:

- 1–5 SDRs/BDRs running outbound (each generating 5–15 meetings/month)
- 2–10 AEs taking inbound + SDR-sourced meetings
- Pipeline-generation tools: Apollo, Clay, ZoomInfo, Common Room, Outreach, Salesloft (in some combination)
- Intent signal sources: G2, BuiltWith, LinkedIn, news, funding announcements — manually monitored or piped into Slack with no follow-through
- Average SDR generates 5–10 meetings/month at €100K–€140K fully loaded cost
- CRO/VP knows the math: each meeting costs €1K–€2K in SDR time + tooling
- Bottleneck is one of: SDR scale (can't afford to hire more), SDR quality (junior reps generate low-quality meetings), or signal-to-noise (intent signals exist but no one acts on them in real time)

---

## Pain map

### Pain 1 — Pipeline cost scales linearly with headcount

Each marginal meeting requires marginal SDR hours. Hiring more SDRs costs €100K+ each, takes 3 months to ramp, and the next hire is increasingly junior (talent pool thins). At some point the math doesn't pencil — but the pipeline number must still go up.

### Pain 2 — Intent signals exist but no one acts on them in real time

Job postings appear, tech-stack changes happen, exec moves announced on LinkedIn, funding rounds get announced — all of these signal a buying window. Current ops: signals land in Slack channels, nobody acts within the 24–48 hour window when the signal is hot, signal goes cold, opportunity lost.

### Pain 3 — Personalization at volume is impossible with humans

Best-converting outbound is hyper-personalized — built from a real understanding of the prospect's company, role, recent activity, and likely pain. Doing this manually takes 15+ minutes per prospect. SDRs can either personalize 30 emails/week (slow, expensive) or template 300 emails/week (low conversion). The middle doesn't exist with humans.

### Pain 4 — Response classification eats AE time

When prospects reply, responses need to be triaged: "yes interested book a meeting," "wrong person try someone else," "not now check back in Q3," "unsubscribe," "wrong company structure." Currently AEs (or senior SDRs) classify and route manually. ~15-20 minutes per response when batched, breaking flow throughout the day.

### Pain 5 — CRM and tool fragmentation kills attribution

Apollo data, Clay enrichments, Outreach sequences, Salesforce records, LinkedIn touches, Common Room signals — all in separate places. Attribution lives in someone's head (or doesn't exist). When something works, no one can repeat it deliberately. When something fails, no one can diagnose it.

---

## Agent stack

Standard B2B SaaS demand-gen deployment uses 3–4 agents from the canonical roster.

### Acquirer Agent (always deployed — the primary function owner)

Subcomponents:

- **Intent monitoring:** real-time scan across job postings (Greenhouse, Lever, Workday public pages, LinkedIn jobs), tech-stack changes (BuiltWith, Wappalyzer), exec moves (LinkedIn news), funding announcements (Crunchbase, news APIs, RSS), G2 review activity for the client's category
- **ICP filtering:** signals filtered against the client's defined ICP, ranked by fit score
- **Enrichment:** multi-source enrichment of qualified targets (Apollo + Clay + LinkedIn + public-source pulls) into a structured prospect profile
- **Personalized first-touch generation:** generates first-touch copy (email + LinkedIn) referencing specific signal triggers, queued for human approval before send
- **Multi-touch sequencing:** follows up across 5–8 touches over 4–6 weeks, adapting based on response (or non-response)
- AIS-side owner during build: Anej Vučič (with Ian on technical architecture)
- Client-side owner during operate: VP GTM, Head of SDR Ops, or founder CEO depending on team structure

### Closer Agent (always deployed)

- **Response classification:** auto-classifies replies (interested / wrong-person / not-now / unsubscribe / wrong-company / question)
- **Routing:** routes interested replies to right AE with structured brief
- **Meeting scheduling:** runs scheduling back-and-forth (calendar integration with AE calendars + buyer's preferred method)
- **Re-engagement:** queues not-now replies for later automated re-engagement at the right time
- **CRM hygiene:** updates Salesforce/HubSpot/Pipedrive records with structured touch data + classified outcomes
- AIS-side owner during build: Ian Veber
- Client-side owner during operate: Sales Ops lead or VP Sales

### Knowledge Agent (always deployed)

- **ICP knowledge:** ingests client's documented ICP, prior won/lost analysis, prior outbound campaigns and their outcomes
- **Voice knowledge:** ingests prior outbound copy from the client's top SDRs, customer testimonials, case studies — voice samples for the Acquirer's first-touch generation
- **Signal-outcome correlation:** learns over time which signal types convert best for which sub-segments, feeds into Acquirer's filtering and prioritization
- **Vertical pitch evolution:** learns which messages convert by sub-segment, makes that visible to client's GTM team
- AIS-side owner during build: Ian Veber
- Client-side owner during operate: VP GTM or Head of Sales Enablement

### Operator Agent (sometimes deployed — only if scope includes pipeline reporting)

- **Pipeline reporting:** daily/weekly/monthly pipeline reports (volume, source, fit, stage progression) auto-generated from CRM data
- **Anomaly detection:** flags unusual pipeline patterns (sudden drop in meetings booked, spike in unsubscribes, new ICP segment appearing organically)
- **Forecast hygiene:** runs forecast accuracy retrospectives, flags deals likely to slip
- AIS-side owner during build: Ian Veber
- Client-side owner during operate: VP GTM or RevOps lead

We always deploy Acquirer + Closer + Knowledge. Operator Agent only when the client's pipeline reporting is unowned or chaotic (it often is, but sometimes RevOps already covers it).

---

## Pricing band

**Build fee:** €30K–€60K
- **€30K–€40K:** Compact engagement. €1M–€3M ARR client, 1–3 SDRs current state, single product, single ICP. Acquirer + Closer + Knowledge stack. Common tooling (HubSpot, Apollo, Outreach).
- **€40K–€50K:** Standard. €3M–€6M ARR, 3–8 SDRs, single or dual product, 1–2 ICPs. Full stack including Operator Agent. More complex tooling.
- **€50K–€60K:** Comprehensive. €6M–€10M ARR, 8–15 SDRs, multi-product or multi-segment, multiple ICPs. Full stack with extensive vertical-specific tuning. Often custom CRM integration work.

**Operate retainer:** €5K–€9K/month
- **€5K–€6K:** Compact engagement
- **€6K–€7.5K:** Standard
- **€7.5K–€9K:** Comprehensive

**Rationale:** Sits in the medium-complexity tier (tooling integration is real work, ICP definition can be iterative, response volume requires active monitoring). Standard 2–3 agent engagement shape, sometimes comprehensive 4-agent. Pricing band reflects that B2B SaaS buyers know the cost of SDR alternatives (€100K+/SDR fully loaded) and can do the math fast.

Contribution margin target: 60–68% (slightly lower than other verticals because enrichment tool costs are real).

---

## Discovery script

Run in English by default. International prospects mostly default to English regardless of native language.

### Must-pass questions

1. **"Who at the company signs off on €40K–€60K investments in demand-gen tooling and services?"** Pass: the person on the call, or a co-founder reachable in a week. Fail: board approval, procurement, RFP.

2. **"Who would own the deployed agent stack on your side after build phase?"** Pass: specific named person (VP GTM, Head of SDR, founder CEO if smaller). Fail: "we'll figure it out" or "the SDR team will manage it" (the SDR team can't be the named owner — they're the operators-of-record).

3. **"Are you OK with a 30-day onboarding ladder before agents start sending outbound to your prospect list externally?"** Pass: yes. Fail: "we need to scale outbound next month."

4. **"Do you have a documented ICP, or do we need to build one as part of the engagement?"** Pass: documented ICP exists, even if rough. Fail: no ICP and no willingness to engage to build one (engagement length doubles otherwise).

5. **"Is your current SDR/BDR team likely to be supportive of this deployment, or hostile to it?"** Pass: supportive or neutral with leadership push to adopt. Fail: SDRs see it as a layoff signal — operator buy-in missing.

6. **"What CRM, sales engagement platform, and enrichment tools are in place?"** Pass: API-accessible stack (Salesforce, HubSpot, Pipedrive + Apollo/Clay/Outreach/Salesloft etc.). Fail: bespoke internal CRM with no API, or contractually locked-in platform that prohibits API integration.

### Sizing questions

7. **"What's your current monthly meeting volume from outbound? And from inbound?"**
8. **"What's your average ACV?"** (helps size the engagement against the prospect's revenue model)
9. **"How many SDRs/BDRs do you have today, and what's your current cost per meeting?"**
10. **"What's the biggest constraint — meeting volume, meeting quality, or AE bandwidth to handle meetings?"**

### Risk-detection questions

11. **"Have you tried other AI-for-sales tools before? Apollo's AI features, Clay's AI extensions, Outreach AI, others? What happened?"**
12. **"How is your current SDR team's morale and tenure? Any recent departures?"** (departures could indicate either dissatisfaction we can help with, or an early sign of the team feeling threatened by AI)
13. **"Are there compliance constraints on outbound (e.g. CAN-SPAM, GDPR explicit-consent jurisdictions, financial services regulation if vertical-specific)?"**
14. **"What's your tolerance for being 'on the bleeding edge' versus wanting boring proven approaches?"** (some founders treat AI engagement as a brag — they care more about being able to say "AI agents do our outbound" than about actual pipeline. This is a yellow flag.)

---

## Proposal anchor

The anchor framing for every B2B SaaS demand-gen proposal:

> **"Generate [2–4×] current outbound-sourced meeting volume in 90 days, without hiring new SDRs, at a per-meeting cost [40–60% below current], with full response classification and AE-routing built in."**

### Math (typical €3M ARR client)

Current state:
- 3 SDRs at €120K fully loaded = €360K/year SDR cost
- Each SDR generates 8 meetings/month = 24 meetings/month total = 288 meetings/year
- Cost per meeting: €1250
- Meeting → opportunity conversion: 20% = 58 opportunities/year
- Opportunity → won deal: 15% = 8.6 deals/year at €100K ACV = €864K new ARR

Post-deployment state:
- Same 3 SDRs (now doing higher-quality work, focused on warm replies)
- Agent stack generates 60 meetings/month (real-time signal acting, hyper-personalized at volume) = 720 meetings/year
- Build fee €45K + 12 months operate retainer €78K = €123K total year-1 investment
- Tooling cost increase ~€15K/year (extra Clay credits + Apollo seats)
- Cost per meeting: €188 from agent stack ($138K total ÷ 720 meetings)
- Same meeting → opportunity → deal rates (assuming similar quality)
- 720 meetings → 144 opportunities → 21.6 deals → €2.16M new ARR
- Net incremental new ARR vs status quo: €1.3M
- Plus: SDRs now focused on higher-touch follow-up and qualified-meeting bookings, raising conversion rates over time

The model presented in proposals always has a "conservative case" (1.5x meeting volume) and a "base case" (2.5x) and the math runs both ways. Buyers respect honest modelling more than aggressive promising.

---

## Failure modes

### Failure 1 — SDR team sabotages adoption

The existing SDR team perceives the agent stack as a layoff signal. Doesn't share their best outbound copy for voice samples. Reports problems back to VP Sales instead of to AIS. Doesn't engage with the agent's response classifications. Agent stack runs in parallel to (rather than as a force-multiplier of) the SDR team.

*Early warning:* SDRs miss week-1 voice-sample collection sessions. Or VP Sales reports SDR team "is concerned about the rollout." Escalate to VP Sales — explicit conversation about the SDR team's evolved role (more meeting volume + higher-quality follow-up + AE-style strategic outreach to high-value targets), not replacement. Get VP Sales to articulate this to the team in front of AIS.

### Failure 2 — Outreach gets flagged as spam

Without proper warm-up, sender-domain reputation, and quality control on first-touch copy, outbound deliverability drops. Outreach lands in spam filters. Reply rates collapse. Client thinks the agent doesn't work, when actually the deliverability infrastructure was never set up correctly.

*Early warning:* During build phase scoping, verify the client's outbound deliverability is healthy. Run a deliverability audit (DMARC, SPF, DKIM, sender-warmup history). If client has been blasting from a single primary domain, build phase needs to include domain warmup + sending infrastructure setup. Time it into build-phase weeks 1–3.

### Failure 3 — ICP is wrong

Agent works perfectly but pipes garbage leads. Reason: the ICP the client documented doesn't actually match their best customers. Often: client says "mid-market US SaaS in B2B" but their actual best customers are "post-Series-B vertical SaaS in healthcare or fintech specifically." Agent stack faithfully delivers exactly what was asked for, which is wrong.

*Early warning:* During build phase week 2, run a "best-fit customer retrospective" — what do your top 10 customers actually have in common? If the answer differs materially from the documented ICP, refine the ICP before deploying agent stack against the old one.

### Failure 4 — VP Marketing buys it without VP Sales operator buy-in

CRO or VP Marketing signs the engagement enthusiastically. VP Sales (or Head of Sales, depending on title) was not in the loop or was lukewarm. After deployment, VP Sales' team doesn't engage with agent-generated meetings. Pipeline numbers look great, meeting-to-opportunity conversion collapses, engagement is judged a failure.

*Early warning:* During discovery, ask explicitly: "Is the head of sales in the loop on this engagement? When can we get them on a call?" If the answer is "they will be once we sign," that's a red flag. Insist on a joint call before signing.

### Failure 5 — Outbound becomes an arms race with anti-bot defenses

LinkedIn rate limits, email anti-bot heuristics, and increasing prospect skepticism mean that "AI-generated outbound at volume" can quickly degrade in response rates as the year progresses. Engagement at month 9 looks worse than engagement at month 3.

*Early warning:* Track response rate weekly. If declining trend over 4+ weeks (controlling for seasonality), trigger an Acquirer Agent re-strategy. Often the response is: pull volume back, increase personalization per touch, slow cadence, shift more touch volume from email to LinkedIn or to other channels (e.g. warm intro requests through partnership network).

---

## Kill criteria

Walk away from a B2B SaaS demand-gen prospect when:

- ARR is below €1M (price band doesn't fit; engagement won't have meaningful impact at their stage)
- ARR is above €10M (committee buying dynamics, longer sales cycle, decision authority diffused)
- GTM motion is pure PLG (the function we own doesn't exist in that motion; refer to a PLG-focused growth firm)
- Sales team has just laid off significant SDR headcount — high risk that operator buy-in is structurally missing, and risk that prospect wants the engagement as cover for further layoffs (don't be that vendor)
- Client demands paid-media management as part of scope (we don't; refer out)
- Client wants us to also build their CRM (out of scope; refer to a SaaS implementation partner)
- Client's existing tooling stack is locked-in to a vendor that prohibits API integration with third-party agents (e.g. some enterprise contracts have these clauses — can't deploy without breaking the contract)
- Client has had three prior outbound vendors fail in the last 18 months — pattern suggests the problem isn't the vendors, it's the client; high failure-mode risk

---

## Acquirer Agent specifics

### Where buyers hang out

- **LinkedIn** — founder CEO / VP GTM persona, especially in SaaS-focused groups
- **SaaS communities** — SaaStr (online + events), Pavilion (CRO community), RevOps Co-op, OpenView's Build channel
- **Industry podcasts** — SaaStr's podcast, Topline (Sam Jacobs), Outbound Squad (Jason Bay), 30 Minutes to President's Club
- **Conferences** — SaaStr Annual, Pavilion CRO Summit, Outbound Conference, INBOUND (selectively — HubSpot's event has a SaaS sub-track)
- **Slack and Discord communities** — Pavilion's Slack, RevOps Co-op, GTMfund, founder communities like Latka's
- **Newsletters** — SaaStr Daily, Lenny's Newsletter, Sam Parr's emails

### Cited content shapes

- Long-form case studies on demand-gen with named metrics (anonymized client OK; numbers must be real)
- Comparison content: agent-driven outbound vs traditional SDR teams (cost-per-meeting math)
- Specific tactical articles on intent monitoring (which signals work for which sub-segments)
- Founder-CEO interview content (we interview, they get the publicity, we get the case study material)
- AI-native GTM thought leadership (the operating-map style content — this matches what AIS already does internally)

### Partnerships worth building

- **SaaS-focused fractional CROs / VP Sales consultants** — they're often the trusted advisor to founder CEOs; refer back-and-forth
- **GTM tooling vendors** — Clay (integration partnership), Common Room (integration partnership), Apollo (selective — they have a competing AI product but partnership possible on enterprise tier)
- **SaaStr / Pavilion ecosystem** — speaker placements, partnership announcements
- **B2B SaaS-focused VCs** — they care about portfolio company efficiency; refer-into-portfolio is a high-leverage motion
- **Outbound coaches and consultants** (Jason Bay's Outbound Squad, Sam Nelson, others) — non-competitive, often refer-friendly

### Avoid

- Generic SaaS marketing agencies (push paid acquisition + content marketing as a bundle; awkward partnership)
- Direct outbound competitors (Apollo, Outreach, Salesloft, Lemlist) — we're a different category but the brand association gets muddied; selective partnerships only

---

## Case study angle

### Headline metric

> **"€[X]M ARR B2B SaaS [vertical] grew outbound-sourced meeting volume by [2–4×] in 90 days, cost per meeting down [40–60%], without hiring a single new SDR."**

### Story structure

1. **Company context** — name (with permission) or anonymized, ARR, vertical, current SDR team size, geographic concentration
2. **Pain** — specific founder/CRO quote on pipeline efficiency bottleneck, baseline numbers (meetings/month, cost/meeting, conversion rates)
3. **Deployment** — Acquirer + Closer + Knowledge agents (+ Operator if applicable), 10-week build phase, ICP refinement work
4. **Onboarding ladder execution** — week-by-week with sample first-touch outputs (redacted where needed), evolution of voice locking, response classification accuracy curve
5. **Outcomes** — meeting volume growth, cost per meeting reduction, meeting → opportunity → won-deal conversion (if engagement has been running long enough), SDR team perspective (they shifted from cold outreach to warm follow-up and qualified-meeting prep)
6. **What didn't work** — be honest. ICP refinement took 3 weeks longer than expected. First-month deliverability had to be re-tuned. One intent source produced low-quality signals and we removed it.
7. **What's next for this client** — expansion to second product? Adding outbound to a new ICP? Knowledge Agent serving sales enablement use cases?

---

## Vertical-specific knowledge requirements

### Must-know

- SaaS unit economics fundamentals (CAC, LTV, payback period, gross-margin retention, net revenue retention)
- B2B SaaS GTM motions (PLG, sales-led, hybrid; SMB vs mid-market vs enterprise dynamics)
- Major demand-gen tooling (Apollo, Clay, Outreach, Salesloft, Common Room, ZoomInfo, LinkedIn Sales Navigator) — at the level of "what each does, what each costs, where they're strong and weak"
- CRM platforms (Salesforce, HubSpot, Pipedrive, Close) — API integration patterns for each
- Intent signal sources (BuiltWith, Wappalyzer, Crunchbase, LinkedIn changes, G2 review activity, Greenhouse/Lever job postings, Common Room community signals)
- Email deliverability fundamentals (SPF, DKIM, DMARC, sender reputation, warm-up patterns, anti-spam regulations by jurisdiction)
- CAN-SPAM (US) + GDPR (EU) + CASL (Canada) + jurisdictional opt-in/opt-out requirements for outbound

### Nice-to-have

- Familiarity with major B2B SaaS revenue benchmarks (e.g. SaaStr benchmarks, OpenView ARR-per-employee benchmarks, KeyBanc Capital Markets SaaS survey data)
- Awareness of competing outbound-AI vendors (Regie, Lavender, Apollo's Magic Email, Outreach AI features, 11x.ai, Artisan) — what they do, where AIS differs
- Knowledge of major SaaS verticals (vertical SaaS for healthcare, fintech, legal, construction, etc.) — affects ICP refinement
- Familiarity with Salesforce admin basics (creating custom objects, automation, workflow rules) — comes up in CRM integration

### Partnership for

- Detailed Salesforce or HubSpot custom-implementation work (we don't deploy CRMs; partner with a Salesforce consultant if a client needs significant CRM rework as part of engagement)
- Deep-domain ICP refinement for verticals we don't know (e.g. fintech compliance, healthcare HIPAA constraints) — partner with vertical-specific consultants
- Email deliverability infrastructure setup (some engagements require dedicated sending domain setup, IP warming, complex authentication — partner with a deliverability consultant or DIY using documented procedures)
- Outbound copywriting deep edits (we mostly let the agent draft, but for high-value verticals sometimes engaging a specialist B2B copywriter for the first-touch templates produces better results than agent-default)
