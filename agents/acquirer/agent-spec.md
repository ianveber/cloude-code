# Agent Spec — Acquirer Agent

The Acquirer Agent is Veta's internal organic acquisition system. It monitors the agency's discoverability across search and AI answer engines, maintains the content production pipeline, tracks partnership and referral outreach, and surfaces qualified inbound signals. It does not run paid campaigns, manage social accounts, or generate cold outreach at scale.

This spec follows the same format as client agent specs. It's built, operated, and evaluated by the same standards.

---

## Header

| Field | Value |
|---|---|
| Agent name | `acquirer-veta` |
| Version | `0.1.0` |
| Spec author | Founder |
| Spec date | 2026-05-04 |
| Client / engagement | Internal — Veta |
| Project lead | Founder |
| Status | `draft` |

---

## Purpose

Monitor Veta's organic search and AI answer engine presence across target verticals, maintain the content production calendar, track referral and partnership outreach pipeline, and surface qualified inbound signals — so the founder spends time on discovery calls and delivery, not on tracking whether the content machine is running.

---

## Functional cluster

**Cluster name:** Organic acquisition
**Trigger:** Daily scheduled run (7:00 AM) + event-driven triggers (new inbound inquiry received, content published, partnership response received)
**Terminal output:** Weekly acquisition summary delivered to founder inbox; content calendar kept current; outreach pipeline tracked with next-action dates
**Vertical:** Internal (agency)

---

## Inputs

| Input | Source | Format | Required? | Notes |
|---|---|---|---|---|
| Search ranking data | Manual export or API (Ahrefs, Semrush, or Google Search Console) | CSV / API response | Optional (weekly) | Stub until SEO tooling is chosen |
| AI citation monitoring results | Manual search of Perplexity, ChatGPT, Claude, Gemini for target queries | Text log | Required (weekly) | See GEO monitoring protocol in `seo-geo-playbook.md` |
| Content calendar state | Notion database or flat file | Structured table | Required (daily) | Which pieces are in draft, review, published, overdue |
| Inbound inquiry log | Email inbox / CRM | Email thread or form entry | Required (event-driven) | New inquiry received = immediate trigger |
| Outreach pipeline | CRM or tracking spreadsheet | Structured table | Required (weekly) | Partnership and referral contacts: status, last contact, next action |
| Published content URLs | Content platform (website, LinkedIn) | URL list | Required (on publish) | Fed into GEO citation monitoring |

**Data sensitivity:** No PHI, no client data, no PII beyond business contact information in the outreach pipeline. Standard business privacy hygiene applies.

---

## Outputs

| Output | Destination | Format | Trigger condition |
|---|---|---|---|
| Weekly acquisition summary | Founder email | Markdown digest | Every Monday 7:30 AM |
| Content calendar alert | Founder notification | Bullet list | When any content item is 3+ days past its publish date |
| Inbound inquiry alert | Founder notification | Structured summary: source, company, vertical, stated need | Within 30 minutes of new inbound inquiry received |
| Outreach follow-up reminders | Founder notification | List of contacts with next-action date past due | Daily sweep if any items overdue |
| GEO citation report | Founder email | Structured table: query, engine, cited? yes/no, citation text excerpt | Weekly (part of acquisition summary) |
| Stale content flag | Founder notification | List of published pieces with no update in 90+ days that rank for tracked keywords | Monthly |

---

## Agent logic

### Daily run (7:00 AM)

1. Check content calendar for items past their publish date
   - If any item is 1–2 days past: log, include in weekly summary
   - If any item is 3+ days past: send immediate alert to founder with title, assigned owner (if any), and original publish date
2. Check outreach pipeline for contacts with a next-action date on or before today
   - Generate the day's follow-up reminders list
   - If list is non-empty: send to founder before 8 AM

### Event-driven: new inbound inquiry

Trigger: new email or form submission matching inbound inquiry pattern (keywords: "interested in", "question about", "wanted to reach out", contact form submission from website)

1. Parse the inquiry: extract sender name, company name, company type (infer vertical from name/domain if possible), and stated need
2. Check if sender is already in the outreach pipeline or active engagement list
   - If yes: flag as existing contact re-engaging, surface prior context
   - If no: create a new pipeline entry with status "inbound — uncontacted"
3. Send inbound inquiry alert to founder within 30 minutes with:
   - Sender name and company
   - Inferred vertical (or "unclear")
   - Stated need (quoted directly from their message)
   - Suggested next action: "Schedule discovery call" (link to calendar) or "Review prior context" (if existing contact)
4. Log inquiry receipt timestamp — flag if founder has not responded within 24 hours (one reminder only)

### Weekly run (Sunday 6:00 PM — for Monday morning delivery)

1. **GEO citation check:** Run the monitored query list (from `seo-geo-playbook.md`) against Perplexity and one other AI engine. Log: was Veta cited? If yes, what was the citation text? If no, who was cited instead?
2. **Content calendar review:** Pull current state of all content items. Categorize: on track, late (1–7 days), very late (8+ days), published this week.
3. **Outreach pipeline review:** Pull all contacts. Identify: new responses received this week, follow-ups that are due, contacts that have gone cold (no response in 21+ days after 2 follow-ups).
4. **Inbound summary:** Count new inbound inquiries for the week, source attribution (content, referral, direct, unknown), vertical breakdown.
5. **Compile and send weekly acquisition summary** (see output format below).

### Monthly run (first Monday of month)

1. Check all published content pieces. For any piece published 90+ days ago that is tracked for a keyword or query: flag for review. Has it been updated? Does it still accurately represent current positioning, pricing, and capability? Is it being cited in AI engines?
2. Generate stale content report.
3. Review partnership pipeline: any partners who have been in "active" status for 60+ days without generating a referral? Flag for reassessment.

---

## Weekly acquisition summary format

```
## Veta Acquisition Summary — Week of {DATE}

### Inbound
- New inquiries: {N} ({vertical breakdown})
- Sources: {content: N | referral: N | direct: N | unknown: N}
- Inquiries requiring follow-up: {list with names and inferred verticals}

### GEO / AI Visibility
{For each monitored query:}
- Query: "{query text}" | Engine: {engine} | Cited: yes/no | Notes: {excerpt or "competitor cited: name"}

### Content Pipeline
- Published this week: {list with titles and URLs}
- Late (needs attention): {list with titles and days overdue}
- On track for next week: {list with titles and target dates}

### Outreach Pipeline
- New responses this week: {N} ({names})
- Follow-ups due this week: {list with names and suggested message}
- Gone cold (21+ days, 2 follow-ups): {list — consider archiving or changing approach}

### Actions for founder this week
1. {Specific action — e.g., "Respond to [name] at [company] — inbound inquiry 2 days ago, no response yet"}
2. {Specific action — e.g., "Review and approve '[content title]' — 5 days past publish date"}
3. {Specific action — e.g., "Follow up with [partner name] — 14 days since last contact"}
```

---

## Tools and integrations

| Tool / system | Action type | Manifest file | Status |
|---|---|---|---|
| Email inbox (Gmail) | Read — inbound inquiry detection | tool-manifest-gmail.md | Stub — create at setup |
| Content calendar (Notion or flat file) | Read/Write — calendar state | tool-manifest-notion.md | Stub |
| CRM / outreach tracker (Notion, Ahrefs, or spreadsheet) | Read/Write | tool-manifest-crm.md | Stub |
| Perplexity (web) | Read — GEO citation check | n/a — web query | Manual until automated |
| Google Search Console | Read — keyword and click data | tool-manifest-gsc.md | Stub |

Note: several integrations are stubs. The Acquirer Agent starts partially manual (the founder runs the GEO checks and feeds results in) and becomes more automated as integrations are built. Version 0.1.0 handles the calendar, outreach reminders, and inbound alerts. GEO monitoring automation is Version 0.2.0.

---

## Exception handling

| Exception | Trigger | Agent behavior | Human notification |
|---|---|---|---|
| Inbound inquiry ambiguous (can't determine if it's a prospect or spam) | Sender domain is generic (Gmail, Hotmail) with no company name | Flag as "ambiguous inbound" rather than creating a pipeline entry | Alert with full message text — founder decides |
| Content calendar item has no owner and no publish date | Item exists in calendar without required fields | Flag as incomplete content item | Weekly summary includes a "content items missing fields" list |
| GEO check inconclusive | AI engine changes its response format or blocks automated queries | Log as "check failed" | Weekly summary notes the failure; founder runs the check manually that week |
| Outreach pipeline contact unsubscribes or asks to be removed | Reply contains "unsubscribe", "remove me", "not interested" | Immediately mark as "do not contact", remove from follow-up queue | Alert to founder confirming removal |
| Email inbox connection fails | OAuth token expired or revoked | Log connection failure | Immediate alert — inbound inquiry detection is down |

---

## Known limitations and stubs

| Limitation | Impact | Resolution path |
|---|---|---|
| GEO monitoring is semi-manual in v0.1.0 | Founder must run AI engine queries weekly and feed results to agent | Automate via Perplexity API or web scraping in v0.2.0 |
| No CRM integration yet — outreach tracked in spreadsheet | Manual data entry required for outreach pipeline updates | Integrate with Notion or a lightweight CRM in v0.2.0 |
| Source attribution for inbound is imperfect | "Unknown" source will be common early on | Add UTM parameters to all content links; improve over time |
| Agent does not draft content | Content creation requires the founder | Founder writes; agent tracks, reminds, and distributes |
| No LinkedIn API integration | Content published on LinkedIn is not tracked automatically | Manual update to content calendar on publish; LinkedIn API in v0.3.0 |

---

## Compliance flags

No PHI, no PII beyond business contact info, no regulated data. Standard GDPR/CAN-SPAM compliance for outreach communications:
- Every outreach email includes a one-click removal option
- Removed contacts are never re-contacted
- No purchased contact lists — all outreach is to identified individuals in target verticals with a legitimate business interest basis

---

## Change log

| Version | Date | Author | Summary |
|---|---|---|---|
| 0.1.0 | 2026-05-04 | Founder | Initial spec — inbound alerts, content calendar, outreach reminders. GEO and CRM integrations stubbed. |
