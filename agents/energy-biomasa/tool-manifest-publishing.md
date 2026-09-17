# Tool Manifest — social publishing (copy-out)

## Header

| Field | Value |
|---|---|
| Tool / system name | Meta + LinkedIn + YouTube + optional Anthropic + Higgsfield briefs |
| Provider / vendor | Meta, LinkedIn, Google, Anthropic, Higgsfield |
| Version / API version | none live |
| Manifest author | Cursor |
| Manifest date | 2026-09-17 |
| Client / engagement | Biomasa d.o.o. via iPROM |
| Agent(s) using this tool | `social-energy-biomasa` |
| Status | `draft` |

## What this tool does in this engagement

In v0.1 the "integration" is the operator's clipboard. The console never calls Meta, LinkedIn, or YouTube. Optional Anthropic rewrite is browser-side to `api.anthropic.com` using a key the operator pastes into localStorage. Higgsfield is a brief generator only.

## Access type

| Permission level | Granted? | Scope |
|---|---|---|
| Read | no | Insights not connected |
| Write | no | No create-post endpoints |
| Delete | no | |
| Admin / configuration | no | |

## Authentication

| Field | Value |
|---|---|
| Auth method | none for publish; Anthropic API key optional in localStorage |
| Token scope | Anthropic: messages.create only, if used |
| Token storage location | `localStorage.biomasaAnthropicKey` — never commit |
| Token rotation policy | operator |
| Credential owner | Ian (Anthropic); iPROM/Biomasa (Meta/LinkedIn when later) |

## Endpoints and operations used

| Operation | Method | Endpoint / query | Purpose | R/W | Notes |
|---|---|---|---|---|---|
| Optional rewrite | POST | `https://api.anthropic.com/v1/messages` | Tighten Slovenian copy | R | Optional |
| Clipboard | — | navigator.clipboard | Export approved caption | R | |

No webhooks.

## Rate limits and quotas

| Limit type | Value | What happens at limit | Mitigation |
|---|---|---|---|
| Anthropic | account credits | Template path still works | Ian's org was out of credits as of 2026-09-10 |

## Known limitations

Meta Graph, LinkedIn organization posts, and YouTube uploads are **named stubs**. Do not implement write until iPROM + Biomasa sign the read-only phase.

Public account handles used in the console:

- Facebook: `facebook.com/biomasa.doo`
- Instagram: `instagram.com/biomasa_doo`
- LinkedIn: `linkedin.com/company/biomasa-d-o-o`
- Website: `biomasa.si`
- Ambassador: `ambasador.biomasa.si`