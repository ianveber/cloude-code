# Agentic OS

Last updated: 2026-09-01

## Purpose

Ian's personal operating layer: n8n agents + one local file agent + Claude/Cursor memory + daily briefing.

## Agents

### n8n (ian199999.app.n8n.cloud)

| Agent | Workflow |
|---|---|
| Email | https://ian199999.app.n8n.cloud/workflow/4WwekqSJWqzix0AV |
| Calendar | https://ian199999.app.n8n.cloud/workflow/6vMBDHDVoYUiw3TY |
| Project | https://ian199999.app.n8n.cloud/workflow/t6H02QOssSDlYwFP |
| Knowledge | https://ian199999.app.n8n.cloud/workflow/wrMzV3d9EXsLZywL |

Status checks go through n8n MCP when available. This cloud session did not verify live toggle/last-run.

### Local

- **File Agent:** `launchctl list | grep veta.fileagent`
- Logs (Mac): `~/Documents/Obsidian Vault/Agentic-OS/04-Agent-Logs/file-agent/`
- **Research agent:** `agents/research-agent/research-agent.py` — 06:00 launchd, Haiku research / Sonnet synthesis, writes reports on the Mac desktop path

### Claude / Cursor

- Daily briefing: `CLAUDE.md` → `./reports/YYYY-MM-DD-daily-briefing.md`
- Shared memory: this folder (see [[SYNC]])
- Skills: `skills/agentic-os/`

## Expected Obsidian vault layout (Mac)

`/Users/ianveber/Documents/Obsidian Vault/Agentic-OS/`

- `00-Inbox/` — agent outputs needing review
- `01-Daily/` — Calendar Agent briefs
- `02-Projects/` — Project Agent reports
- `03-Contacts/` — contact notes
- `04-Agent-Logs/` — run logs
- `05-Knowledge/` — Knowledge Agent extractions
- `_System/` — config, prompts, templates

Plus `_claude-memory/` which must be the git folder after symlink.

## Dashboard

`agentic-os.html` in repo root.
