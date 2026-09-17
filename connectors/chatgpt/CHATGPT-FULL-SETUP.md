# ChatGPT — full setup (Veta Memory)

Use this file only. Keep it open on one side of the screen. Build the GPT on the other.

You need: ChatGPT Plus/Team, the GitHub token you already created, and the folder `~/Desktop/cloude-code`.

Do **not** paste the GitHub token into any chat, email, or this repo.

---

## 0. Open the files you will upload

Finder: **Desktop → cloude-code → connectors → chatgpt**

You will use:

| File | What you do with it |
|---|---|
| This guide | Follow the clicks |
| `gpt-instructions.md` | Copy into GPT Instructions (or use **Copy block A** below) |
| `knowledge-pack.md` | Upload under Knowledge |
| `openapi.yaml` | Paste into Actions (or use **Copy block B** below) |

---

## 1. Open the GPT editor

1. Go to https://chatgpt.com/gpts/editor
2. You must be logged in as you.
3. If you see **Explore GPTs** instead of an editor: click **Create** (top right).

You should see fields: Name, Description, Instructions, Conversation starters, Knowledge, Actions, Capabilities.

---

## 2. Fill the Configure tab

**Name**

```
Veta Memory
```

**Description**

```
Private Veta knowledge cloud. Reads and writes _claude-memory in ianveber/cloude-code.
```

**Instructions** — delete whatever is there. Paste **Copy block A** (the whole block, from “You are one of three” through “other two models have.”).

**Conversation starters** — add these three (one per line / one per starter):

```
Load shared memory and tell me what is active.
```

```
What did Cursor or Claude last write to the ledger?
```

```
Draft a handoff for Cursor from this chat.
```

**Capabilities**

- Web search: optional (on is fine)
- DALL·E / image: off
- Code interpreter: off unless you want it
- Actions: you add this in step 4

**Knowledge**

1. Click **Upload files**
2. Choose `knowledge-pack.md`  
   Full path: `/Users/ianveber/Desktop/cloude-code/connectors/chatgpt/knowledge-pack.md`
3. Wait until it finishes uploading.

This pack is a snapshot. Live memory comes from Actions (step 4).

---

## 3. Copy block A — paste into Instructions

Copy everything inside the box:

```
You are one of three professional operators for Ian Veber (Veta). The other two are Claude and Cursor. You do not share a chat. You share a private memory cloud.

# Who Ian is

Ian Veber (ian.veber@gmail.com). Founder / operator. Timezone Europe/Ljubljana. Solo-founder stage. Do not ask him to re-explain businesses, clients, or decisions that are already in memory.

# Shared memory (mandatory)

Live source of truth: private GitHub repo ianveber/cloude-code, folder _claude-memory/ on branch main.

You have Actions against the GitHub Contents API. Use them. Uploaded knowledge is a fallback snapshot only.

## Session start

Call the Actions, in order:

1. getMemoryFile path 🗺️ Master MOC.md (if that fails, use listMemory then fetch context.md)
2. getMemoryFile path context.md
3. getMemoryFile path decisions-log.md
4. getMemoryFile path ledger.md
5. listHandoffs — if any open handoff is for ChatGPT, fetch it

GitHub returns file content as Base64. Decode it before using it.

Then reply with one line: Memory loaded — [what's active]. Do not ask Ian to repeat what you just read.

Load client files only if the task needs them: ethospheres.md, veta-agency.md, agentic-os.md, clients/autoflow.md, clients/other-projects.md, zalife.md.

## During work

- Prefer memory + repo facts over guesswork.
- Never invent client progress, launch dates, revenue, or signed contracts.
- If Cursor or Claude already logged a decision, follow it. Do not reopen it.
- You may draft emails, GitHub issue text, or calendar copy — but Ian must send/submit them. Say so.

## Session end (if anything changed)

1. GET the file you will update (you need its current sha).
2. PUT the full new markdown (Base64) with a commit message like memory(chatgpt): update context.md.
3. GET ledger.md, append one dated entry, PUT it back.
4. If Cursor or Claude should continue a job, PUT handoffs/YYYY-MM-DD-chatgpt-to-cursor.md or ...-to-claude.md using the template in handoffs/README.md.
5. Tell Ian: Memory updated. plus one line per file. Branch must stay main. Path must stay under _claude-memory/.

## Write rules

- Only write under _claude-memory/.
- decisions-log.md is append-only. Newest first.
- ledger.md is append-only. Newest first.
- Do not rewrite history. Add a superseding entry.
- Update Last updated: YYYY-MM-DD on files you change.
- Commit message prefix: memory(chatgpt):

## Business facts (if Actions are down)

Use uploaded knowledge. Say that memory may be stale. Core snapshot:

- Veta — AI-native vertical agent agency. Ships complete agent systems for specialty service verticals (dental, legal, aesthetic medicine). Not ads-as-a-service, not hours, not SaaS seats.
- Ethospheres — premium ethosome cosmesotherapy brand, pre-launch, EU, clinics first.
- AutoFlow — AI lead scoring SaaS (Claude + Supabase + Vercel).
- Hard rules: no unsolicited email send, no GitHub issue mutations, no Calendar mutations, no deleting Notion/GitHub items.

## Voice

Professional, specific, short. Ian is the operator. You are staff with the same briefing the other two models have.
```

---

## 4. Add the Action (this is the live cloud)

1. Scroll to **Actions**
2. Click **Create new action** (or **Add actions**)
3. Choose **Import** / schema editor
4. Delete any sample schema
5. Paste **Copy block B** (the YAML below) into the schema box
6. **Authentication**
   - Type: **API Key**
   - Auth Type: **Bearer**
   - API Key: paste your GitHub fine-grained token (only here)
7. Confirm the server URL is `https://api.github.com`
8. You should see operations: `listMemory`, `listHandoffs`, `getMemoryFile`, `putMemoryFile`
9. Click **Save** on the action, then **Update** / **Save** on the GPT

Privacy: set the GPT to **Only me**. Do not publish it to the GPT store.

---

## 5. Copy block B — paste into Actions (OpenAPI)

Copy everything inside the box:

```yaml
openapi: 3.1.0
info:
  title: Veta Memory Cloud
  description: >
    Private read/write access to _claude-memory in ianveber/cloude-code.
    ChatGPT, Claude, and Cursor share this folder. Only touch paths under
    _claude-memory/. GitHub returns file content as Base64.
  version: "1.0.0"
servers:
  - url: https://api.github.com
security:
  - GitHubToken: []
paths:
  /repos/ianveber/cloude-code/contents/_claude-memory:
    get:
      operationId: listMemory
      summary: List the root of shared memory
      parameters:
        - $ref: "#/components/parameters/Ref"
      responses:
        "200":
          description: Directory listing
  /repos/ianveber/cloude-code/contents/_claude-memory/handoffs:
    get:
      operationId: listHandoffs
      summary: List cross-model handoff notes
      parameters:
        - $ref: "#/components/parameters/Ref"
      responses:
        "200":
          description: Directory listing
  /repos/ianveber/cloude-code/contents/_claude-memory/{path}:
    get:
      operationId: getMemoryFile
      summary: Read one memory file (content is Base64)
      parameters:
        - name: path
          in: path
          required: true
          schema:
            type: string
          description: >
            Path relative to _claude-memory/. Examples: context.md,
            decisions-log.md, ledger.md, ethospheres.md,
            clients/autoflow.md, handoffs/README.md
        - $ref: "#/components/parameters/Ref"
      responses:
        "200":
          description: File payload with base64 content and sha
    put:
      operationId: putMemoryFile
      summary: Create or update one memory file (commit on main)
      description: >
        Always GET first so you have the current sha. Encode the full
        markdown file as Base64 in content. Do not write outside
        _claude-memory/.
      parameters:
        - name: path
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - message
                - content
              properties:
                message:
                  type: string
                  description: Commit message. Use prefix memory(chatgpt):
                content:
                  type: string
                  description: Full file body, Base64-encoded
                sha:
                  type: string
                  description: Required when updating an existing file (from GET)
                branch:
                  type: string
                  default: main
      responses:
        "200":
          description: File updated
        "201":
          description: File created
components:
  securitySchemes:
    GitHubToken:
      type: http
      scheme: bearer
      bearerFormat: token
      description: Fine-grained PAT, Contents read/write, repo ianveber/cloude-code only
  parameters:
    Ref:
      name: ref
      in: query
      required: false
      schema:
        type: string
        default: main
      description: Git ref. Always use main for live memory.
```

If ChatGPT rejects the schema: open `openapi.yaml` in that same folder and paste the file instead.

---

## 6. Test

1. Leave the editor. Open **Veta Memory** from **My GPTs** (your profile → My GPTs). Do not use a blank ChatGPT chat.
2. Allow the GPT to use the action if it asks.
3. Send:

```
List the memory folder.
```

Success: it names files including `context.md`, `decisions-log.md`, `ledger.md`.

Then send:

```
Load shared memory and tell me what is active.
```

Success: first line is `Memory loaded — …` and it knows Veta, Ethospheres, AutoFlow.

If it answers from the uploaded pack only and never calls an action, say:

```
Use getMemoryFile. Do not rely on uploaded knowledge.
```

---

## 7. How to use it after setup

Always open **Veta Memory**, not a new ChatGPT chat.

At the start of real work it should read `context.md`, `decisions-log.md`, and `ledger.md`.

When Cursor or Claude change memory, this GPT sees it on the next Action call (live GitHub), not from the old knowledge upload.

---

## 8. If something fails

| What you see | What to do |
|---|---|
| 401 / unauthorized | Token expired, or auth is not Bearer, or you used a classic PAT |
| 404 | Token cannot see private `cloude-code`, or Contents permission is not Read and write |
| 409 / sha | Another write happened. Tell the GPT to GET the file again, then PUT with the new sha |
| Schema import error | Paste `openapi.yaml` from disk instead of the block above |
| No Actions button | You are on a free plan. Need Plus/Team. Use a ChatGPT **Project** and upload `knowledge-pack.md` only (stale until re-upload) |
| Stale answers | “Use getMemoryFile, do not rely on uploaded knowledge.” |

---

## 9. After this GPT works

Claude.ai is next: new Project `Veta Memory Cloud`, paste `connectors/claude/project-instructions.md`, upload the same `knowledge-pack.md`.

That guide: `connectors/claude/setup.md`.
