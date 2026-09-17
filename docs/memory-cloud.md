# Veta Private Memory Cloud

Last updated: 2026-09-17

One private knowledge base and working memory for **ChatGPT, Claude, and Cursor**. They do not share chats. They share files. That is how they can continue each other's work without Ian re-explaining the business.

## What this is

The private cloud is this GitHub repo (`ianveber/cloude-code`), specifically the folder:

```
_claude-memory/
```

The repo is private. Git is the database. Every model that can read or write those files has the same knowledge.

| Surface | How it connects |
|---|---|
| **Cursor** (this agent) | Reads/writes `_claude-memory/` natively. Always-on rule: `.cursor/rules/memory.mdc`. |
| **Claude Code** | Same files via `CLAUDE.md` + `AGENTS.md`. |
| **Claude.ai Projects** | Project instructions + uploaded knowledge pack. Re-upload after big memory changes, or use GitHub MCP. |
| **ChatGPT** (GPT / Project) | Custom instructions + knowledge pack for offline context. **Live** sync via GPT Actions against the GitHub Contents API. |
| **Obsidian** (Mac) | Symlink to the same folder. Upgrade: `./scripts/upgrade-obsidian.sh` + `connectors/obsidian/setup.md`. |
| **Notion** | Human ops hub. Not a second memory dump. |

## Why git, not a new SaaS

Cursor Cloud and Claude Code already live in this repo. ChatGPT Custom GPT Actions can call `https://api.github.com` with a fine-grained token limited to this one repository. No extra host, no second database, no public knowledge base.

A ChatGPT write is a git commit. Claude and Cursor see it on the next pull. A Cursor write is a git commit. ChatGPT sees it on the next Action call.

## Source of truth

**`_claude-memory/` on branch `main` after this lands.**

- Operating docs (`docs/`, `skills/`, `verticals/`) stay where they are. Memory points at them; it does not copy them.
- Do not keep a second unsynced copy only in Obsidian, only in a ChatGPT Project, or only in a Claude Project.
- If a chat produced a decision and it is not in `_claude-memory/`, it did not happen for the other two models.

## Session protocol (all three)

**Start**

1. Read `🗺️ Master MOC.md`, `context.md`, `decisions-log.md`
2. Read `ledger.md` (what the other models just wrote)
3. Read any open file in `handoffs/`
4. Confirm: `Memory loaded — [one line].`

**End**

1. Update the matching memory file. Set `Last updated`.
2. Append one entry to `ledger.md` (who, what, files, next for the others).
3. If another model should continue a specific job, write `handoffs/YYYY-MM-DD-<from>-to-<to>.md`.
4. Stamp `source:` / `sources:` (claude orange, chatgpt blue, cursor purple) so Memory Space can color the note. Partial edits: `<!-- source:YOURNAME --> … <!-- /source -->`.
5. Confirm: `Memory updated.`

Ian can browse the vault like Obsidian, colored by writer: `./scripts/memory-space.sh` → `memory-space/`. Docs: `docs/memory-space.md`.

## How they combine work

Do not paste long chat transcripts between tools. Hand off structured state:

```
ledger.md     → running log of who changed what
handoffs/     → explicit "you pick this up next"
context.md    → durable facts about Ian / businesses
decisions-log.md → locked decisions (append-only)
```

Example: Cursor builds a page → writes a handoff for Claude to review copy → Claude updates the client file → ChatGPT drafts the client email from the same client file. All three read the same notes.

## Setup (Ian, once)

Follow `connectors/README.md`. Short version:

1. Merge this PR so `_claude-memory/` is on `main`.
2. Mac: `./scripts/upgrade-obsidian.sh` (links the vault; see `connectors/obsidian/setup.md`)
3. ChatGPT: create a Custom GPT with `connectors/chatgpt/` (instructions + OpenAPI + fine-grained PAT).
4. Claude.ai: create a Project with `connectors/claude/project-instructions.md` and upload `connectors/chatgpt/knowledge-pack.md`.
5. Refresh the knowledge pack after large memory updates: `./scripts/export-memory-pack.sh`

## Security

- Repo stays **private**.
- ChatGPT PAT must be **fine-grained**: this repo only, Contents read/write, no admin, no other repos.
- Actions may only read/write paths under `_claude-memory/`.
- Same hard rules as `CLAUDE.md`: no email send, no GitHub issue writes, no Calendar edits without explicit confirmation.

## What this is not

- Not a shared chat room. Each model still has its own conversation.
- Not a replacement for Notion task boards or Gmail.
- Not an excuse to invent client progress. If it is not in a memory file, say you do not know.
