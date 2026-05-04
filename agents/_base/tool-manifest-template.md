# Tool Manifest — [TOOL NAME]

> Copy this template for every external system an agent integrates with. One manifest per tool per engagement.
> A completed manifest is required before any integration enters build.
> Delete this instruction block before filing the manifest.

---

## Header

| Field | Value |
|---|---|
| Tool / system name | |
| Provider / vendor | |
| Version / API version | |
| Manifest author | |
| Manifest date | YYYY-MM-DD |
| Client / engagement | |
| Agent(s) using this tool | (list all agents that reference this manifest) |
| Status | `draft` / `in-review` / `approved` / `active` / `deprecated` |

---

## What this tool does in this engagement

One paragraph. Describe specifically how this tool is used by the agent(s) in this engagement — not what the tool is in general, but what role it plays here.

> Example: "Dentrix is the practice's EHR. The intake agent reads from the patient record database to check for existing patients before creating a staged record. It writes to the staged patient queue (not the live patient record) during the read-only phase, and to the live patient record after write-access sign-off."

---

## Access type

| Permission level | Granted? | Scope |
|---|---|---|
| Read | yes / no | [Which data, which objects, which endpoints] |
| Write | yes / no | [Which objects, which fields, which actions] |
| Delete | yes / no | [Specify exactly — delete is almost never needed] |
| Admin / configuration | yes / no | [Should be no in almost all cases] |

**Write scope discipline:** Write permissions should be the minimum required for the agent to function. If the tool's permission model is coarse (e.g., "full access" or nothing), document this here and flag it as a compliance consideration.

---

## Authentication

| Field | Value |
|---|---|
| Auth method | API key / OAuth 2.0 / service account / webhook secret / other |
| Token scope | (what the token grants) |
| Token storage location | (where credentials are stored — never hardcode, never in git) |
| Token rotation policy | (how often credentials are rotated, who owns this) |
| Credential owner | (who at the client controls this credential) |

**Credential storage requirement:** All credentials must be stored in a secrets manager (e.g., environment variables, Doppler, AWS Secrets Manager) — never in code, never in this file. If the current storage method doesn't meet this standard, flag it.

---

## Endpoints and operations used

List every API endpoint, webhook, or database operation this integration uses. For each: method, path/query, purpose, and whether it's read or write.

| Operation | Method | Endpoint / query | Purpose | R/W | Notes |
|---|---|---|---|---|---|
| | GET / POST / PUT / PATCH / DELETE | | | R / W | |
| | | | | | |

**Webhooks received (if applicable):** Does this tool send webhooks to the agent? List event types and payload schema references.

| Event type | Trigger | Payload schema | Notes |
|---|---|---|---|
| | | | |

---

## Rate limits and quotas

| Limit type | Value | What happens at limit | Mitigation |
|---|---|---|---|
| Requests per minute | | | |
| Requests per day | | | |
| Concurrent connections | | | |
| Data volume limits | | | |

**Burst handling:** If the agent could trigger burst requests (e.g., batch processing a day's worth of records), describe how this is managed.

---

## Data touched

List every data field this integration reads or writes. Flag PII, PHI, and sensitive fields explicitly.

| Field name | Data type | R/W | PII? | PHI? | Privileged? | Notes |
|---|---|---|---|---|---|---|
| | | R / W / R+W | yes / no | yes / no | yes / no | |
| | | | | | | |

**Data residency:** Where does this tool store data? Is it relevant to HIPAA, GDPR, or the client's contractual requirements?

**Data retention:** How long does this tool retain data? Does this conflict with the client's data retention policy?

---

## Failure modes

For each failure mode: what causes it, how the agent detects it, and what happens next.

| Failure mode | Cause | Detection | Agent response |
|---|---|---|---|
| API unavailable (5xx) | Tool outage or network issue | HTTP 5xx response | Retry ×3 with exponential backoff (30s, 60s, 120s), then halt and alert |
| Authentication failure (401/403) | Expired or revoked token | HTTP 401/403 response | Halt immediately, alert project lead — do not retry auth failures automatically |
| Rate limit hit (429) | Too many requests | HTTP 429 response | Back off per Retry-After header, queue remaining requests |
| Malformed response | API returns unexpected schema | JSON parse failure or schema validation failure | Log raw response, halt task, alert |
| Partial write | Write operation succeeds for some records, fails for others | Mixed success/error responses | Log which records failed, surface to exception dashboard, do not retry without review |
| [Tool-specific failure mode] | | | |

---

## Compliance notes

| Area | Finding | Action required |
|---|---|---|
| HIPAA Business Associate Agreement | Does this tool have a BAA? Required if it touches PHI. | yes — on file / no — [STUB: must obtain before build] / not applicable |
| Data encryption in transit | Is data encrypted in transit (TLS 1.2+)? | yes / no / [STUB] |
| Data encryption at rest | Does the tool encrypt data at rest? | yes / no / [STUB] |
| SOC 2 / ISO 27001 | Does the vendor have a current audit report? | yes — on file / no / not applicable |
| GDPR / CCPA | If the tool processes EU or CA resident data, what are the implications? | [note] |

Any **[STUB]** in this section blocks build start.

---

## Sandbox / test environment

| Field | Value |
|---|---|
| Sandbox available? | yes / no |
| Sandbox URL / credentials location | |
| Sandbox data policy | (is the sandbox populated with real data? if yes, treat as production) |
| Parity with production | (what features or endpoints are missing in sandbox?) |

If no sandbox is available, describe how read-only validation will be conducted without a sandbox.

---

## Known issues and limitations

| Issue | Impact | Workaround / notes |
|---|---|---|
| | | |

---

## Deprecation and offboarding

When this integration is decommissioned (engagement ends, tool changes, client offboards):

- [ ] Revoke API credentials
- [ ] Remove webhook endpoints
- [ ] Archive this manifest with a `deprecated` status and the offboarding date
- [ ] Confirm with client that they have retained their own credentials and access

---

## Change log

| Version | Date | Author | Summary |
|---|---|---|---|
| 0.1.0 | YYYY-MM-DD | | Initial draft |
