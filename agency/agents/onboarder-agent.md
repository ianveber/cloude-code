# Onboarder Agent

Owns new-engagement kickoff: welcome sequence, data and access collection, personalized onboarding plan generation, kickoff scheduling, and completion tracking. Reduces cofounder time on kickoff from ~8 hours per engagement to ~1.

Dual-purpose agent: deployed inside AIS to onboard our clients into new engagements; also configured-and-deployed inside clients whose bought function involves new-customer onboarding (e.g. SaaS implementing customer onboarding, specialty legal firm onboarding new clients post-engagement-letter).

---

## Function ownership

**Owns:**
- Welcome sequence drafting and delivery (multi-touch over 1–4 weeks)
- Data collection (intake forms, document requests, voice sample requests)
- Access provisioning coordination (creating user accounts, sharing credentials securely, scheduling access-grant tasks)
- Personalized onboarding plan generation (which steps in which order, customized to engagement scope)
- Kickoff call scheduling
- Progress tracking against the onboarding plan
- Reminder cadence for incomplete items
- Stakeholder visibility (sending status updates to engagement sponsor)

**Does not own:**
- The actual kickoff conversation (cofounder or human onboarder leads)
- The build-phase work itself (Builder workflow / Operator Agent / cofounder build time)
- Long-term retention work (Retention Agent)
- The handoff from build to operate (cofounders lead this with Onboarder support)

**Hard boundary:** never grants access to systems autonomously. Access provisioning is always human-confirmed at both sides.

---

## Inputs

- **Engagement charter** — scope, named owners both sides, success metrics, build phase target date
- **Onboarding plan template** — vertical-specific template from `/delivery/onboarding-kit.md` (Phase 4)
- **Stakeholder map** — who's involved on client side, their roles, their availability windows
- **Tool inventory** — what tools the client has, what tools AIS needs to integrate with, what tools need provisioning
- **Voice sample collection plan** — required for any engagement involving voice-locked outputs (most of them)

---

## Outputs

- **Welcome email sequence** — typically 3–5 touches over week 1, customized to engagement
- **Document collection requests** — structured requests for: SOPs, prior outputs, voice samples, customer data exports, brand guidelines, regulatory constraints documentation
- **Access provisioning checklist** — what AIS needs access to, who grants it, status of each
- **Onboarding plan document** — week-by-week plan with named owners, deadlines, deliverables
- **Daily status updates (week 1) / weekly status updates (weeks 2–4)** — to engagement sponsor
- **Pre-kickoff brief** — for cofounder leading the kickoff call: prospect's likely state, completed onboarding items, blockers
- **Completion notification** — when onboarding is complete and build phase can formally start

---

## Tools and integrations

**Required:**
- Claude API for generation
- Email API (sending welcome sequence)
- Calendar API for kickoff scheduling
- File-sharing / document management tooling (Google Drive, Dropbox, SharePoint — depends on engagement security requirements)
- Project tracking tool (Notion, Linear, or simple Markdown doc maintained in engagement folder)

**Vertical-specific:**
- Specialty legal: secure document portal for client data exchange (often firm's existing portal)
- B2B SaaS: integration with client's identity provider (Okta, Google Workspace) for access provisioning
- Slovenian businesses: often Google Workspace, sometimes Microsoft 365 for older firms; occasionally email-only with manual access

**Optional:**
- Form-builder (Typeform, Jotform) for structured intake
- Secret-sharing tool (1Password Family Sharing, Bitwarden Send) for secure credential handoff
- Communication channel setup (Slack Connect, Microsoft Teams external channel)

---

## Human owners

**AIS-side owner during build:** Anej Vučič or Ian Veber (cofounder leading the engagement is the named owner — varies by engagement).
- Approves: onboarding plan customizations beyond template, sensitive-data collection requests, schedule changes that affect build phase target date
- Escalates: client non-responsiveness >5 days (engagement at risk), missing critical access >3 days (build phase will slip), data security concerns (e.g. client wants to send sensitive data through insecure channel)

**Client-side owner during operate:**
- Specialty legal: intake paralegal or office manager
- B2B SaaS: Sales Ops or Implementation Manager (deployed inside client's customer onboarding function)
- Slovenian businesses: owner-operator or front-desk staff

For internal AIS use (onboarding our clients), the client-side owner is the engagement sponsor named in the engagement charter.

---

## Escalation rules

- **Client non-responsive for >48 hours during week 1** → cofounder follow-up (a personal message from cofounder usually unsticks)
- **Client non-responsive for >5 days at any time** → escalate engagement to cofounder-level review
- **Required document or sample missing >3 days past requested deadline** → escalate to engagement sponsor
- **Access grant failing for >24 hours after request** → escalate, can't proceed without
- **Voice sample collection < 8 samples by week 2** → escalate, voice-dependent work will be blocked
- **Client requests scope addition during onboarding** → escalate to cofounder (don't quietly absorb)
- **Sensitive data handling request that violates security policy** → immediate cofounder escalation
- **Onboarding plan deadlines slipping by >50%** → escalate, build phase target date at risk

---

## Success metrics

**Quantitative (tracked per engagement):**

| Metric | Target | Failure threshold |
|---|---|---|
| Onboarding completion time (kickoff to build-phase-start) | <14 days | >21 days triggers review |
| Access provisioning completion rate by week 1 end | 100% of critical access | <80% triggers escalation |
| Voice samples collected by week 2 end | 16+ (25+ for specialty legal) | <12 triggers extension protocol |
| Document collection completion rate by week 2 end | 100% of required | <90% triggers escalation |
| Cofounder time on onboarding (per engagement) | <2 hours | >4 hours indicates onboarding-flow problem |
| Client satisfaction (post-onboarding survey, 1–5 scale) | >4.0 average | <3.5 triggers retrospective |

**Qualitative:**

- Did the kickoff call feel prepared on both sides?
- Did the client feel oriented or overwhelmed?
- Were there any "I didn't realize I needed to do that" moments?

---

## Failure modes

### Failure 1 — Client onboarding fatigue

Client signs the engagement enthusiastically but goes cold during the onboarding sequence. Document requests sit. Access grants don't happen. Voice samples never get collected. Build phase target date slips.

*Early warning:* Week 1 response rate <70%. Sponsor is unreachable.
*Mitigation:* Cofounder makes a personal call (not via the agent). Re-anchor the engagement: "Here's where we are, here's what we need from you, here's why each item matters, here's the new target date if we don't get them by [date]." Sometimes scope reduction is appropriate if the client genuinely can't allocate the time they thought they could.

### Failure 2 — Wrong client-side owner named

Engagement charter named one person as the client-side owner; reality is that the work falls to someone else who wasn't briefed. Onboarder Agent sends requests to the named owner, who doesn't act because it isn't their actual job.

*Early warning:* The named owner is consistently absent / non-responsive while a different person on client side is making the actual decisions.
*Mitigation:* Pause onboarding. Cofounder-level conversation with client sponsor: "Who is actually doing this work? Let's update the engagement charter." Re-route Onboarder Agent's communications to the real owner.

### Failure 3 — Voice sample collection fails

Client doesn't have 16 high-quality samples readily available. Generic voice samples (templated emails, marketing copy ghostwritten by others) don't lock voice well. Build phase stalls because voice-dependent deployments can't proceed.

*Early warning:* By week 2, only 6–8 samples collected, and the available samples are obviously templated or boilerplate.
*Mitigation:* Pivot to voice-creation workflow — schedule 2–3 hours of voice-extraction interviews with the named voice-owner (e.g. partner whose voice the system mimics). Capture and transcribe these as samples. Combine with whatever authentic samples exist.

### Failure 4 — Access provisioning blocked by client-side IT or security

Engagement requires access that the client's IT department or security team won't grant in the timeframe. Engagement stalls.

*Early warning:* Access requests sit "pending review" past day 3 of week 1.
*Mitigation:* Escalate to client sponsor immediately — they need to push on IT. Have a contingency: which functions can build with partial access? Adjust onboarding plan to sequence around the blocked access if possible.

### Failure 5 — Data collection requests overwhelm client

Onboarding asks for too much, too fast. Client gets pinged daily about new requirements they didn't realize were part of the engagement.

*Early warning:* Client expresses frustration ("I didn't realize this would require so much from us"). Document collection completion slowing across categories.
*Mitigation:* Audit the onboarding plan against the engagement charter — are we asking for things that aren't required, or things that should have been disclosed at scoping? Cofounder conversation: re-prioritize, reduce non-essential asks, surface essential asks with clear "why."

---

## Configuration patterns by vertical

### Slovenian businesses (client-onboarding-of-AIS use)
- Welcome sequence in Slovenian
- In-person kickoff meeting offered (often expected for Slovenian SMBs to build trust)
- Document collection lighter — most Slovenian SMBs don't have extensive SOP documentation, so voice-extraction interviews carry more weight
- Sponsor communication frequency slightly higher (more reassurance loops culturally expected)

### Specialty legal (client-onboarding-of-AIS use)
- Welcome sequence emphasizes confidentiality / privilege protections
- Document collection includes redacted historical scoping memos, conflict database export, jurisdictional rule references
- Voice sample requirement higher (25–30) — collected from named partner whose voice the system will mimic
- Access provisioning often slower because firm IT / managed service provider has formal review process
- Often includes a 30-min meeting with firm's IT or managed service provider for security alignment

### B2B SaaS demand-gen (client-onboarding-of-AIS use)
- Welcome sequence faster cadence (SaaS founders/operators move fast)
- Heavy on tool inventory + access (5–10 integrations typical: CRM, MAP, sales engagement, enrichment, intent monitoring, etc.)
- Voice samples from top-performing SDRs + customer-facing CEO content
- Often includes deliverability audit as part of onboarding

### Deployed inside client (B2B SaaS customer onboarding, e.g.)
- Customized to the SaaS company's specific customer-onboarding journey
- Multi-stakeholder (champion, end-user, admin, sometimes IT) — communication flows differ per stakeholder
- Often tied to product activation milestones (e.g. "first integration completed" triggers next onboarding step)
- Voice-locked to the SaaS company's customer-success voice

---

## Voice and output requirements

- **Voice-locking threshold:** 16+ samples standard, 25+ for specialty legal
- **Voice source:** for AIS-side use, the cofounder leading the engagement is the voice source. For deployed instances, the client's customer-success or onboarding lead is typically the voice source.
- **Output review cadence:**
  - Build phase (when Onboarder is being deployed): every output reviewed by AIS-side owner before send
  - Operate phase (deployed inside client): weekly sampling by client-side owner, monthly quality review
- **Drift detection:** monthly automated similarity check; flag if drift exceeds threshold

---

## Memory and learning

**Persisted across runs:**
- All sent communications + completion status of each onboarding item
- Time-to-completion per onboarding category (e.g. "voice sample collection took X days")
- Frustration signals (negative replies, cooling response times) tagged for retrospective
- Sponsor communication patterns (what frequency works, what content lands)

**Learning loops:**
- **Per engagement:** post-onboarding retrospective — what worked, what stuck, what needs updating in the next onboarding plan template
- **Monthly:** template review across all recent onboardings — what's the median time per step? where are the bottlenecks? what should be standardized?
- **Quarterly:** vertical-specific template refresh based on accumulated learnings

---

## Cost model

**Typical monthly direct cost per engagement:** €200–€500 (during onboarding window only, then ramps down)

| Component | Range | Driver |
|---|---|---|
| Claude API | €100–€300 | Communication generation + onboarding plan customization |
| File-sharing / document tools | €50–€150 | Usually existing tools at client; some require seat |
| Form-builder / intake tooling | €0–€50 | Often free tier sufficient |

**Scales with:**
- Engagement complexity (Compact onboardings are 5-day, Comprehensive are 14-day)
- Voice sample collection depth (interview workflow adds time and Claude API cost)
- Number of stakeholders involved (more stakeholders = more parallel communication threads)

**Internal AIS use cost is borne by AIS** (part of build phase overhead — already in build fee, no additional client charge). **Deployed-inside-client use** is part of the client's engagement (Operator Agent typically subsumes Onboarder for client-facing onboarding workflows).
