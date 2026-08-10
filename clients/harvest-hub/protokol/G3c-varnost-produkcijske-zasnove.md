# G3c — Hardening gate on the production design (before it is written)

**Subject:** the target architecture described in `G1-nacrt-ciljnega-stanja.md` (components K1–K16),
not the demo. The demo was audited separately in `G3a-varnost-obstojecega.md`.
**Standard:** `ai-infrastructure-protocol/pillars/5-security/SKILL.md` + `RUNBOOK.md` — 8 controls,
evidence-or-RED, deny-by-default, missing proof is never a skip.
**Run date:** 30. 7. 2026. **Mode:** read-only. No file under `demo/` was opened for writing.
**Gate verdict: RED — 9 reds, 6 unknowns, 4 passes.**

> **Why a RED here is cheap.** G3a found reds in a thing that already exists, where every fix costs
> a change. This gate runs against a design. Nine reds before the first line of production code is
> free to fix and expensive to discover later — three of them (the audit-trail shape, the ingest
> trust boundary, the platform owner) are structural and cannot be retrofitted without a rewrite.

---

## 0. What of the standard G3 is deliberately not here

The protocol's G3 assumes registered artifacts in `.protocol/artifacts.json`, per-control evidence
files, and `gate-check 3`. **None of that exists and none of it is created here.** There is one
engagement, one process, one operator; the evidence is inline where a reader will see it, exactly as
in G0–G3b. Also absent, and deliberately:

- **S3 in its standard form (RLS / pgTAP / tenant isolation).** There is one tenant. Harvest Hub is
  the only company whose data will ever be in this system. Running the protocol's multi-tenant RLS
  apparatus would be template-filling. What replaces it is the question that actually matters here —
  *which humans inside Harvest Hub may see Art. 9 documents* — and that is asked in §3.5 and left
  UNKNOWN, because it is theirs to answer.
- **Retainer-shaped controls.** No WAF, SIEM, pen-test, ISO/SOC posture, or 24/7 monitoring is
  proposed. They refused a retainer and did not buy operations. Where a control needs a standing
  owner, this document names the gap and says who must own it — it does not sell the owning.
- **Pricing for anything.** New work is marked, not costed. That is Ian's call, per G1 §0.

---

## 1. What is being audited

G1 names sixteen components. For the gate they type into five artifacts under the protocol's
applicability matrix, plus one layer that no document in this engagement has ever assigned to
anyone:

| # | Artifact | Components | Type | Controls that apply |
|---|---|---|---|---|
| **P1** | **Ingest + archive** — mailbox connector, immutable raw store | K1, K2 | automation | S1 S2 S4 S5 S6 S7 S8 |
| **P2** | **Reading engine** — classification + two-track extraction | K3, K4 | agent (reads untrusted third-party documents, drives a paid model) | S1 S2 S4 S5 S6 S7 S8 |
| **P3** | **Deterministic core** — controls, reshaping, confidence | K5, K6, K13 | library | S4 S7 S8 |
| **P4** | **Write connectors** — eDOKUMENTI, client match, insurance program | K7, K8, K12 | automation with write access to two systems of record | S1 S2 S4 S6 S8 |
| **P5** | **Console + outbound** — exception queue, document generation, chasing | K9, K10, K11 | app + outward-sending automation | S1 S2 S4 S5 S6 S7 S8 |
| **P6** | **Audit trail + alerting** | K14 | data store | S1 S2 S8 + storage limitation |
| **P0** | **Platform** — host, database, object store, secret store, network, backups, patching | *none — no K number exists* | infrastructure | every control above ultimately lands here |

**P0 is the finding of this gate.** Read §2.

---

## 2. The structural finding: every control lands on the one layer nobody bought

G2 measured that the demo has **no persistence of any kind** — no database, no auth store, no file
writes, no `localStorage`. Re-verified today: `grep -rE "localStorage|sessionStorage|indexedDB|writeFile|appendFile|createWriteStream|sqlite|postgres" lib/ app.js server.mjs index.html` returns
**zero hits**.

Every remaining component in G1 needs persistence: the immutable archive (K2), the idempotency store
for `Message-ID` (K1), the exception queue (K10), the chase clock (K11), the correction store (K15),
and the audit trail (K14). Persistence means a database, an object store, a host, a network boundary,
a secret store, backups, and someone who patches all of it.

The binding offer excludes exactly that layer, in two places:

> **Ni vključeno:** … infrastruktura in gostovanje; obratovanje in podpora po prevzemu.
> — `03-uradna-ponudba.md`, IZVEDBA

> Po prevzemu sistem upravljate vi; obratovanje, nadzor in podpora uporabnikom niso zajeti.
> — `03-uradna-ponudba.md`, JAMSTVO 3

And the client stated on 30. 7. that they do not yet have an AI provider account and asked us which
one to choose (`07-odgovori-harvest.md`) — i.e. the party the offer assigns P0 to is the party that
has told us in writing it has not done this before.

**This is not an argument for a retainer.** It is three concrete consequences that must be handled
inside what was already sold:

1. Every control in §4 needs a **named owner** before go-live, and for most of them the offer's
   default owner is Harvest Hub. If no name is written down, the control does not exist.
2. The handover package (already sold: *"Vključeni dokumentacija, usposabljanje in uvedba…"*) must
   include an **operations note** that states, per credential and per control, who owns it and what
   breaks if nobody does. That is documentation, not operations — it is inside scope.
3. The **12-month warranty covers defects, not operations.** A key that leaked because nobody
   rotated it is not a defect. Saying this in the handover document is cheaper than discovering it
   during an incident.

---

## 3. The six named exposures — ruled in or out

### 3.1 The mailbox connector — UNKNOWN today, and the answer changes the whole control set

The ingest mailbox is `ponudbe.merkur@harvest.si` (`03-uradna-ponudba.md`, OBSEG). What credential
that requires depends on what platform serves it, and **that cannot be determined from outside.**

Measured today by public DNS (`dig`, 30. 7. 2026):

| Query | Answer |
|---|---|
| `MX harvest.si` | `0 mail.harvest.si.` → A `212.44.106.43` |
| `MX harvesthub.si` | `0 posta.harvest.si.` → A `212.44.106.43` (**same host**) |
| `CNAME autodiscover.harvest.si` | `autodiscover.outlook.com.` |
| `TXT harvest.si` (SPF) | `v=spf1 ip4:212.44.120.177 ip4:212.44.106.43 +mx +a +include:spf.protection.outlook.com +include:_spf.google.com +include:spf.squalomail.com ip4:195.206.229.170 ip6:fe80:0:0:0:20c:29ff:fee2:8a26 ~all` |

The MX points at a hosting-provider mail server; autodiscover points at Microsoft 365; the SPF record
authorises Microsoft **and** Google **and** a marketing sender, ends in a softfail `~all`, and
contains an IPv6 link-local address (`fe80::…`) that can never legitimately send mail. That is a
domain that has been through at least two mail migrations and was never cleaned up. *(No connection
was made to `212.44.106.43`. Probing a client's production mail server is active reconnaissance
against a third party and was not performed.)*

Two branches, and the design must be written against whichever is true:

**Branch A — the mailbox is on Exchange Online.** Then a properly scoped credential is achievable
and provable. Verified in Microsoft's current documentation (fetched 30. 7. 2026,
*Role Based Access Control for Applications in Exchange Online*):

- Grant `Application Mail.Read` to a dedicated app service principal, scoped with
  `New-ManagementRoleAssignment -App <sp> -Role "Application Mail.Read" -CustomResourceScope <scope>`
  where the management scope resolves to **exactly the one ingest mailbox**.
- `Application Mail.ReadBasic` looks safer but is useless here: it reads email *"except the body,
  previewBody, **attachments**"* — and the attachments are the entire payload.
- **The trap, documented by Microsoft and worth quoting because it silently voids the whole
  control:** if the same app also holds an unscoped `Mail.Read` consent in Entra ID, the two grants
  are a union and the result is *"no effective resource scoping"*. The Entra grant must be removed.
- **Proof is one command:** `Test-ServicePrincipalAuthorization -Identity <app> -Resource <mailbox>`
  must return `InScope: True` for `ponudbe.merkur@harvest.si` and `False` for any other mailbox.
  That output is the S2 evidence for P1.

**Branch B — the mailbox is on `mail.harvest.si` (IMAP at the hosting provider).** Then there is no
scoping mechanism at all. An IMAP username and password is a full-mailbox credential: read *and*
delete, frequently the same password as the webmail login, frequently also valid for SMTP send-as,
and impossible to reduce to read-only. In that branch the compensating controls are mandatory, not
optional: a mailbox that receives nothing but Merkur traffic (it already does), a password used by
nothing else and never reused for webmail, storage in a secret manager rather than a config file,
a source-IP allowlist on the mail server if the provider supports one, and a robot that never issues
a destructive IMAP command — read and flag, never `EXPUNGE`, never `MOVE`.

**Ruled in as a real exposure, verdict UNKNOWN.** Settled by one question to their IT: *is
`ponudbe.merkur@harvest.si` an Exchange Online mailbox or an IMAP account on your mail server?*
This belongs in Faza 0 alongside item 3 (the raw `.eml`) — the same one file answers both.

**One rule that holds in both branches:** the ingest identity is **read-only**. K11 (chasing
signatures) must send from a *separate identity on a separate mailbox*. A single credential that can
both read the Art. 9 inbox and send mail as the company is the god-token the standard forbids.

**And the bigger prize is not the mailbox.** K2, the immutable raw archive, will hold every document
Harvest Hub has ever received — a single location with more Art. 9 data than the mailbox itself, and
no natural expiry. It needs encryption at rest, an access list shorter than the console's, and a
retention clock that does not exist yet (Faza 0 item 8, unanswered).

### 3.2 The ingest trust boundary — RED, and nobody has named it before

The design authenticates nothing on the way in. `PLAN-prenos-zero.md` §① specifies only idempotency
on `Message-ID`. G1's N6 proposes going further and treating the **e-mail subject line** as a
classification and folder-naming source, because G0 measured that it is structured
(`Harvest Hub …: <PRIIMEK IME>, MERKUR <PRODUKT>, <št. ponudbe>`).

Measured today (`dig TXT _dmarc.*`, 30. 7. 2026):

| Domain | DMARC policy |
|---|---|
| `merkur-zav.si` — **the sender the robot will trust** | `p=none; sp=none; pct=100` |
| `harvest.si` | `p=quarantine; sp=quarantine; pct=100` |
| `harvesthub.si` | `p=none; sp=none` |

Merkur's SPF is strict (`-all`), but their **DMARC policy is monitor-only**. Whether a forged
`From: eponudbePOS@merkur-zav.si` is rejected therefore depends entirely on how the receiving server
at `212.44.106.43` is configured — which is unknown and outside our control.

**Why this matters more here than in a normal mail robot.** In the target design, a packet that
passes classification is read, written into eDOKUMENTI, eventually written into the Zavarovalniški
program, and — in variant B — causes a KLP and a Privolitvena izjava to be generated and sent to the
address the packet claims belongs to the customer. So an unauthenticated inbound channel reaches
(a) a write path into a regulated system of record and (b) an outbound channel that mails documents
to an attacker-chosen recipient. The human confirmation on exceptions (A7) bounds the blast radius
but does not close it, because a well-formed forgery produces no exception.

**The fix is cheap and must be in the design, not bolted on:** trust is derived from the receiving
MTA's `Authentication-Results` header — SPF `pass` for `merkur-zav.si` **and** DKIM `pass` with
`d=merkur-zav.si` — never from the `From:` string and never from the subject pattern. Anything that
fails goes to the exception queue as *unverified sender*, never to the write path. The existing
deterministic controls (offer-number shape, product-family cross-check, the 545 gate) then act as a
second layer, which is what they are for.

**Owner:** AIS (design). **Proof:** the Faza 0 `.eml` (item 3) shows whether their server even writes
an `Authentication-Results` header. If it does not, the connector must evaluate SPF/DKIM itself.

### 3.3 Write access into two systems of record — RED on rollback, UNKNOWN on privilege shape

Three separate issues, only one of which anyone has written down:

1. **The search right is wider than the write right.** K7 (find-or-create client) needs to search
   Harvest Hub's entire client base by e-mail and davčna. That is broad read access over every
   customer they have, granted to an automated process. The write is one record; the search is all
   of them. Whichever is easier to get from the vendor, the *search* is the one to scope and log.
2. **No rollback design exists — RED.** Nothing in G1, `PLAN-prenos-zero.md`, or the offer says what
   happens when a write half-succeeds: documents pushed, metadata failed; client created, offer
   record failed. Without per-offer transaction state and a compensating action, the audit trail
   records a success for a partial write, and the second attempt creates the duplicate that K7 was
   built to prevent. This must be designed before K8, not discovered during the acceptance test.
3. **Least privilege in their systems — UNKNOWN.** The robot must hold a **dedicated named service
   account** in each system, appearing under its own name in *their* audit trail, without delete or
   overwrite rights on existing records. Whether eDOKUMENTI supports a non-human account with a
   restricted role is not known. Add to the Faza 0 vendor questions (currently items 11–13).

**A hard precondition, raised in severity from where the offer leaves it.** The offer asks for test
environments for both systems within 10 working days (IZVEDBA); G1 lists it as Faza 0 item 14. For a
system that writes into a regulated system of record, testing the write connectors against
production is not an inconvenience, it is unacceptable. If no test environment exists, that is not a
schedule risk — it is the trigger for the offer's existing "no API / no test environment" clause,
which is priced separately. Say it on the call.

### 3.4 The AI sub-processor — PASS-able, currently unproven, with two traps

`G3b-ponudnik-in-regija.md` settled the region question: the first-party Anthropic API rejects `eu`
outright, Amazon Bedrock `eu-central-1` is the recommendation. Three facts verified in AWS
documentation today (30. 7. 2026) sharpen it into controls:

**Default posture is good, and it is a documented default, not a promise.** From
*Amazon Bedrock abuse detection*: Bedrock uses a **zero operator access** model — *"no operators of
the service can access model input or output"* — and a **zero data retention** model — *"by default,
Amazon Bedrock does not store model inputs or outputs."* From *Data protection*: because model
providers have no access to the deployment accounts, *"they don't have access to Amazon Bedrock logs
or to customer prompts and completions."*

**Trap 1 — the default is per-model, and some models require the opposite.** The same page states
that for certain newer models (named at the time of reading: Claude Fable 5, and Claude Mythos 5 on
the retention page) inputs and outputs are retained up to 30 days and the customer must **opt in to
sharing retained traffic with Anthropic for abuse detection and potential human review.** For Art. 9
health data about children, "potential human review by a third-country company" is a categorically
different data-protection position from anything the client has been told. It must never happen by
accident because someone upgraded a model string.

**The control, and it fails closed.** Bedrock exposes a retention mode at account and project level.
Setting `data_retention_mode: none` means *"No request or response data is written to durable storage
by AWS or shared with the model provider"*, and if a model requires retention **the request is
blocked with an error** rather than silently retained. It can be locked organisation-wide with an
SCP denying any other value (`bedrock:DataRetentionMode` / `bedrock-mantle:DataRetentionMode`
condition key). One API call plus one policy, and the failure mode is a broken build rather than a
silent disclosure. **This is the single highest-value production control in this document.**

**Trap 2 — the client can build an Art. 9 data lake in their own account by ticking one box.** From
*Monitor model invocation using CloudWatch Logs and Amazon S3*: model invocation logging is
*"disabled by default"*, but once enabled it writes `input.inputBodyJson` — *"the request body sent
to the model"* — to S3 or CloudWatch, with bodies over 100 KB and all binary data (i.e. the rendered
page images of the vision track) stored as separate S3 objects, and *"logs are stored until the
logging configuration is deleted"* — no automatic expiry. Someone debugging a bad extraction six
months after handover will find this switch. The handover documentation must name it as a
prohibition and give the alternative: log metadata and token counts, never bodies.

**Trap 3 — cross-region inference.** The retention page states that where retention applies and
cross-region inference is enabled, *"retained inputs and outputs are stored in destination regions."*
So the EU claim depends on the inference profile being EU-scoped, which must be verified in the
console at account opening, not assumed. Faza 0 item 16 already covers "which models" — extend it to
"which regions the profile can reach."

**Verdict: UNKNOWN-but-closable.** All three become provable on day 1 of Faza 0. The account is the
client's (offer POGOJI), so the client configures and AIS specifies.

### 3.5 The exception console — RED (no auth design exists), plus one client question

By construction, K10 displays the least-certain personal data, side by side with the source document.
It is a full-fidelity Art. 9 document viewer with a permanent queue. It is also, per JAMSTVO 2, the
place where a named human takes legal responsibility for a value:

> Kadar sodelavec podatek ročno sprosti, je to odločitev naročnika in se zabeleži v revizijsko sled.
> — `03-uradna-ponudba.md`, JAMSTVO 2

That sentence is a hard requirement, and it has consequences nobody has written down. **There is no
authentication design for the console anywhere in G1, the plan, or the offer.** RED. The minimum it
must have, each derived from a stated requirement rather than from habit:

| Requirement | Because |
|---|---|
| Per-user identity (no shared login) | The audit trail must name *which* employee released a value, or JAMSTVO 2 has no subject |
| Real authentication + MFA | Art. 9 data; an IP allowlist is not authentication |
| Session expiry + idle auto-lock | The queue sits open on a desk all day, by design |
| Source PDFs served through the app's auth | G3a R-2 is the exact failure mode: a static route that served real client PDFs with no auth. Do not rebuild it at scale |
| No personal data in application logs, error bodies, or the weekly report | The demo already does this (`safeName()` masks names in the run log, and three of fifteen real sample files carry a customer name in the filename). Carry it forward |

**The one question that is theirs, not ours (UNKNOWN):** may every Harvest Hub employee see every
customer's health documents, or is there a role boundary? The protocol's RUNBOOK §3.1 asks the client
for one sentence per system on who may see what; that sentence has not been asked for or given. This
is the honest local form of S3: not tenant isolation (there is one tenant) but **need-to-know inside
one small company handling Art. 9 data**. One line from them settles it, and it must be settled
before the console is built, because retrofitting a role boundary onto a queue is a rewrite.

### 3.6 The immutable audit trail — RED, and it is a design conflict, not an oversight

The offer sells it:

> Vsak korak zabeležen (kdo, kdaj, kaj) — nespremenljiva sled, ki podpira vaše zahteve po
> sledljivosti iz GDPR in ZZavar-1.
> — `03-uradna-ponudba.md`, OBSEG

The only written design for it says:

> Immutable per-offer trail: every step, every actor (robot or named human), **before/after**,
> timestamped.
> — `PLAN-prenos-zero.md`, §⑦

**Those two sentences together create the largest personal-data store in the system and make it
permanently unerasable.** "Before/after" for this process means names, addresses, dates of birth,
tax numbers, and the corrected values of health-related fields — stored in a log whose defining
property is that it cannot be changed. That collides directly with storage limitation (Art. 5(1)(e)),
rectification (Art. 16) and erasure (Art. 17), and with clause 7 of the evaluation DPA, in which AIS
promises to *help the controller answer* exactly those requests.

**The resolution, and it costs nothing if decided now:** the trail records **references and
decisions, not values.**

- Store: offer id, document hash, **field name**, the decision (`read` / `held` / `released by
  <user>` / `written`), the confidence or provenance, actor id, timestamp, and a pointer to the
  versioned operational record.
- Where proving *what* a human changed genuinely matters, store a **hash of the old and new value**
  alongside the field name — enough to prove a change occurred and to verify a claimed value, not
  enough to be a copy of the data.
- The values themselves live in the operational store, which is erasable, correctable, and subject to
  the retention period.

Then an erasure request is satisfiable: the operational record goes, and the immutable log still
proves that decisions were taken about record X, without containing anything about a person. The
accountability record survives the erasure it is supposed to coexist with.

**Two supporting points.** First, "immutable" needs a definition in the design, not an adjective:
an append-only table with `UPDATE`/`DELETE` revoked plus periodic hash-chaining is achievable and
provable; WORM object storage is stronger; *"we won't change it"* is not immutability. Second, the
build already has the right instinct — G2 measured that `runstats.js` ships with a test asserting the
module contains nothing monetary. **The same discipline, applied to personal data in K14, is the
control:** a test that fails if the audit writer is handed a value where it expects a field name.

**Blocked on:** retention periods under ZZavar-1 and their internal policy, still unanswered
(Faza 0 item 8; the reply received was generic). Without a number, the archive, the audit trail and
the object store cannot be configured. One unanswered question blocks three components.

### 3.7 Handover — RED on the operational boundary

On the day the last invoice is paid, Harvest Hub owns: an AWS account with Bedrock access, a host, a
database of Art. 9 personal data, an immutable archive of every document ever received, write
credentials into two core systems, a mailbox credential, and a console reachable by their staff.
They also own, from that moment: key rotation, patching, backup verification, log review, incident
response, and the retention clock.

The offer transfers all of that and explicitly excludes operating any of it. The client has told us
in writing they have no AI provider account yet. **The gap is not that they refused a retainer — it
is that nobody has written down what they are being handed.** That is documentation, which is sold.

The handover package must therefore contain, at minimum:

1. A **credential inventory** — every key and account, what it can do, where it is stored, who owns
   it, and the rotation procedure for each.
2. **"If a key leaks, do this"** — a half-page runbook, naming who to call and in what order.
3. The **named prohibitions** — do not enable Bedrock model invocation logging; do not change
   `data_retention_mode` away from `none`; do not grant the ingest identity send rights.
4. A **retention and erasure runbook** — how to honour an Art. 17 request across the archive, the
   database, the audit trail, backups, and the two client systems. This is the operational half of
   §3.6 and it cannot be written until the retention periods exist.
5. A **restore test performed once, with them watching** — a backup nobody has restored is not a
   backup, and this is the one control that is free to prove during the training workshops that are
   already in scope.
6. A **named internal owner** at Harvest Hub before go-live, and a monitored destination for the
   robot's alerts. An alert routed to an unread mailbox is not alerting.
7. One sentence stating that the **12-month warranty covers defects, not operations.**

**Also a secrets consequence specific to handover, and it is easy to miss:** the source code
transfers to the client. Anything ever committed to that repository — a key, a test fixture with real
data, a connection string — transfers with it, and then to anyone they later share it with. The
production repository must be private from the first commit, with a versioned pre-commit secret scan
(G3a found the current protection is a *local, unversioned* hook), and the acceptance-test corpus of
100 real offers must never be committed at all.

---

## 4. The gate table

`PASS` requires a file, a command output, or a line of source. Everything else is `RED` or `UNKNOWN`.
Nothing here is graded on intent.

### 4.1 The protocol's eight controls, applied to the production design

| Control | Verdict | Evidence, or what would settle it | Owner |
|---|:--:|---|---|
| **S1 · Secrets — nothing sensitive in code, client, or history** | **UNKNOWN** | Nothing built, nothing leaked: `git ls-files clients/harvest-hub` returns **empty** (nothing ever tracked) and the sample data now sits outside the tree in `~/ais-client-data/harvest-hub` (`drwx------`) — both re-verified today, closing G3a R-1. But **no secret store is named anywhere in the design.** Settled by: naming AWS Secrets Manager / SSM Parameter Store in the Faza 0 architecture note, plus a versioned pre-commit scan on the production repo. | AIS |
| **S2 · Auth + least privilege** | **RED** | Three of the four credentials the system needs have no defined shape: the mailbox identity (§3.1, branch unknown), the two write identities (§3.3, service-account support unconfirmed), and the console's user identities (§3.5, **no auth design exists at all**). Only the AI credential has a defined shape. Settled by: one IT question + two vendor questions + a console auth design. | AIS + client + eDOKUMENTI vendor |
| **S3 · Data access** | **N/A as written · RED in local form** | One tenant, so RLS/tenant isolation does not apply — stated once, not padded. The applicable question is need-to-know **inside** Harvest Hub (§3.5) and it has never been asked. Settled by: one sentence from the client on who may see what. | client |
| **S4 · Input validation** | **RED** | Two gaps. (a) **Sender authentication is absent from the design** (§3.2) — the trust decision is made on an unauthenticated `From:` against a `p=none` sender domain. (b) Model output drives a **write into a system of record**, so G3a's "partial injection defence" (untrusted text correctly in the user position, no data-not-instructions framing, no source-substring check) changes severity: in the demo a bad value lands on a screen a human reads; in production it lands in a regulated record. Required: typed output schema with rejection on violation, a source-substring check for values claimed to be read off the document, and the three deterministic cross-checks already sold (davčna mod-11, premija × frekvenca, cross-document consistency). Nothing the model emits may become a filename, a path, an SQL fragment, or HTML. | AIS |
| **S5 · Abuse / cost ceiling** | **RED** | The standard's "unauthenticated AI endpoint" does not exist here — the trigger is inbound mail, so **the mail channel is the abuse surface**, and it is open to anyone who learns the address. Nothing in the design caps it. Required: a per-hour and per-day processing ceiling that fails closed into the exception queue, a maximum attachment size and page count per packet, and an AWS Budgets alarm on the Bedrock account. Also carry forward G3a R-3 — if the console reuses the demo's server shape, it ships an unauthenticated, unlimited AI endpoint. | AIS + client (budget alarm on their account) |
| **S6 · Agent safety** | **PARTIAL → RED** | Good: G1 already gates the two irreversible actions on a human (ambiguous client → K10; exception confirmation → A7), and the justifications are external (contractual liability, permanence of the error), which is what the standard demands. Missing: (a) **no rollback for a partially-successful write** (§3.3) — an act-then-fail with no compensating action; (b) **no egress allowlist** — K11 sends outward, and the recipient address is read out of a document that arrives over an unauthenticated channel (§3.2). Required: an egress allowlist for outbound mail and a rule that a recipient address derived from an unverified packet never receives a generated document. | AIS |
| **S7 · Dependency / supply chain** | **RED** | The demo is clean (1 prod dependency, `npm audit` 0 vulnerabilities — G2). Production will not be. There is **no CI, no pinned runtime, and no documented build** (G2's hard red: it ran on node v22.22.3 today because that is what the building machine has; the harness silently needs python3 + PyMuPDF and a Chrome at a hardcoded macOS path). Handover delivers code the client may not be able to rebuild, and inherits a patching duty nobody has told them about. Settled by: a pinned runtime, a lockfile in the handed-over repo, an audit step, and a one-page "how to rebuild this" in the handover pack. | AIS |
| **S8 · Output hygiene** | **RED** | No CSP, no security headers, no error-shape policy exists for the console because the console does not exist. Carry forward G3a's two minor reds so they are not rebuilt: the 400 handler returned `String(e)`, and `JSON.parse` errors embedded a snippet of the input — which in production means echoing document text back to its caller. Required: caller-scoped responses, generic error bodies with a correlation id, debug off, CSP present, no wildcard CORS. | AIS |

### 4.2 The six named exposures

| # | Exposure | Verdict | Evidence / what settles it | Owner |
|---|---|:--:|---|---|
| **E1** | Mailbox connector holding credentials to an Art. 9 inbox | **UNKNOWN** | DNS is ambiguous (§3.1): MX → hosting provider, autodiscover → Microsoft 365. Branch A is provable with `Test-ServicePrincipalAuthorization`; branch B has no scoping and needs compensating controls. One question to their IT settles it. | client IT |
| **E2** | Ingest trust boundary (unauthenticated inbound → write path) | **RED** | `_dmarc.merkur-zav.si` = `p=none` [M, dig 30.7.]; the design authenticates nothing beyond `Message-ID` idempotency. Fix = trust `Authentication-Results` (SPF+DKIM), never `From:` or the subject. Faza 0 item 3 (`.eml`) proves whether the header is even present. | AIS |
| **E3** | Write access into two systems of record | **RED (rollback) · UNKNOWN (privilege shape)** | No partial-write recovery exists in any document. Service-account support in eDOKUMENTI unconfirmed. The **search** right (K7) is wider than the write right and needs its own scope and log. Test environments are a hard precondition, not a schedule item. | AIS + eDOKUMENTI vendor |
| **E4** | AI provider as sub-processor / third-country transfer | **UNKNOWN-but-closable** | Bedrock is ZOA + ZDR **by default** [AWS docs, fetched 30.7.]; `data_retention_mode: none` + an SCP makes it enforceable and fails closed; invocation logging is off by default but writes full prompt bodies with no expiry if enabled; retained data follows the inference region. All three verifiable on day 1 of Faza 0. | AIS specifies · client configures |
| **E5** | Exception console displaying the least-certain personal data | **RED** | No authentication design exists. JAMSTVO 2 requires per-user identity or it has no subject. Need-to-know inside the company is unasked (§3.5). | AIS + client |
| **E6** | Immutable audit trail vs. personal-data store | **RED** | `PLAN-prenos-zero.md` §⑦ stores **before/after values** in an immutable log — unerasable Art. 9 data, in direct tension with the DPA's own clause 7. Fix = references, decisions and hashes, never values (§3.6). Blocked on the unanswered retention periods. | AIS (design) + client (retention periods) |
| **E7** | Handover of code and operational control | **RED** | The offer transfers everything and excludes operating anything; the client has no AI account and has asked us to choose for them. Seven-item handover pack in §3.7, all of it inside the already-sold documentation and training. | AIS + client (must name an owner) |

**Tally: 9 RED · 6 UNKNOWN · 4 PASS-or-N/A.** Every red is a design decision, not a code defect.
None of them costs anything today; six of them are unfixable-without-rewrite after build.

---

## 5. Minimum controls before the first real client document is processed

**The trigger is earlier than anyone is planning for.** The offer promises *"Prve rezultate branja na
svojih dokumentih vidite v tretjem tednu"* (IZVEDBA). That is the first real production document —
week 3, not go-live, and long before the platform exists. The list below is split by that reality.

### Block A — before the first real document touches any AIS-built code (week 3)

| # | Control | Proof it exists | Owner |
|---|---|---|---|
| A1 | **The production DPA is signed** (§6). The evaluation DPA does not cover this and says so itself. | Signed document | Ian + client |
| A2 | **Bedrock account in `eu-central-1`, `data_retention_mode: none`, locked by SCP** | `GET /v1/data_retention` returns `none`; the SCP is attached | client configures, AIS specifies |
| A3 | **Model invocation logging confirmed OFF** | `GetModelInvocationLoggingConfiguration` returns no configuration | AIS verifies |
| A4 | **Inference profile confirmed EU-only** | Console screenshot / API listing of the profile's regions | AIS verifies |
| A5 | **Documents live outside every source repository, on an encrypted device** — G3a R-1's fix, held | `git ls-files` empty + files under `~/ais-client-data/…` (`drwx------`), re-verified today | AIS |
| A6 | **A named AIS access list** — who may open a real document, in writing | The list, per evaluation DPA §4 | AIS |
| A7 | **Retention periods obtained** from the client (ZZavar-1 + internal policy) | Their written answer — Faza 0 item 8 | client |

### Block B — before the first write into eDOKUMENTI or the insurance program

| # | Control | Proof it exists | Owner |
|---|---|---|---|
| B1 | **Sender authentication in the ingest path** — SPF+DKIM from `Authentication-Results`, unverified packets to the exception queue | A test that feeds a forged packet and asserts it is quarantined | AIS |
| B2 | **Scoped mailbox credential** — read-only, one mailbox, separate identity for outbound | Branch A: `Test-ServicePrincipalAuthorization` True for the ingest mailbox, False for another. Branch B: the compensating-control list, signed off | AIS + client IT |
| B3 | **Dedicated named service accounts** in both target systems, no delete/overwrite rights | The vendor's confirmation + the account visible under its own name in *their* audit trail | client + vendors |
| B4 | **Partial-write recovery** — per-offer transaction state and a compensating action | A test that kills the connector mid-write and asserts no duplicate and no false success in the trail | AIS |
| B5 | **Audit trail carries no personal values** — references, decisions and hashes only | A test that fails if the audit writer receives a value where a field name is expected (the `runstats.js` pattern) | AIS |
| B6 | **Volume and cost ceiling** — per-hour/per-day processing cap failing closed, max attachment size and page count, AWS Budgets alarm | The cap's configuration + a test that the N+1th packet queues rather than processes | AIS + client |
| B7 | **Console authentication** — per-user identity, MFA, session expiry, PDFs behind auth | An anonymous request to a console route and to a document URL returns 401/403 | AIS |
| B8 | **Written access rule from the client** — who inside Harvest Hub may see Art. 9 documents | One sentence from them, turned into a role in the console | client |
| B9 | **Test environments for both systems** — or the offer's "no test environment" clause is triggered and priced | Working test credentials | client + vendors |
| B10 | **Secrets in a secret manager, private repo, versioned pre-commit scan** | A clean scan output; the repo's visibility setting | AIS |

### Block C — before handover

| # | Control | Proof it exists | Owner |
|---|---|---|---|
| C1 | The seven-item **handover pack** of §3.7 | The document | AIS |
| C2 | A **restore test performed once, with them watching** | Done during a training workshop | AIS + client |
| C3 | A **named internal owner** and a monitored alert destination | Written into the handover minutes | client |
| C4 | **Acceptance-test corpus deleted**, deletion confirmed in writing | Confirmation letter, per the evaluation DPA §9 pattern | AIS |
| C5 | **AIS access revoked** on a stated date; any later warranty access is a fresh, logged, time-boxed event under written instruction | The revocation record | AIS + client |

Nothing in Blocks A–C widens the scope of `03-uradna-ponudba.md`. A2–A4, B1, B4, B5, B6 and B7 are
implementation properties of components already sold; A1 and C1–C5 are contract and documentation
that the offer already names.

---

## 6. Is the evaluation DPA sufficient for production? No — and it says so itself

**Verdict: `06-pogodba-obdelava-ocenjevanje.md` is correct, well-drafted and adequate for what it
covers, and it is not usable for production.** It is not a matter of tightening it. Copying it
forward would put AIS in breach on day one, because production inverts its factual premises.

Its own clause 1 anticipates this: *"Produkcijska obdelava se uredi z ločeno pogodbo pred Fazo 1."*

**Clauses that become false the moment production starts:**

| Clause | What it says | Production reality |
|---|---|---|
| §5(b) | *"Dokumenti se berejo lokalno na delovni postaji; datoteka se ne naloži na noben strežnik obdelovalca ali tretje osebe."* | Every document is uploaded to a server. That is the architecture. |
| §5(c) | Only the **text or rendered image of the first page** goes to the sub-processor. | G1: the target system reads the **whole packet**. |
| §5(d) | *"Podatkovne baze ne vzpostavi in podatkov ne shranjuje pri gostitelju ali v oblaku."* | A database, an object store and an archive are the core of the design. |
| §5(e) | The server process listens only on `127.0.0.1`. | A console reachable by their staff. |
| §6 | Anthropic PBC (USA) is the sole sub-processor; processing is not in the EU; third-country transfer under SCCs. | Correct **today**, and wrong the moment Bedrock `eu-central-1` is adopted — the sub-processor becomes AWS, contracted by the client, in the EU. |

**What the production agreement must add.** Twelve items; the first three are the ones that change
its shape rather than its wording.

1. **A role map across three phases, because the roles genuinely change.**
   (a) *Faza 0–1 development and testing on real data* — AIS is processor, Harvest Hub controller.
   (b) *The 100-offer acceptance test on live traffic* (required by JAMSTVO 1) — still AIS as
   processor, and this is the single largest volume of real data AIS ever touches; it needs naming.
   (c) *After handover* — the offer already says *"V produkciji rešitev teče na vaši infrastrukturi in
   pod vašim računom pri ponudniku AI — v tem delu ste upravljavec vi"*, so AIS has **no standing
   access**, AWS is the client's own processor under the client's own AWS agreement, and any warranty
   intervention that touches real data is a fresh, time-boxed, logged processing event under written
   instruction. Without this, the 12-month warranty is an undefined standing access right.
2. **The sub-processor chain, re-papered, not copied.** AWS (EU contracting entity) in `eu-central-1`
   as infrastructure processor; Anthropic named **only** if a model or route is used that shares data
   with the provider — and the agreement should **prohibit `provider_data_share` mode outright**
   (§3.4). If any leg still leaves the EU, name it and attach the Art. 46 basis. Adopting Bedrock EU
   is also what retroactively makes the "obdelava izključno znotraj EU" claim in the technical annex
   true; until then it remains false, and whether that annex was ever sent is still only Ian's to
   answer (Faza 0 item 18).
3. **Art. 32 measures rewritten for a server, not a laptop.** §5 is a good laptop-scale list and
   every line of it becomes inapplicable. Replace with: encryption at rest for archive, database and
   backups, with stated key management; network boundary; per-identity authentication with MFA for
   the console; least-privilege service accounts; secrets in a managed store; logging and monitoring;
   backups with a **tested** restore; patching; and an access-review cadence.
4. **Retention and erasure, per store** — archive, operational database, audit trail, object storage,
   backups, and the two client systems — with the ZZavar-1 periods that are still missing. This is
   where the immutability/erasure tension of §3.6 gets resolved in writing, not only in code.
5. **Data subject rights at production scale** — clause 7's 5-working-day assistance is fine, but it
   must be achievable across all six stores above, which requires the erasure runbook of §3.7.
6. **Breach notification, with a detection capability.** The 24-hour commitment in clause 8 is strong
   and should carry — but you cannot notify what you cannot see, so the agreement must reference the
   alerting and log review that make detection possible, and must say who notifies whom **after**
   handover (answer: it is theirs; AIS assists under warranty).
7. **Personnel and access** — clause 4's shape is right; production needs the named list maintained,
   and access to production data restricted to that list.
8. **Sub-processor change notice and an objection right** — clause 6's "no other sub-processor
   without written consent" is fine for one sub-processor and too rigid for a production stack;
   add a notice mechanism with an objection window.
9. **Deletion at the end of the engagement**, extended. Clause 9 is the strongest clause in the
   document and should be carried forward almost verbatim — including its exact concession
   (*"obdrži lahko le zapis o izmerjeni natančnosti brez osebnih podatkov"*), because an accuracy
   fixture built from 100 real offers is a permanent temptation to keep. Extend it explicitly to
   development copies, test fixtures and the acceptance-test corpus.
10. **A handover clause** — absent today. What AIS deletes, which access is revoked and on what date,
    and written confirmation of both.
11. **Art. 9 and children** — clause 11 already has it; carry forward unchanged.
12. **DPIA** — record that the controller has been informed a DPIA is likely indicated (Art. 9 data
    about children, 300–500/month) and that AIS supplies architectural facts under Art. 28(3)(f).
    The offer excludes authoring it and excludes legal opinions; do not drift across that line.

**One sentence for the meeting, if it comes up:** *the contract you have in front of you covers the
15 samples and the demonstration, and it deliberately stops there — production gets its own
agreement, before Faza 1, and it will be a different document because production is a different
system.* That is the DPA's own clause 1, said out loud.

---

## 7. Kasneje, ne zdaj

Not part of the purchased scope, not to be presented as necessary, recorded so it is not lost.

- **Their DMARC hygiene.** `harvesthub.si` — the domain printed on their own Privolitvena izjava —
  publishes `p=none`, and `harvest.si`'s SPF authorises three unrelated senders plus an impossible
  link-local address. Neither is our project and neither is billable. But once a robot is sending
  documents to their customers, the domain's spoofability becomes their problem in a new way. Worth
  one sentence to their IT, not a proposal.
- **A quarterly access review** of the four production credentials. Sensible, unbought, and exactly
  the kind of standing commitment they refused. Put it in the handover pack as a recommendation with
  no owner attached to AIS.
- **Cheaper model tier and prompt-cache repair** — carried over unchanged from G3b and G1 §9. Both
  only make an already-small bill smaller. Still not proposals.

---

## Appendix — what was actually run for this document

| What | Over what | Result |
|---|---|---|
| `dig MX / TXT / CNAME` (passive public DNS) | `harvest.si`, `harvesthub.si`, `merkur-zav.si` | §3.1, §3.2 tables. **No connection was made to any client host.** |
| `dig TXT _dmarc.*` | same three domains | `merkur-zav.si p=none`, `harvest.si p=quarantine`, `harvesthub.si p=none` |
| `grep -rE "localStorage\|sessionStorage\|indexedDB\|writeFile\|appendFile\|createWriteStream\|sqlite\|postgres"` | `demo/lib/`, `app.js`, `server.mjs`, `index.html` | zero hits — no persistence, confirming §2 |
| `git ls-files clients/harvest-hub` | the repository | empty — nothing under the client directory has ever been tracked |
| `ls -la ~/ais-client-data/harvest-hub` + `.claude/launch.json` | remediation state | data outside the tree (`drwx------`), `DEMO_SAMPLES` gone from the launcher — G3a R-1 and R-2 confirmed closed |
| Documentation read in full (fetched 30. 7. 2026) | AWS *Bedrock abuse detection*, *Data retention*, *Data protection*, *Model invocation logging*; Microsoft *RBAC for Applications in Exchange Online* | §3.1, §3.4 — every quoted sentence is from these pages |
| Documents read | `03-uradna-ponudba.md`, `06-pogodba-obdelava-ocenjevanje.md`, `07-odgovori-harvest.md`, `PLAN-prenos-zero.md`, `G0`, `G1`, `G2`, `G3a`, `G3b`, `pillars/5-security/{SKILL,RUNBOOK}.md` | — |

**No code was modified. No file under `demo/` was opened for writing. The paid accuracy harness was
not re-run** — it would re-send Art. 9 health documents to a `global`-region endpoint to re-confirm a
four-day-old number, which is not proportionate.
