# Vertical Playbook — Aesthetic Medicine

**Subtypes in scope:** MedSpa (NP/PA-owned or physician-supervised), plastic surgery practices, dermatology (cosmetic focus), cosmetic dentistry (overlap with dental playbook for non-surgical aesthetics)
**Out of scope for this playbook:** Hospital-based plastics, insurance-driven derm (different economics), oncology aesthetics

Last updated: 2026-05-04
Engagements completed in this vertical: 0 (first-run baseline)

---

## The business reality

Aesthetic medicine practices have a distinctive economics problem: they operate at the intersection of healthcare (compliance-heavy, trust-sensitive, relationship-driven) and high-consideration retail (the patient is a consumer choosing to spend $3K–$25K on elective procedures). The marketing and conversion funnel looks more like luxury retail than primary care. The backend looks like healthcare.

This creates a specific set of operational failures:

- **High consultation-to-booking drop-off:** Patients research extensively, book a consultation, and then don't convert. Industry benchmarks put consultation conversion rates at 45–65% for surgical practices, higher for injectables. The unconverted consultations represent a large pool of revenue that could be recovered with structured follow-up — but most practices have no systematic follow-up process.
- **Post-treatment experience gaps:** The treatment experience inside the practice is excellent; the experience after the patient leaves is often silence. No proactive check-in, no instruction reinforcement, no review request. This is where patient loyalty and word-of-mouth referrals are lost.
- **Consent and pre-treatment prep failures:** Patients arrive for treatment without completing required consents, pre-treatment instructions, or pre-payment. This creates front-desk scrambles, delays, and occasionally requires rescheduling — all of which damage the premium experience the practice is trying to deliver.
- **Membership and package revenue leakage:** Many medspa and high-volume injectable practices sell memberships (monthly Botox clubs, facial series packages). Renewals and upsells require proactive outreach that almost never happens systematically.
- **Review generation inconsistency:** Google, RealSelf, and Yelp reviews directly drive new patient volume in this vertical. Most practices generate reviews sporadically — when a happy patient volunteers one. A systematic review request process, timed correctly post-treatment, can double or triple review velocity.

The decision-maker is typically the practice owner (physician, NP, or PA), a MedSpa director, or a practice manager. In physician-owned practices, the physician is the gatekeeper but often delegates operational decisions to a practice manager. Target the practice manager for discovery; close with the physician.

One important cultural note: aesthetic medicine practitioners are sensitive to anything that feels "spammy" or "cheap." The patient base is paying premium prices for a premium experience. Position every automation in terms of *enhancing* the patient experience, not just saving staff time.

---

## Functional clusters available for automation

Ranked by revenue impact:

### Cluster 1 — Consultation Follow-Up and Conversion (highest revenue recovery)

**What it is:** A patient has a consultation — surgical or non-surgical — and leaves without booking. In the following days and weeks, most practices have no structured follow-up. A staff member might call once. The patient, who is still warm, receives no further engagement and eventually books with a competitor or doesn't book at all.

**What we automate:**
- `followup-aesthetics-sequence`: monitors the practice management system for consultations with no booked procedure; triggers a personalized follow-up sequence based on the treatment discussed, the provider seen, and the patient's stated timeline
- Sequence timing: day 2 (warm follow-up, "we hope your consultation was helpful"), day 7 (educational content relevant to the treatment discussed, light CTA), day 14 (social proof or before/after content, offer to answer questions), day 30 (final check-in)
- Content is not generic — it references the specific treatment(s) discussed in the consultation
- Exceptions: patients who have booked, patients who have explicitly declined, patients flagged as "do not contact"

**Value framing:** If the practice has 25 unconverted consultations/month with an average treatment value of $2,800, recovering 4 of those = $11,200/month. The sequence pays for a Tier 1 engagement in under 3 months.

**Important nuance:** Surgical practices (facelifts, rhinoplasty, breast augmentation) have longer decision timelines — 3–12 months. The follow-up sequence for surgical patients is longer, lower frequency, and more educational. Non-surgical (Botox, fillers, CoolSculpting) is a shorter timeline — 2–4 weeks. Configure the sequence by treatment category.

### Cluster 2 — Post-Treatment Follow-Up (patient experience + review generation)

**What it is:** After a treatment, the patient needs: (1) reinforcement of post-treatment instructions, (2) a check-in to catch complications early, and (3) an eventual review request. Currently, most practices send one post-treatment email (generic) and that's it.

**What we automate:**
- `posttreat-aesthetics-checkin`: sends a structured post-treatment follow-up at 24 hours (how are you feeling? here are your post-care instructions re-summarized), 5–7 days (photo check-in invite for touchup assessment), and 14–30 days (satisfaction check-in)
- `posttreat-aesthetics-review`: at the 14-day check-in, if the patient indicates satisfaction, triggers a review request with direct links to Google, RealSelf, or Yelp — whichever the practice prioritizes
- Exception handling: if the 24-hour check-in indicates a concern (patient describes pain, swelling, or dissatisfaction), route immediately to the clinical team — the agent does not attempt to handle clinical concerns

**Compliance flag:** The 24-hour check-in must not provide clinical advice. If a patient describes a post-treatment symptom, the agent's only response is to route them to the clinical team. No symptom assessment, no reassurance, no "that's normal." This is a medical practice — anything that sounds like clinical advice exposes the practice.

**Review generation ROI:** A practice with 80 treatments/month, 40% satisfaction survey completion, and 50% of satisfied patients leaving a review = ~16 new Google reviews/month. At current conversion rates, a Google review drives $150–$400 in new patient revenue on average. The review automation alone can generate $2,400–$6,400/month in attributable new patient revenue.

### Cluster 3 — Pre-Treatment Prep and Consent Automation (operational efficiency + risk reduction)

**What it is:** Before arriving for a treatment, patients should have: completed their intake/health history form, signed the relevant informed consents, received and confirmed receipt of pre-treatment instructions, and completed any required payment. Currently, many patients arrive without completing one or more of these — creating front-desk delays, rushed consent processes, and occasionally rescheduled appointments.

**What we automate:**
- `preptreat-aesthetics-prep`: at 72 hours before a scheduled appointment, sends the patient a secure link to their outstanding paperwork (consent forms, health history updates, pre-treatment instructions); tracks completion status
- At 24 hours before: sends a reminder to anyone who hasn't completed outstanding items, with a direct link
- At appointment confirmation: flags to the front desk which patients are arriving with incomplete paperwork so they can plan for it
- `preptreat-aesthetics-consent`: integrates with the practice's e-signature platform (DocuSign, Practice Better, or the native EHR consent module) to collect signed consents before arrival

**Risk reduction framing (for physician/owner conversations):** Incomplete or rushed consent is a malpractice exposure. A patient who signs consent in the waiting room 5 minutes before a procedure, feeling pressured, has a different legal posture than one who reviewed and signed it the day before. This is a risk reduction tool as much as an efficiency tool.

### Cluster 4 — Membership and Package Management (recurring revenue)

**What it is:** Many medspa and high-volume injectable practices run membership programs (monthly Botox/Dysport credits, skincare product subscriptions, treatment series packages). These memberships require: renewal reminders, lapsed member reactivation, and upsell sequences when patients are approaching the end of a package.

**What we automate:**
- `membership-aesthetics-renew`: 30 days before a membership renewal, sends a personalized renewal reminder with the patient's treatment history and usage summary
- `membership-aesthetics-reactivate`: for lapsed members (cancelled in the last 6 months), sends a reactivation sequence at month 1, month 3, and month 6
- `membership-aesthetics-upsell`: when a patient completes a treatment package, triggers an upsell offer to the next tier or a complementary treatment

**Typical Tier placement:** Membership automation is often bundled into a Tier 2 engagement with consultation follow-up and post-treatment follow-up. It's rarely a standalone Tier 1 unless the practice has a large membership base (100+ active members).

### Cluster 5 — New Patient Intake and Consultation Scheduling (volume operations)

**What it is:** Similar to dental intake, but with aesthetic-specific nuances: the patient is often coming from social media or a Google search; they may be researching multiple practices; the consultation booking experience is a preview of the overall patient experience. A slow or confusing intake process loses high-consideration patients.

**What we automate:**
- `intake-aesthetics-screen`: receives inquiry from web form, Instagram DM (via connected inbox), or Google; asks a short qualifying questionnaire (treatment interest, general timeline, any relevant health considerations) and delivers a consultation booking link
- `intake-aesthetics-prepare`: once consultation is booked, sends a pre-consultation preparation packet (what to expect, how to prepare, what to bring) and a short intake health history form

**Nuance:** Instagram DM integration is common in this vertical — a significant share of aesthetic medicine inquiries come via Instagram. This requires a Meta Business API integration. It's possible but adds complexity; flag in proposals.

---

## Integration map

| Software | Category | Prevalence | Integration method | Notes |
|---|---|---|---|---|
| Nextech | EHR/PMS (aesthetics-specific) | ~25% of surgical practices | REST API | Good integration, well-documented for this vertical |
| Aesthetic Record | EHR/PMS (medspa-focused) | Common in MedSpas | REST API | Built specifically for injectables/aesthetics; strong mobile focus |
| PatientNow | EHR + marketing | ~15% of surgical plastics | REST API | Includes built-in marketing tools; understand what overlaps with what we're building |
| Symplast | Plastics-specific EHR | Surgical plastics | REST API | Strong in surgical practices; less common in MedSpas |
| Jane App | Scheduling + practice management | Growing in MedSpas | API | Good for smaller medspa operations |
| Zenoti | Spa/medspa management | Larger MedSpas | REST API | More spa-heritage than medical; may lack clinical features |
| DocuSign / Practice Better | E-signature / consent | Common | REST API | Consent collection integration |
| RealSelf | Review platform | Surgical aesthetics | No write API; read-only options | Review requests must link to RealSelf profile; cannot auto-post |
| Google Business Profile | Reviews + discovery | Universal | GMB API | Direct review link generation is straightforward |
| Instagram / Meta Business | Social inquiries | Very common | Meta Business API | Requires Meta business verification; moderately complex |
| Square / Stripe | Payments | Common in MedSpas | REST API | Pre-payment collection for deposits |

**EHR fragmentation warning:** The aesthetic medicine software market is fragmented and includes several players with limited API coverage. Before scoping, confirm: (a) which PMS the client uses, (b) whether that PMS has an API, (c) what the API actually exposes. Some systems require export/import workarounds. Add a discovery call specifically to confirm integration feasibility.

---

## Compliance considerations

**HIPAA applies in full.** Aesthetic medicine is medical care. Patient records, treatment histories, health histories, and communications are PHI. Identical requirements to the dental vertical: BAA with Veta, BAA with every integrated tool, HIPAA-compliant infrastructure for agent logs.

**No clinical advice — hard line.** This is the most important compliance constraint in this vertical. The agent does not:
- Assess or interpret post-treatment symptoms
- Recommend treatments
- Contraindicate treatments based on patient health history
- Predict outcomes or make comparative claims about treatment effectiveness

Any output that could be read as clinical guidance exposes the practice to liability and exposes Veta to liability. When in doubt, the agent's response is: "Please contact our office to speak with a clinical team member."

**FTC testimonial rules:** Before/after photos used in marketing communications are subject to FTC guidelines. The agent does not generate or distribute before/after content without attorney review of the specific communications. If the post-treatment follow-up sequence references outcomes or patient results, legal review is required.

**State medical board rules on NP/PA practice:** Many MedSpas are owned or operated by NPs and PAs under physician supervision. The scope of practice — and therefore the scope of what the practice can do — varies by state. In states with strict physician supervision requirements (e.g., California for some procedures), understand the practice structure before building any agent that touches clinical communication.

**TCPA — SMS consent:** Explicitly required for marketing-category SMS. Transactional messages (appointment reminders, pre-treatment instructions) have different rules. Before the follow-up sequence goes live, confirm that the consent mechanism captures the right TCPA consent for each message category.

**Before build starts on any aesthetics engagement:**
- [ ] BAA signed with Veta
- [ ] HIPAA-compliant infrastructure confirmed
- [ ] Clinical advice boundary reviewed with practice owner/medical director
- [ ] SMS consent mechanism confirmed for each message category
- [ ] If NP/PA-owned: understand physician supervision structure and state-specific scope rules
- [ ] All patient-facing communication templates reviewed by the practice's supervising physician or medical director

---

## Pricing guidance

| Cluster | Tier | Price range | Key value anchor |
|---|---|---|---|
| Consultation follow-up sequence | Tier 1 | $20K–$32K | Unconverted consultation value × recovery rate |
| Post-treatment follow-up + reviews | Tier 1 | $18K–$28K | Review velocity impact + retention |
| Pre-treatment prep + consent | Tier 1 | $18K–$24K | Rescheduling cost reduction + liability framing |
| Consultation + post-treatment (combined) | Tier 1 | $30K–$45K | Combined, reduced integration overhead |
| Full patient journey (intake → consult → treatment → follow-up → review → membership) | Tier 2 | $65K–$95K | Full lifecycle, coordinated agent system |

**Pricing note for MedSpas vs. surgical practices:** Surgical practices have higher average case values ($5K–$25K per procedure) so the ROI math is faster — a single recovered surgical consultation often covers a large share of the build cost. MedSpas have lower per-visit values ($150–$800) but higher volume — the math works through membership and retention rather than single-case recovery. Adjust the value framing accordingly.

---

## Discovery questions

**Consultation follow-up:**
- "After a consultation where the patient doesn't book, what happens?"
- "Do you have a number for how many consultations you do per month versus how many convert to procedures?"
- "Who follows up with unconverted consultations, and how?"

**Post-treatment experience:**
- "What does a patient receive from you after their treatment?"
- "How do you currently ask for reviews?"
- "What's your Google rating, and do you know how many reviews you get per month?"

**Pre-treatment prep:**
- "How often does a patient arrive without completed paperwork or consents?"
- "Has a treatment ever been rescheduled because a patient wasn't prepared?"

**Membership / packages:**
- "Do you have a membership or package program? How many active members?"
- "How are renewals managed? What happens when a membership lapses?"

**General:**
- "If you could fix one thing about your patient experience between the consultation and the treatment, what would it be?"
- "What do patients complain about — if anything?"
- "What does your front desk spend most of its time doing that you wish they didn't have to?"

---

## Common objections and responses

**"We already have PatientNow / Nextech marketing tools for this."**
Those tools are broadcast email and SMS — they send to segments, not to individuals based on real-time practice data. They don't know which specific treatments were discussed in a consultation, whether a patient is warm or cold, or what the patient's health history says about what follow-up message is appropriate. We build on top of your existing system — or around it, if there's overlap — with logic that understands the patient context rather than just the segment.

**"Our patients value a personal touch — I don't want them to feel like they're getting automated messages."**
The goal is for the message to feel personal, not to feel automated — because it references their specific treatment, their provider, and their timeline. A follow-up that says "We'd love to help you achieve your goals with the lip filler we discussed" feels more personal than a generic "We hope you're considering our services." Done well, patients often don't know it's automated.

**"We're worried about patient privacy in a sensitive context."**
Aesthetic medicine is sensitive — patients don't necessarily want their spouse to know they're considering a facelift. We treat every patient communication as PHI, which means: HIPAA-compliant infrastructure, no third-party tracking in patient emails, and your team controls which channel (email vs. SMS vs. phone) each patient has consented to for each message category.

**"What if the patient has a complication and the AI mishandles it?"**
The agent does not handle complications. At the first sign of clinical concern — in any check-in message — the agent routes the patient to your clinical team immediately and stops the automated sequence. There is no clinical judgment in the system. Period.

**"We tried a follow-up system before and the staff just stopped using it."**
This is a staff adoption problem, not a technology problem — and it's the most common failure mode for off-the-shelf tools. Our system runs without staff involvement. Your team doesn't log into a dashboard to send the follow-ups; the agent monitors the PMS and executes. The only staff touchpoint is the exception queue — cases where a human needs to intervene. Everything else runs automatically.

---

## Post-engagement playbook update protocol

After every completed aesthetic medicine engagement, the project lead must update this file with:

1. Practice type (MedSpa / surgical plastics / derm) and clusters built
2. EHR/PMS integrated — API findings, any workarounds
3. Clinical advice boundary: any edge cases encountered, how they were resolved
4. Conversion recovery metrics at 60 days post-launch (if measurable)
5. New objections not listed above
6. What we'd scope differently

Append as: `## Engagement log — {client-slug} — {date}`
