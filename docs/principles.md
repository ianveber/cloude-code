# Operating Principles

These are not values-wall decoration. They are decision rules. When there's a fork in the road — on a client call, in a proposal, in a build — these tell you which way to go.

---

## 1. Vertical depth beats horizontal breadth

We know more about specialty dental workflows than any generalist AI firm. That knowledge is the moat. Every time we take a horizontal client "just because," we dilute the vertical database and slow down the next vertical playbook.

**In practice:** If a prospect is outside our active verticals, the correct move is to say so and either route them to a future vertical timeline or decline cleanly. Taking a "close enough" client to hit a revenue target is a compounding mistake.

---

## 2. Ship systems, not deliverables

A deliverable is a document, a prototype, a demo. A system is something that runs in production and changes how the business operates. We don't finish when the demo works. We finish when the client's team is using it without us in the room.

**In practice:** Every engagement scopes to a handoff milestone, not an approval milestone. "Client approved the demo" is not done. "Client's ops manager ran the Monday intake without us on the call" is done.

---

## 3. Name what's a stub versus what's locked in

Overconfident scoping kills projects. If something in a proposal is a hypothesis (we think we can integrate with their billing system, we think the intake agent can handle Spanish-language patients), say so explicitly. Label it "TBD pending discovery" or "stub — requires confirmation."

**In practice:** Proposals have a section called "Assumptions and open items." Clients trust specificity over confidence. A proposal that honestly names three unknowns is more credible than one that pretends there are none.

---

## 4. Read-only before write

Before any agent takes a write action in a client's system — sending a message, updating a record, scheduling an appointment — it should first run in read-only mode long enough to demonstrate it produces correct outputs. No exceptions for "it's just a test environment."

**In practice:** Every agent spec has a "read-only phase" milestone before the "write access" milestone. The transition requires explicit client sign-off.

---

## 5. Clients own what we build

We do not architect lock-in. We use standard tools, document everything, and deliver a handoff package that allows a competent technical person to understand, modify, and extend the system without us. If we're irreplaceable because the system is opaque, that's a bug, not a business model.

**In practice:** Every engagement includes operator documentation, a tool manifest, and a recorded handoff session. The retainer offer is for ongoing improvement, not for keeping the lights on.

---

## 6. Price on value, not time

Our pricing reflects the value of the functional cluster being replaced, not the hours we spend building. A system that saves a dental group 40 hours/week of staff time and recovers 15% of their insurance pre-auth revenue is worth far more than "2 weeks of development at $X/day." We need to be able to articulate the value before we name a number.

**In practice:** Discovery always includes an attempt to quantify the current cost of the target workflow (staff hours, error costs, revenue leakage). That number anchors the proposal price.

---

## 7. No silent failures

If an agent can't complete a task, it surfaces the exception visibly. It does not fail quietly, skip the item, or substitute a lower-quality output without flagging it. Exception handling is a first-class requirement, not a nice-to-have.

**In practice:** Every agent spec has a required "exception handling" section that specifies what happens when the agent encounters: missing input, ambiguous input, external API failure, output below confidence threshold. If this section is empty, the spec is incomplete.

---

## 8. Slow down at compliance boundaries

Healthcare (HIPAA), legal (privilege), finance (FINRA/SEC) — these verticals have compliance requirements that are easy to violate accidentally with automation. We are not lawyers or compliance officers, but we are responsible for knowing where the boundaries are and flagging them.

**In practice:** Every vertical playbook has a "compliance considerations" section. When a client engagement touches PHI, privileged communications, or regulated financial data, we loop in their compliance counsel before building the integration, and we document what we were told.

---

## 9. One throat to choke

Each client engagement has one named point of contact on our side who owns the project end-to-end: scoping, build, integration, handoff. Not "our team" — a person. This creates accountability and makes us easier to work with.

**In practice:** The SOW template has a "Project Lead" field that names a specific person. If we don't have capacity to name someone, we don't take the engagement.

---

## 10. Compound the playbooks

Every completed engagement should make the next one faster. After every project close, the project lead is responsible for updating the relevant vertical playbook: what worked, what didn't, what the integration surprises were, what the client's actual objections were (not what we predicted), and what we'd scope differently next time.

**In practice:** Post-engagement debrief is not optional. The vertical playbook update is a deliverable of every engagement, even if the client never sees it.
