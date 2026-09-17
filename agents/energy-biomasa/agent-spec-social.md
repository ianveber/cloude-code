# Agent Spec — social-energy-biomasa

---

## Header

| Field | Value |
|---|---|
| Agent name | `social-energy-biomasa` |
| Version | `0.1.0` |
| Spec author | Cursor (continuing Claude + iPROM thread) |
| Spec date | 2026-09-17 |
| Client / engagement | Biomasa d.o.o. via iPROM (Maja Gorjanc) |
| Project lead | Ian Veber |
| Status | `read-only-phase` |

---

## Purpose

Drafts and queues Slovenian social posts for Biomasa's Facebook, Instagram, LinkedIn, and YouTube so iPROM can run a consistent heating-season calendar without the agent publishing anything.

---

## Functional cluster

**Cluster name:** Social publishing (organic)
**Trigger:** Operator opens `biomasa-social.html` and either (a) runs weekly mix or (b) generates one post from pillar + platform + note.
**Terminal output:** A queued draft with platform, body, hashtags, CTA, visual brief, and status `review`. Publishing is a human step outside this agent.
**Vertical:** Renewable heat / specialty industrial-consumer hybrid (not a Veta catalogue vertical; this is a named client cluster).

---

## Inputs

| Input | Source | Format | Required? | Notes |
|---|---|---|---|---|
| Pillar | Operator pick / weekly mix | enum | yes | See `content-pillars.md` |
| Platform | Operator pick | fb / ig / li / yt | yes | |
| Angle / extra note | Operator text | string | no | e.g. "S3v Turbo, no subsidy" |
| Live subsidy amounts | biomasa.si homepage | number + conditions | yes for pillar 1 | Re-check before generate |
| Named project facts | Already-public posts/news | site, kW, investor | yes for pillar 3 | No unpublished jobs |
| Brand voice | `brand-voice.md` | markdown | yes | baked into console |
| Optional Claude key | browser localStorage | Anthropic API | no | Console works without it |

**Data sensitivity:**
- [ ] PHI
- [x] PII (basic privacy hygiene) — do not pull commenter names into drafts
- [ ] Privileged
- [ ] Regulated financial data
- [ ] None of the above

---

## Outputs

| Output | Destination | Format | Trigger condition | Notes |
|---|---|---|---|---|
| Draft post | Approval queue in `biomasa-social.html` (localStorage) | JSON object | Generate or weekly mix | status starts `review` |
| Visual brief | Same object + Vizuali view | 4–8 lines | Always with a draft | For Higgsfield / designer; no auto-render |
| Clipboard export | Operator machine | text | status `approved` + Export | Ready to paste into Meta/LinkedIn UI |
| Weekly mix | Queue | 7 drafts | Button | Does not overwrite approved items |

**Schema (queue item):**

```json
{
  "id": "string",
  "created": "ISO-8601",
  "platform": "fb|ig|li|yt",
  "pillar": "string",
  "status": "review|approved|rejected|exported",
  "title": "string",
  "body": "string",
  "hashtags": "string",
  "cta": "string",
  "visualBrief": "string",
  "sourceNote": "string"
}
```

---

## Agent logic

1. Load brand voice, pillars, and any existing queue from localStorage.
2. If **weekly mix**: enqueue one draft per slot in the heating-season mix (kurilna, Fröling, reference, goriva, ljudje, ambassador, servis). Skip a slot if the operator marked it "already posted this week".
3. If **single generate**: interpolate the matching template (pillar × platform) with the operator note.
4. If an Anthropic key is present, rewrite the draft for tightness and Slovenian naturalness. If the rewrite invents a number, discard the rewrite and keep the template.
5. Scan for forbidden patterns: invented € amounts, English-first FB/IG, "revolutionary", unpublished project names.
6. Set status `review`. Never set `exported` automatically.
7. Human approves or rejects in the queue.
8. Export copies caption + hashtags + CTA. Operator pastes into the native app.

**Decision thresholds:**

| Decision | Threshold | Below-threshold behavior |
|---|---|---|
| Use Claude rewrite | Key present and rewrite contains no new digits/€ | Keep template |
| Allow subsidy post | Operator confirmed amounts match live site | Block generate with on-screen warning |
| Allow project post | Project appears in public news or LinkedIn | Block; ask for a public URL |

---

## Tools and integrations

| Tool / system | Action type | Manifest file | Status |
|---|---|---|---|
| Operator console | local read-write (browser) | — | active |
| Meta (FB/IG) | none (copy-out) | `tool-manifest-publishing.md` | draft — not connected |
| LinkedIn | none (copy-out) | same | draft — not connected |
| YouTube | none (copy-out) | same | draft — not connected |
| Higgsfield | brief only | same | draft — not connected |
| Anthropic Messages API | optional rewrite | same | optional |

---

## Exception handling

| Exception | Trigger | Agent behavior | Human notification |
|---|---|---|---|
| Missing platform or pillar | Generate with empty required field | Halt, no queue write | Inline error |
| Subsidy amounts stale | Operator did not confirm | Halt pillar-1 generate | Banner: re-check biomasa.si |
| Claude rewrite adds numbers | Digit/€ delta vs template | Discard rewrite | Toast "rewrite discarded" |
| Duplicate hook | Same first 40 chars as an item from last 14 days in queue | Still enqueue, flag `duplicate?` | Badge on card |
| External API unavailable | Anthropic 5xx / timeout | Keep template draft | Toast |
| Output empty | Template failure | Halt | Inline error |
| Publish requested | Any UI that would POST to a network | Not implemented | — |

**Exception dashboard:** the Čakalna vrsta view in `biomasa-social.html`.

**Escalation threshold:** Not automated. If iPROM rejects 3+ drafts in a day, pause mix and review voice.

---

## Compliance flags

**Vertical compliance context:** Consumer energy equipment + subsidies. Not HIPAA. GDPR applies to any commenter/customer data. Do not scrape private profiles.

| Compliance area | Applies? | Mitigation | Confirmed with client counsel? |
|---|---|---|---|
| HIPAA — PHI storage | no | — | not required |
| HIPAA — PHI transmission | no | — | not required |
| Attorney-client privilege | no | — | not required |
| FINRA/SEC | no | — | not required |
| GDPR / state privacy | yes | No commenter harvest; no auto-reply yet | no — flag before any inbox agent |
| Subsidy advertising (SI) | yes | Use live Eko sklad figures from the client site only | no — iPROM to confirm claims |

---

## Read-only phase

**Duration:** until iPROM signs off on 20 consecutive drafts (accuracy ≥ 95% on the eval rubric).
**Output review process:** Ian + Maja review the queue in the console (or exported .txt). No Meta login in this repo.
**Sign-off criteria:**

| Criterion | Target | Measurement method |
|---|---|---|
| Output accuracy | ≥ 95% | iPROM marks approved/rejected |
| Exception rate | ≤ 10% of generates | Queue flags |
| False facts | 0 invented kW / € / customers | Manual |
| Language | Slovenian native on FB/IG | iPROM |

**Sign-off required from:** Maja Gorjanc (iPROM) + Biomasa marketing owner + Ian Veber.

---

## Write-access phase

Not started.

**New write permissions enabled:**
- [ ] Meta Graph — create unpublished IG/FB container
- [ ] LinkedIn UGC — create post as organization
- [ ] YouTube — upload

**Monitoring during write-access phase:** first 10 live posts compared to approved queue text.
**Rollback:** delete the live post in the native UI; disable write flags in the manifest.

---

## Agent dependencies

| Dependency | Type | Required for | Status |
|---|---|---|---|
| Brand voice + pillars | docs | Copy | in-repo |
| Live biomasa.si subsidy banner | human check | Pillar 1 | not automated |
| iPROM approval | human | Any public post | required |
| Retoba ambassador | upstream product | Pillar 7 CTA | live, not ours |
| Higgsfield / designer | human or later tool | Visuals | optional |

---

## Known limitations and stubs

| Limitation / stub | Impact | Resolution path |
|---|---|---|
| Cannot read Claude's original .docx/.xlsx from Gmail MCP | Audit view is a public-source reconstruction | Drop files into `agents/energy-biomasa/source/` |
| No Meta/LinkedIn API | Operator pastes | Connect after sign-off |
| No live follower/insights pull | KPIs are manual | Meta Business Suite export |
| Instagram fetch timed out in build | IG audit incomplete | iPROM to paste last 12 posts |
| Claude API optional and currently unpaid on Ian's org | Rewrites may be off | Template path is the default |
| English UI labels mixed | Fine for Ian; iPROM may want full SL | Iterate after first review |

---

## Operator documentation summary

- Open `biomasa-social.html`.
- Confirm Eko sklad amounts on biomasa.si before subsidy drafts.
- Generate weekly mix on Monday.
- Approve in Čakalna vrsta. Export. Paste. Mark exported.
- Pause: stop using Export; do not connect APIs.

**Draft operator doc location:** this file + the console's Operator view.

---

## Change log

| Version | Date | Author | Summary of change |
|---|---|---|---|
| 0.1.0 | 2026-09-17 | Cursor | Initial read-only console + spec, continuing Claude/iPROM work |