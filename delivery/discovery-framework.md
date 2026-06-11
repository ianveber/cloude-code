# Discovery Framework

Discovery is the process of confirming that a prospect is the right client, identifying the target cluster, quantifying the current cost of the workflow, and capturing everything needed to write a proposal without follow-up questions. A well-run discovery call produces a spec-ready picture of the client's situation. A poorly run one produces a vague proposal that requires three rounds of clarification and still gets scoped wrong.

Discovery is not a sales pitch. We already know what we build. Discovery is about whether and where to apply it.

---

## Before the call

Do this before every discovery call. It takes 20–30 minutes and changes the dynamic of the conversation.

**Research the practice:**
- Website: what procedures/services do they offer? How many providers? Any before/after content or patient testimonials (signals volume and marketing orientation)?
- Google Business Profile: rating, number of reviews, review recency, how they respond to reviews
- LinkedIn: practice size estimate, staff roles (do they have a dedicated insurance coordinator? a treatment coordinator? a practice manager?)
- Software: check their job postings or tech stack signals — many practices name their EHR in job descriptions

**Know their vertical cluster candidates before you get on the call.** Go into the call knowing which 2–3 clusters are most likely given the practice type, size, and the signals you've read. You're not leading with those — but knowing them means you recognize when the client describes the problem instead of waiting to hear something new.

**Check the vertical playbook.** Re-read the relevant section before every call. The objections, discovery questions, and integration flags should be in your head.

**Set the call agenda in the calendar invite:**
> "This 45-minute call is to understand how your practice operates day-to-day — specifically the workflows that take the most staff time or where things fall through the cracks. I'll ask a lot of questions. By the end, I'll have what I need to put together a concrete proposal, and you'll have a clear picture of what we'd build and whether it makes sense for you."

Setting the agenda removes ambiguity about what the call is for. The prospect knows this is a working conversation, not a demo.

---

## Call structure

**Total time: 45 minutes.** Do not schedule an hour — 45 minutes forces discipline and signals that you respect their time.

| Block | Time | Purpose |
|---|---|---|
| Opening and context | 5 min | Confirm what they know about Veta, set the agenda, let them describe the practice briefly |
| Practice overview | 8 min | Size, volume, team structure, current software |
| Workflow deep-dive | 20 min | Identify the pain cluster, quantify the cost |
| Tech stack and integration | 7 min | Confirm what we'd integrate with |
| Compliance and constraints | 3 min | Surface any hard blockers |
| Next steps | 2 min | Commit to timeline for proposal |

---

## Section-by-section questions

### Opening (5 min)

Keep this brief. You want them talking about their practice, not listening to you describe Veta.

- "Tell me a bit about the practice — how long have you been in [specialty], roughly how many patients/matters/treatments do you see per month?"
- "What made you want to talk to us? What caught your attention?"

The second question is important. Their answer tells you what they already believe about what we do — and whether you need to correct a misconception before the rest of the call.

### Practice overview (8 min)

Goal: understand the operational footprint. How complex is this practice, who does what, and is the decision-maker on this call?

- "How many providers are in the practice? How many support staff?"
- "Who handles [the specific function you're targeting — insurance, patient communications, intake]? Is that one person or split across the team?"
- "Is there a dedicated office manager or practice manager? Are they on this call?"
  - If the practice manager isn't on the call and you're talking to the owner/physician: "Would it make sense to include them when we go through the specific workflows? They'll likely have more detail on the day-to-day."
- "Who makes decisions about operational tools and systems — is that you, the practice manager, or both?"

Flag: if the decision-maker isn't on this call, find out before the end whether they need to be on the proposal review call. Don't invest in a detailed proposal review with someone who can't say yes.

### Workflow deep-dive (20 min)

This is the heart of the call. Your job is to get specific: what does the workflow look like step by step, how long does each step take, what falls through the cracks, and what does it cost.

**Start open, then narrow:**

"What's the part of your operations that takes the most time or causes the most headaches for your team?" → Let them answer fully before you follow up.

Then depending on what they surface, go deep on that cluster. If nothing surfaces clearly, use the cluster openers from the vertical playbook.

**For any cluster they describe, cover these four dimensions:**

**1. Volume:** How many times does this workflow run per week or month?
- "How many new patient inquiries / pre-auth cases / consultations per month, roughly?"

**2. Time:** How long does the workflow take per instance, and who does it?
- "If you had to guess, how much time does [staff member] spend on this per week?"
- "Is it batched — do they do all the pre-auths at once — or is it spread throughout the day?"

**3. Leakage / error rate:** What goes wrong? What falls through the cracks?
- "What happens when [specific step] doesn't get done?"
- "Have you ever lost a [patient / client / case] because this workflow broke down?"
- "What percentage of [inquiries / consults / plans] do you think don't convert because of follow-up gaps?"

**4. Current tools / workarounds:** How are they handling it today?
- "Is there a system you use for this, or is it mostly manual?"
- "Have you tried to fix this before? What happened?"

**Quantification — the most important step:**

Before moving on from any cluster, anchor a number. Explicitly ask: "If I had to put a dollar figure on what this workflow costs you — staff time, revenue you're not capturing, whatever — what would you estimate?"

They may not know exactly. That's fine. Push for a range: "Would you say it's more like $2,000/month or $10,000/month in staff time alone?" Getting them to a number changes how they think about the proposal price. A $22K engagement is a different conversation when they've just told you they're losing $7,000/month in unconverted treatment plans.

### Tech stack and integration (7 min)

Goal: confirm what we'd integrate with and surface any complexity flags.

- "What practice management / EHR system do you use? How long have you been on it?"
- "What do you use for patient communication — phone, SMS, email? Any specific tools like Weave or Podium?"
- "How do you handle [the specific function] today — is that inside the EHR or a separate tool?"
- "Are you on any clearinghouses or insurance portals?" (dental/medical)
- "What does your document management look like?" (legal)

Flag anything on the integration complexity tier from the vertical playbook. If they're on legacy Dentrix or a system with known API limitations, say so directly: "Just so you know, that system has some API limitations — it's not a blocker, but it adds a couple weeks to the build timeline and I'll reflect that in the proposal."

Don't promise an integration you haven't confirmed is feasible.

### Compliance and constraints (3 min)

Keep this fast — you're not doing a compliance review, you're surfacing hard blockers.

- "Are you HIPAA-compliant today? Do you have a current Business Associate Agreement process for your software vendors?" (healthcare verticals)
- "Which state bar(s) govern your practice?" (legal)
- "Are there any technology or vendor restrictions — like, your group has a preferred vendor list or your malpractice insurer has requirements?" (rare, but worth asking)
- "Any major system migrations planned in the next 6 months?" (if they're switching EHRs, scope timing accordingly)

### Next steps (2 min)

Close with a specific commitment, not a vague "I'll be in touch."

"Based on what you've described, I think the [cluster name] is the right place to start — it's the highest leverage and the most contained scope. I'll put together a proposal that names the specific agents we'd build, what we'd integrate, the timeline, and the price. You'll have it by [specific date, within 3–5 business days]. Does that work?"

If they're not ready to commit to a proposal: "What else do you need to see before we get into specifics?" — then address that directly.

---

## Qualification criteria

After the call, run through these before writing a proposal. If multiple boxes are unchecked, the engagement is not ready to scope.

### Must have (proceed only if all are true)
- [ ] A specific, named cluster with real workflow pain
- [ ] Quantifiable cost or revenue leakage (even a rough estimate)
- [ ] A decision-maker who was on the call or will be on the proposal review call
- [ ] Budget signal — they've indicated they're prepared to invest (even vaguely) in solving this
- [ ] Compatible tech stack — no hard integration blockers identified
- [ ] No disqualifying compliance issues (e.g., they want to automate something that requires clinical judgment)

### Should have (missing one is a yellow flag, not a blocker)
- [ ] Practice manager or operations lead involved
- [ ] Clear sense of timeline urgency (not "someday")
- [ ] Previous attempts to solve the problem (signals they're serious, not just exploring)
- [ ] Referral or warm intro rather than cold inbound

### Disqualifiers — walk away
- Prospect wants to automate clinical decision-making
- Prospect operates outside the active verticals and has no budget for a full Tier 1 engagement
- Decision-maker is absent and the contact has no authority to sign
- Practice is in the middle of an EHR migration or major operational change (retarget in 6 months)
- Prospect explicitly wants a software seat or a low-cost tool, not a custom-built system
- Scope is clearly a Tier 1 but the prospect's budget signals are below the $18K floor

---

## Discovery output

By end of discovery, you should have captured:

```
## Discovery Notes — {client name} — {date}

**Practice overview:**
- Type: [specialty + subtype]
- Size: [providers, staff]
- Volume: [relevant volume metric — patients/month, matters/month, etc.]
- Decision-maker: [name, role, on call? yes/no]
- Practice manager: [name, role, involved? yes/no]

**Target cluster:**
- Primary: [cluster name]
- Secondary (if applicable): [cluster name — for seeding Tier 2 conversation]
- Current workflow description: [specific steps, who does them]

**Quantified cost:**
- Staff time: [hours/week or month × loaded rate = $/month]
- Revenue leakage: [unconverted % × avg value × volume = $/month]
- Total estimated current cost: [range]

**Tech stack:**
- EHR/PMS: [name, version, API status]
- Communication tools: [names]
- Other relevant integrations: [names]
- Integration complexity flag: [low / medium / high — and why]

**Compliance flags:**
- [Any items flagged during call]
- BAA process: [confirmed / not discussed / unknown]

**Qualification status:** [Proceed / Yellow flag — reason / Do not proceed — reason]

**Proposed next step:** [Proposal by date / Follow-up call / Pass]

**Notes:**
[Anything else — objections raised, things they said that are worth quoting back in the proposal, context about the practice culture]
```

Save discovery notes in the engagement folder. They're the source of truth for the proposal and the SOW.

---

## From discovery to proposal

**Turnaround: 3–5 business days from discovery call to proposal delivery.**

The proposal is not a lengthy document. It is:
1. A restatement of what you heard in discovery (confirms you understood them)
2. A named description of what you'd build (specific agents, specific integrations)
3. A timeline with milestones
4. A price
5. A list of assumptions and open items

Proposals that require the client to imagine what they're buying lose deals. Proposals that name the intake agent, the pre-auth agent, and the specific integrations with their existing Curve Dental instance close faster because the client can see exactly what they're getting.

The SOW comes after the proposal is verbally accepted — not before.
