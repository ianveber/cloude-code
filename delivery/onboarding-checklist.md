# Onboarding Checklist

This checklist governs everything that must happen between SOW signature and the start of Phase 1 build work. The engagement does not clock in until this checklist is complete. Incomplete onboarding is the most common source of mid-project delays — address every item here before touching a single integration.

The project lead owns this checklist. The client contact is responsible for items marked [CLIENT]. Agency is responsible for items marked [AGENCY]. Items marked [BOTH] require coordination.

---

## 0. Pre-kickoff (before the kickoff call)

### Legal and admin [BOTH]

- [ ] SOW signed by both parties — countersigned copy on file
- [ ] Business Associate Agreement (BAA) signed — if applicable (all healthcare verticals)
  - BAA with Veta
  - Client confirms BAA is in place with each tool Veta will integrate with
- [ ] Kickoff payment received (first milestone per SOW Section 5)
- [ ] Client legal entity confirmed — name on SOW matches the operating entity

### Client contact and access [CLIENT]

- [ ] Primary point of contact confirmed — name, title, direct email, mobile
- [ ] Secondary contact named (for when primary is unavailable)
- [ ] Client confirms they have authority to approve specs and sign off on milestones
- [ ] Practice manager / operations lead introduced if not yet met

### Project setup [AGENCY]

- [ ] Engagement folder created: `{vertical}-{client-slug}/`
- [ ] Discovery notes filed in engagement folder
- [ ] Signed SOW filed in engagement folder
- [ ] Agent spec files initialized from `agents/_base/agent-spec-template.md`
- [ ] Tool manifest files initialized from `agents/_base/tool-manifest-template.md`
- [ ] Engagement added to project tracking system with milestones and due dates

---

## 1. Kickoff call (Week 1)

### Agenda (60 minutes)

| Block | Time | Owner |
|---|---|---|
| Introductions and roles | 5 min | Both |
| SOW walkthrough — scope, exclusions, milestones | 10 min | Agency |
| Open assumptions review (SOW Section 3) | 10 min | Both |
| Access and credentials walkthrough | 15 min | Both |
| Communication cadence | 5 min | Both |
| Compliance pre-checks | 10 min | Both |
| Questions and next steps | 5 min | Both |

### Kickoff call outputs

By end of kickoff call, both parties should have confirmed:
- [ ] All open assumptions from SOW Section 3 are either resolved or have an owner and deadline
- [ ] Access and credentials plan is confirmed (who provides what, by when)
- [ ] Communication cadence is agreed (see Section 3 below)
- [ ] Compliance pre-checks are complete or have a completion plan

---

## 2. Access and credentials [CLIENT]

This section must be complete before Phase 1 build begins. Agency cannot spec or build integrations without confirmed access.

### EHR / Practice management system

- [ ] API access confirmed (API is enabled for the client's instance)
- [ ] API credentials or service account created with appropriate permissions
  - Minimum permissions documented in tool manifest
  - No admin-level access unless strictly required
- [ ] Credentials delivered to Agency via [agreed secure channel — e.g., 1Password shared vault, encrypted email, Doppler]
- [ ] Sandbox / test environment access confirmed (or workaround documented if no sandbox exists)
- [ ] API rate limits confirmed and documented in tool manifest

### Communication tools (Weave, Podium, etc.)

- [ ] API access confirmed
- [ ] Credentials delivered securely
- [ ] Webhook endpoint configuration confirmed (if applicable)
- [ ] Message template approval process confirmed — who at the client approves patient-facing message templates?

### Insurance clearinghouse / portal [dental/medical only]

- [ ] API access or portal access confirmed
- [ ] BAA with clearinghouse confirmed
- [ ] Credentials delivered securely
- [ ] Submission format requirements documented (EDI, portal-specific format, etc.)

### E-signature platform [legal only]

- [ ] DocuSign / Adobe Sign / equivalent API access confirmed
- [ ] Template access confirmed — can Agency read/trigger existing templates?
- [ ] Credentials delivered securely

### Other tools named in SOW Section 2.2

- [ ] [Tool name]: access confirmed, credentials delivered
- [ ] [Tool name]: access confirmed, credentials delivered

### Credential storage confirmation [AGENCY]

- [ ] All client credentials stored in secrets manager (not in code, not in docs, not in Slack)
- [ ] Credential storage location documented in tool manifests
- [ ] Rotation policy confirmed with client

---

## 3. Communication cadence [BOTH]

Set this in writing at kickoff. Ambiguity about communication leads to either over-communication (annoying) or under-communication (surprises).

| Type | Frequency | Format | Owner |
|---|---|---|---|
| Status update | Weekly | Async written summary (email or shared doc) | Agency sends, Client reviews |
| Blocker notification | As needed (within 24 hours of identifying a blocker) | Direct message or email | Agency |
| Milestone review | At each milestone | 30-min call or async review | Both |
| Agent spec review | When spec draft is ready | Async review with 5-business-day response window | Client reviews, Agency incorporates |
| Exception review (read-only phase) | Daily for the first 5 days, then weekly | Async review of exception log | Both |

**Primary communication channel:** [Slack / email / other — confirm at kickoff]
**Response time expectation:** Agency responds within 1 business day. Client responds to spec/milestone review requests within [N] business days per SOW.

---

## 4. Compliance pre-checks [BOTH]

Complete before Phase 1 build begins. Reference the relevant vertical playbook for specific requirements.

### Healthcare verticals (dental, aesthetic medicine, any practice with PHI)

- [ ] BAA signed with Veta
- [ ] BAA confirmed with EHR vendor
- [ ] BAA confirmed with communication tool vendor
- [ ] BAA confirmed with any other tool handling PHI in this engagement
- [ ] Client confirms their compliance officer or legal counsel has reviewed the agent system scope and has no objection to proceeding
- [ ] SMS/TCPA consent mechanism confirmed for each message category (marketing vs. transactional)
- [ ] Agent log architecture confirmed: logs store metadata, not PHI content (or, if PHI is logged, the log storage is HIPAA-compliant and included in the BAA)

### Legal vertical

- [ ] Client confirms supervising attorney has reviewed the scope and confirmed no UPL concern
- [ ] Client confirms all patient-facing communication templates will be reviewed by supervising attorney before deployment
- [ ] Log architecture confirmed: no substantive privileged content is logged
- [ ] Conflict check scope confirmed: agent surfaces data, attorney makes determination

### All verticals

- [ ] No disqualifying scope items identified (clinical decision-making, legal advice, actions requiring professional licensure)
- [ ] Agent spec "compliance flags" section filled out for each agent (not left as [STUB])

---

## 5. Staging environment setup [AGENCY]

Before any build work begins, the staging environment must be confirmed.

- [ ] Staging environment for agent deployment established
- [ ] HIPAA-compliant infrastructure confirmed (if applicable) — hosting provider, encryption, access controls
- [ ] Exception dashboard scaffold set up — client can view it before read-only phase begins
- [ ] Output log scaffold set up — read-only phase outputs will be logged here
- [ ] Health check endpoint configured — alerts if agent fails to run on schedule
- [ ] Agent version control initialized — every build deployed is tagged with a version

---

## 6. Agent spec sign-off process [BOTH]

Before build begins on any agent, the spec must be reviewed and approved by the Client. This prevents building the wrong thing.

**Process:**
1. Agency drafts agent spec using `agents/_base/agent-spec-template.md`
2. Agency sends spec to Client primary contact with a 5-business-day review window
3. Client reviews, marks questions or change requests inline, returns
4. Agency incorporates feedback, returns updated spec
5. Client confirms approval in writing (email reply "approved" is sufficient)
6. Agency files approved spec in engagement folder with approval timestamp
7. Build begins

**What Client is approving:** The logic, inputs, outputs, exception handling, and compliance flags — not the code. Client does not need to review code.

**If Client does not respond within 5 business days:** Agency sends a single follow-up. If no response within 3 additional business days, Agency flags it as a blocker and adjusts the timeline accordingly.

---

## 7. Read-only phase setup [AGENCY]

Before the read-only phase begins, confirm:

- [ ] All agent specs are approved
- [ ] All tool manifests are complete (no [STUB] items remaining)
- [ ] Staging integrations are connected and responding (test each one manually before starting the phase)
- [ ] Output log is capturing correctly — Agency verifies with a test run before going live
- [ ] Exception dashboard is visible and functional — Client has access and can navigate it
- [ ] Read-only phase review process is confirmed with Client: how will they review outputs? (daily CSV, Notion board, dashboard link, etc.)
- [ ] Read-only sign-off criteria confirmed (from agent spec, Section: Read-only phase) — both parties agree in writing what "passing" looks like before the phase begins

---

## Onboarding complete gate

The onboarding checklist is complete when:

- [ ] All Section 0 items are done
- [ ] Kickoff call has occurred and all agenda items are confirmed
- [ ] All Section 2 items (credentials and access) are done
- [ ] Communication cadence is confirmed in writing
- [ ] All Section 4 compliance pre-checks are done (no [STUB] items)
- [ ] Staging environment is set up
- [ ] At least one agent spec is drafted and in review

When all boxes are checked: Phase 1 build begins. Log the Phase 1 start date in the engagement folder.
