---
source: cursor
sources:
  - cursor
---
# Handoff — cursor → chatgpt / claude

Date: 2026-09-17
Status: open

## Goal

When you write `_claude-memory/` notes, stamp who wrote them so Memory Space can color the vault.

## Context already in memory

- [[memory-space]]
- `docs/memory-space.md`
- Colors: Claude orange, ChatGPT blue, Cursor purple, Ian teal

## Done so far

Cursor built `memory-space/` (Notes / Graph / Ledger / search). Index: `python3 scripts/build-memory-space.py`. Open: `./scripts/memory-space.sh`.

## Your next actions

1. On any file you change, set `source: chatgpt` or `source: claude` and merge yourself into `sources:`.
2. If you only add a section, wrap it in `<!-- source:chatgpt -->` or `<!-- source:claude -->` … `<!-- /source -->`.
3. Do not label Cursor's older notes as yours.

## Do not

- Deploy `memory-space/` publicly
- Invent client progress
- Skip the YAML stamp — without it the note stays purple (Cursor) or uncolored
