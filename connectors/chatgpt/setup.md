# ChatGPT → Veta Memory Cloud

Two layers. Use both.

| Layer | What it is | Freshness |
|---|---|---|
| **A. Knowledge pack** | Upload `knowledge-pack.md` into a GPT or a Project | Snapshot. Re-export after big updates. |
| **B. GPT Actions** | Live read/write of `_claude-memory/` via GitHub | Current. This is the private cloud. |

## A. Fast path (Project, no Actions)

1. ChatGPT → **Projects** → New project → name it `Veta Memory Cloud`
2. Add instructions: paste `gpt-instructions.md`
3. Upload `knowledge-pack.md` (and optionally `_claude-memory/BOOT.md`)
4. Chat in that Project only when you want shared Veta context

Limit: ChatGPT will not see Cursor/Claude writes until you re-upload the pack.

## B. Live path (Custom GPT + Actions)

### 1. Create a fine-grained GitHub token

GitHub → Settings → Developer settings → Fine-grained tokens → Generate.

- Resource owner: **ianveber**
- Repository access: **Only select repositories** → `cloude-code`
- Permissions: **Contents** = Read and write. Nothing else.
- Expiration: 90 days (rotate; put a calendar reminder)

Copy the token once. Treat it like a password. It can commit to this private repo.

### 2. Create the Custom GPT

ChatGPT → Explore GPTs → Create → Configure.

- Name: `Veta Memory`
- Description: `Private Veta knowledge cloud. Reads and writes _claude-memory in ianveber/cloude-code.`
- Instructions: paste the full contents of `gpt-instructions.md`
- Knowledge: upload `knowledge-pack.md` as a fallback if Actions fail
- Conversation starters:
  - `Load shared memory and tell me what is active.`
  - `What did Cursor or Claude last write to the ledger?`
  - `Draft a handoff for Cursor from this chat.`

### 3. Add the Action

Create → Actions → Import OpenAPI.

- Paste `openapi.yaml`
- Authentication: **API Key**
  - Auth Type: Bearer
  - API Key: the fine-grained PAT
- Leave the server URL as `https://api.github.com`

Save. Test: "List the memory folder." You should see `context.md`, `decisions-log.md`, `ledger.md`.

### 4. Use it

Always open **this GPT**, not a blank ChatGPT chat, for Veta / Ethospheres / client work.

When the GPT updates a file it will commit to `main` as you. Cursor and Claude pick it up on `git pull`.

## Rules the GPT must not break

Same as `CLAUDE.md`: no sending email, no GitHub issue writes, no Calendar edits, no deleting Notion items. Memory writes only under `_claude-memory/`.

## If Actions fail

- 401: token expired or missing `contents:write`
- 404: repo private and token cannot see it, or path is wrong
- 409 / sha mismatch: another agent wrote first — GET the file again, then PUT with the new `sha`
- Stale answers: the GPT is using the uploaded pack instead of calling Actions. Tell it: "Use getMemoryFile, do not rely on uploaded knowledge."
