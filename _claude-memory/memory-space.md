---
source: cursor
sources:
  - cursor
  - claude
  - chatgpt
---
# Memory Space

Last updated: 2026-09-17

Custom vault for this folder — same job as Obsidian, plus a color for **which LLM wrote the data**.

Open from the repo root:

```bash
./scripts/memory-space.sh
```

That builds the index and serves `http://127.0.0.1:8765/memory-space/`. Private. Do not host this folder on a public URL.

## Colors

The three lamps in the header are the rule:

| Writer | Color | How it gets painted |
|---|---|---|
| Claude | orange | `source: claude` or `<!-- source:claude -->` |
| ChatGPT | blue | `source: chatgpt` or `<!-- source:chatgpt -->` |
| Cursor | purple | `source: cursor` or `<!-- source:cursor -->` |
| Ian | teal | `source: ian` |

File-level color comes from YAML `source` / `sources`. Mixed notes show multiple dots and a pie node on the graph. Wrap a paragraph when only part of a note is yours.

The next three blocks are the **color legend** (this file was still written by Cursor). They show how each writer will look once they log real work.

<!-- source:claude -->
**Claude · orange.** Notes and blocks Claude writes use orange — tree dot, graph node, left rail, and this rail.
<!-- /source -->

<!-- source:chatgpt -->
**ChatGPT · blue.** Notes and blocks ChatGPT writes use blue. Live writes still go to git via Custom GPT Actions.
<!-- /source -->

<!-- source:cursor -->
**Cursor · purple.** Cursor seeded this memory cloud and built Memory Space. Most notes start purple until the others write.
<!-- /source -->

## Views

- **Notes** — file tree, wiki links `[[like this]]`, backlinks
- **Graph** — constellation of notes; node color is the writer
- **Ledger** — `ledger.md` timeline, colored by model
- **Search** — `/` or Cmd+K

See [[🗺️ Master MOC]], [[ledger]], [[SYNC]], and `docs/memory-space.md`.
