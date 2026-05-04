# Vertical Playbook — Specialty Dental

**Subtypes in scope:** Implant, oral surgery (OMS), orthodontics, periodontics, endodontics
**Out of scope for this playbook:** General/family dentistry, DSO corporate rollouts (separate playbook needed), pediatric dentistry

Last updated: 2026-05-04
Engagements completed in this vertical: 0 (first-run baseline)

---

## The business reality

Specialty dental practices run on a handful of painful workflows that consume enormous staff time, leak significant revenue, and operate almost entirely on manual coordination.

The typical specialty dental office (5–25 staff, 1–4 providers) has:

- A front desk fielding 40–80 calls/day, most of which are insurance questions, scheduling, and "what's my balance"
- An insurance coordinator spending 2–4 hours/day on pre-authorization submissions, follow-ups, and denial management
- A treatment coordinator with a conversion rate of 40–65% on presented treatment plans — meaning 35–60% of patients who walked in, had a consult, and left with a plan never scheduled
- A recall system that is either an expensive third-party service (Weave, Lighthouse, RevenueWell) or a manual calling list that gets ignored when the office is busy
- An EHR (Dentrix, Eaglesoft, Open Dental, Curve) that contains all the data but exposes it through a clunky interface that requires staff to run every workflow manually

The decision-maker is almost always the practice owner (the dentist) or the office manager — occasionally a DSO operations director for multi-location groups. The dentist often doesn't know the revenue leakage numbers in detail; the office manager does. Lead with operational pain with the office manager; lead with revenue recovery with the dentist/owner.

---

## Functional clusters available for automation

Ranked by leverage (revenue impact × time saved ÷ build complexity):

### Cluster 1 — Insurance Pre-Authorization (highest leverage)

**What it is:** Before performing high-cost procedures (implants, surgical extractions, ortho, crowns over a threshold), most practices must submit a pre-authorization request to the patient's insurer and wait for approval. This takes 3–14 business days per case and requires:
- Pulling the correct CDT codes and narrative from the treatment plan
- Attaching X-rays and clinical notes in the format each insurer requires
- Submitting through the insurer's portal or via clearinghouse
- Following up if no response arrives within the insurer's stated window
- Tracking approval/denial and notifying the scheduling team

**Current cost:** An insurance coordinator spends 30–90 minutes per pre-auth case. A practice doing 15–25 implant/surgical cases/month is burning 10–35 hours/month on this workflow alone.

**What we automate:**
- `preauth-dental-prepare`: reads treatment plan from EHR, pulls correct CDT codes, drafts the clinical narrative, attaches required attachments
- `preauth-dental-submit`: submits to the correct insurer portal via integration or structured email
- `preauth-dental-track`: monitors for response, sends follow-up at day 5 and day 10 if no response, routes approvals/denials back to the scheduling team

**Value framing for proposals:** If the practice does 20 pre-auth cases/month at 45 min each = 15 hours/month of coordinator time. At a loaded cost of $35/hour, that's $525/month or $6,300/year. Plus: faster approvals mean faster case scheduling, which directly impacts monthly production.

### Cluster 2 — Treatment Plan Follow-Up (highest revenue recovery)

**What it is:** After a consult where the treatment coordinator presents a treatment plan, a significant percentage of patients leave without scheduling. The standard follow-up is a phone call that often doesn't happen, or happens once and gets dropped. The revenue sitting in unconverted treatment plans at the average specialty practice is $30K–$150K at any given time.

**What we automate:**
- `followup-dental-sequence`: monitors the EHR for treatment plans with no scheduled case, triggers a multi-step follow-up sequence (SMS, email, or both) at days 3, 10, and 21 post-consult
- Sequence content is personalized to the treatment type, the patient's insurance status (approved vs. pending vs. no coverage), and the provider
- Exceptions: patients who have explicitly declined, patients who are already scheduled, patients flagged as "do not contact"

**Value framing:** If 10 unconverted treatment plans/month at an average case value of $3,500 — recovering 2 of those = $7,000/month. A Tier 1 engagement pays for itself in 3–6 weeks.

### Cluster 3 — New Patient Intake (highest volume, clearest ROI)

**What it is:** A new patient contacts the practice (website form, Google call, referral). Current workflow: staff takes a call or reads a form submission, manually creates a patient record, verifies insurance eligibility, and schedules. This takes 15–30 minutes per new patient and is one of the most interrupt-heavy parts of the front desk's day.

**What we automate:**
- `intake-dental-triage`: receives inquiry from website form, Google Business Profile, or practice management system notification; extracts patient name, contact info, insurance, and chief complaint; checks for existing patient record
- `intake-dental-verify`: hits the insurance eligibility API (most EHRs and clearinghouses expose this) to verify coverage and extract benefits relevant to the chief complaint
- `intake-dental-schedule`: if eligible, presents available appointment slots via SMS/email link and creates a staged record in the EHR once the patient confirms
- Exceptions: unverifiable insurance, complex cases requiring staff triage, patients who need to be routed to a specific provider

**Value framing:** 20 new patients/month × 20 minutes each = 400 minutes (6.7 hours) of front desk time. Faster response time (< 5 minutes vs. current 2–8 hours) measurably improves new patient conversion.

### Cluster 4 — Recall and Reactivation (long-tail revenue)

**What it is:** Patients who are overdue for a recall appointment (perio maintenance, implant check, ortho retention check). Most practices have 200–800 lapsed patients in their system. This is the cluster where third-party tools (Weave, RevenueWell, Lighthouse) compete — but they are generic and require significant staff time to configure and monitor.

**What we automate:** Targeted reactivation sequences by patient segment (last visit date, treatment type, insurance status). Smarter than broadcast SMS blasts — segments by who is most likely to respond and what to say to them.

**Typical Tier 1 scope:** This is usually a Phase 2 addition (Tier 2 / vertical stack), not the first cluster we build. Include it in discovery to seed the expansion conversation.

### Cluster 5 — Morning Huddle Prep (operational efficiency)

**What it is:** The daily morning huddle brief — who's coming in today, what's their treatment, what's outstanding (unpaid balances, unsigned consents, pending authorizations, lab cases). Currently produced manually or not at all.

**What we automate:** A nightly agent that pulls the next day's schedule from the EHR and generates a structured huddle brief delivered to the office manager and providers before they arrive.

**Best fit:** Usually bundled into a larger engagement as a value-add, not a standalone Tier 1. Low build complexity, high daily visibility — good for client satisfaction.

---

## Integration map

| Software | Category | Prevalence | Integration method | Notes |
|---|---|---|---|---|
| Dentrix | EHR/PMS | ~35% market share | Dentrix API (limited) + Dentrix Ascend API (better) | Legacy Dentrix has poor API coverage; Dentrix Ascend is cloud-native and more accessible |
| Eaglesoft | EHR/PMS | ~20% | Patterson API | Similar limitations to legacy Dentrix |
| Open Dental | EHR/PMS | ~15% | REST API (well-documented) | Best API coverage of the major PMS options; open source |
| Curve Dental | EHR/PMS | ~10% | REST API | Cloud-native, good API |
| Dolphin / Orthotrac | Ortho PMS | Common in ortho | Limited API; often requires export/import workflows | May need workaround for direct integration |
| Availity / Change Healthcare | Insurance eligibility + preauth | Industry standard | REST API | Change Healthcare had a major 2024 breach — clients will be sensitive; confirm their clearinghouse |
| Weave | Patient communication | Very common | Weave API | Good integration; covers SMS, phone, forms |
| Lighthouse 360 / RevenueWell | Recall + marketing | Common | API available | We're typically displacing these for the recall cluster |
| Google Business Profile | New patient source | Universal | GMB API | Call tracking and form leads |
| Podium / Birdeye | Reviews + messaging | Common | REST API | Often used alongside Weave |

**Integration complexity tiers:**
- Open Dental + Weave: fastest to integrate, best documented
- Dentrix Ascend + Availity: moderate complexity, well-supported
- Legacy Dentrix/Eaglesoft + any clearinghouse: highest complexity, may require export/import workarounds — add 1–2 weeks to build estimate and flag in proposal

**Adjacent AI ecosystem (context, not competition):** Overjet (AI-powered radiograph analysis, flags pathology and treatment needs from X-rays) and AKASA (AI revenue cycle management for larger healthcare groups) are both operating in the dental/healthcare AI space. Overjet is clinical-side; AKASA targets larger RCM operations. Neither builds the operational workflow automation layer that Veta builds — they're clinical or billing analytics tools, not agent systems that replace coordinator workflows. When a prospect mentions either, acknowledge them and clarify the distinction: "Overjet reads X-rays; we automate what happens after the treatment plan is presented."

---

## Compliance considerations

**HIPAA is non-negotiable.** Every patient record, insurance data point, and communication is PHI.

Before build starts on any dental engagement:
- [ ] Business Associate Agreement (BAA) signed with Veta
- [ ] BAA in place between client and every tool we integrate with (EHR vendor, clearinghouse, communication platform)
- [ ] Confirm the client's EHR vendor supports HIPAA-compliant API access (most do, but confirm the specific integration method)
- [ ] Agent outputs (logs, exception dashboard) are stored in HIPAA-compliant infrastructure
- [ ] SMS communications comply with TCPA — explicit patient consent required for marketing messages; transactional messages (appointment reminders, pre-auth status) have different rules

**State-specific:** Some states have stricter dental patient communication rules. Flag for California (CCPA), New York, and Texas clients.

**Credential handling:** Insurance coordinator portal credentials are sensitive. Do not store in plaintext. Confirm the clearinghouse supports API authentication rather than credential-based portal access.

---

## Pricing guidance

| Cluster | Tier | Price range | Key value anchor |
|---|---|---|---|
| Pre-auth automation | Tier 1 | $22K–$38K | Hours saved × coordinator loaded cost + faster case scheduling |
| Treatment plan follow-up | Tier 1 | $18K–$28K | Unconverted treatment plan value × recovery rate |
| Intake automation | Tier 1 | $18K–$25K | Staff hours saved + new patient conversion rate improvement |
| Pre-auth + intake (combined) | Tier 1 | $32K–$48K | Combined value, reduced integration overhead |
| Full front-office stack (intake + preauth + follow-up + recall) | Tier 2 | $65K–$95K | Full front-desk transformation |

**Discount discipline:** Do not discount below the Tier 1 floor ($18K) for "smaller practices." A small practice with 8 implant cases/month still has a real pre-auth burden and real unconverted treatment plans. If they can't afford $18K, they're not yet the right client.

---

## Discovery questions

Use these in the first call. The goal is to confirm the cluster is real, quantify the cost, and let the client hear themselves describe the pain.

**Pre-auth:**
- "How many pre-authorization cases are you submitting per month, roughly?"
- "Who handles pre-auth submissions — is that a dedicated coordinator or does someone split time?"
- "What's your average turnaround time from submission to approval?"
- "How do you currently track which cases are pending, which are approved, which got denied?"

**Treatment plan follow-up:**
- "When a patient leaves without scheduling after a consult, what happens next?"
- "Do you have a number for how many treatment plans are currently presented but not scheduled?"
- "Who's responsible for following up with those patients?"

**Intake:**
- "How are new patient inquiries coming in right now — phone, web form, Google?"
- "How long does it typically take from a new patient inquiry to a confirmed appointment?"
- "Does your front desk get interrupted by new patient calls throughout the day?"

**General framing questions:**
- "If I asked you what your biggest operational headache is, what would you say?"
- "What does your insurance coordinator spend most of their time on?"
- "Is there a workflow where you know something's falling through the cracks but you don't have the time to fix it?"

---

## Common objections and responses

**"We already use Weave / RevenueWell / Lighthouse for this."**
Those tools require your team to run the campaigns and review the outputs. They're communication infrastructure, not decision-making systems. We build the agent layer on top of whatever communication tools you already have — or we can replace the parts that aren't working. The question is: how much time does your team spend inside those tools per week, and is the result worth that time?

**"Our EHR vendor is about to release a feature for this."**
EHR vendors have been saying this for 10 years. Their product roadmaps are real, but they move slowly and they build for the median practice. We build for your specific workflow and your specific mix of insurance contracts. Even when the EHR feature ships, it will require your team to run it manually.

**"We're worried about HIPAA."**
Good — so are we. Here's how we handle it: [walk through BAA, data handling, HIPAA-compliant infrastructure]. We've built this compliance posture into every dental engagement. It's not an afterthought.

**"We don't want to replace our staff."**
We're not replacing your staff — we're removing the tasks that keep your coordinators from doing the work that actually requires human judgment. Your insurance coordinator shouldn't be manually formatting pre-auth submissions; she should be handling appeals and managing complex cases. That's where her expertise matters.

**"Can we start small and see if it works?"**
Yes — Tier 1 is specifically designed for that. One cluster, fixed scope, 6–8 weeks. You'll know whether it's working before you commit to anything larger.

---

## Post-engagement playbook update protocol

After every completed dental engagement, the project lead must update this file with:

1. Which cluster was built and what the actual build time was vs. estimate
2. Which EHR integration was used and any surprises encountered
3. The actual value metrics at 60 days post-launch (accuracy rate, staff hours saved, revenue recovered if measurable)
4. What objections came up that aren't listed above
5. What we would scope differently next time

This section gets added as an appendix: `## Engagement log — {client-slug} — {date}`
