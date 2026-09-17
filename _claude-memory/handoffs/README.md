# Handoffs

Last updated: 2026-09-17

Short notes from one model to another. Not a chat log. The receiving model should do the work, update memory, then move the file to `handoffs/done/` or delete it after logging the result in `ledger.md`.

## File name

```
YYYY-MM-DD-<from>-to-<to>.md
```

`from` / `to`: `chatgpt` | `claude` | `cursor` | `ian`

## Template

```markdown
# Handoff — {from} → {to}

Date:
Status: open

## Goal
One paragraph. What done looks like.

## Context already in memory
List files the receiver must read first.

## Done so far
Bullets. Paths to diffs / PRs / drafts.

## Your next actions
Numbered. Specific.

## Do not
Anything the receiver might get wrong (scope, tone, tools).
```

## Open

See files in this folder except `README.md` and `done/`.
