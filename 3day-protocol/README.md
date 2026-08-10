# 3-Day App Protocol — engine pack

A four-gate engine for shipping a client-ready **Next.js + Supabase + Vercel**
app in three working days, driven by a Claude Code session. Every run produces
verified security (RLS proven twice — pgTAP locally, PostgREST probe against
production), a human-signed design, and a rendered `SHIP-REPORT.md` the client
can actually read.

The pack is the engine. A **run** is a separate project directory that the
engine scaffolds, gates, and reports on. The pack ships nothing per-client;
all run state lives with the generated app.

## Layout

```
3day-protocol/                       # this pack (iCloud-safe: text + scripts only)
  SKILL.md                           # the protocol itself — P0–P5 operator manual
  README.md                          # this file
  bin/
    gate-check                       # the engine: init / 0..3 / status / reopen / doctor / note
    deploy-guard                     # PreToolUse hook: blocks deploys below Gate 2 green
    journal-append                   # PostToolUse hook: O(1) run-journal appender
  templates/
    build-spec.schema.json           # spec.json schema + annotated example
    SHIP-REPORT.template.md          # handover report template (rendered by gate-check 3)
    hooks.json                       # enforcement snippet merged into each run project
  tests/                             # node --test suites (zero-dep, no npm install)
```

A run project looks like:

```
~/builds/<project>/                  # ALWAYS off iCloud (see run-dir rule below)
  .protocol/
    spec.json                        # Gate 0 output — single source of truth
    phase                            # current phase marker (P1..P5)
    gates/gate-{0..3}.json           # {status, ts, evidence[], approver?, head?}
    journal.jsonl                    # gate transitions, tool events, interventions
    evidence/                        # lint reports, TAP output, probe transcripts, screenshots
  .claude/settings.json              # hooks (merged in by gate-check init)
  (the Next.js + Supabase app)
```

## Quickstart

```bash
# P0 — setup (session MUST be started in the run dir; see topology note)
mkdir -p ~/builds/acme && cd ~/builds/acme      # start Claude Code HERE
"/Users/ianveber/Desktop/Cloude CODE/3day-protocol/bin/gate-check" init ~/builds/acme
gate-check doctor                                # tool matrix must be green

# P1 — discovery: web-intake questions → .protocol/spec.json
gate-check 0                                     # spec valid + provisioned

# P2 — design: variants → lint → human sign-off
gate-check 1
gate-check 1 --approve "Client Name"             # refused until lint passes

# P3 — build (ais-os skeleton: schema + RLS + SSR auth from spec)

# P4 — verify: pgTAP RLS (supabase test db) + secret scan + input validation
gate-check 2                                     # break-glass: 2 --attest "<name>: <reason>"

# P5 — deploy + handover
vercel deploy --prod                             # hook allows it: gate 2 green + fresh
gate-check 3 --url https://acme.vercel.app       # 200 + anon RLS probe + smoke → SHIP-REPORT.md
                                                 # (--url optional if spec.json has "deployUrl";
                                                 #  anon probe covers spec "protectedRoutes")

# anytime
gate-check status                                # where am I? (also: resume after crash)
```

Full phase-by-phase instructions live in `SKILL.md` — that file is the
protocol; this README is just the map.

## Threat model — what enforcement does and does not do

The hooks guard against **accidental** gate-skipping by a well-intentioned
agent or operator mid-flow: a deploy fired before the security pass, a deploy
after code drifted past a green gate, a forgotten re-check. They do **not**
stop an adversarial agent that edits its own hook configuration — no
in-project mechanism can. Mitigations: the hook script content lives in this
pack (the run project's settings only reference it by absolute path), so
casual edits inside the run project can't neuter it, and the journal records
hook-config changes. Additionally, runs disable Vercel git auto-deploy so the
`git push` bypass is closed at the platform level — the CLI (which the hook
sees) is the only deploy path. Treat the hooks as guardrails, not guarantees;
the SHIP-REPORT's override/attestation section is the honesty layer on top.

## Hooks: what `gate-check init` merges

`templates/hooks.json` is the exact snippet merged into the run project's
`.claude/settings.json`:

- **PreToolUse / matcher `Bash`** → `bin/deploy-guard` — scans each Bash
  command segment-wise for deploy intent (`vercel deploy`, `vercel --prod`,
  `vercel alias set`, `npx vercel`, `npm|pnpm|bun|yarn run deploy*`, `git push`
  on Vercel-linked projects) and blocks (exit 2) unless
  `.protocol/gates/gate-2.json` is green **and** fresh (recorded HEAD matches,
  worktree clean) **and** carries real verification evidence (a hand-edited
  bare green is rejected). Shell/exec wrappers (`sh -c`, `bash -lc`, `env`,
  `xargs`, `nohup`, …) are peeled off before matching, so hiding a deploy
  inside a wrapper does not slip past. Non-deploy vercel subcommands
  (`env pull`, `link`, `ls`, …) always pass.
- **PostToolUse / matcher `*`** → `bin/journal-append` — appends
  `{ts, tool, phase}` to `.protocol/journal.jsonl`. Pure O(1) append; on write
  failure it degrades to a stderr warning and never blocks the tool.

Merge notes (JSON carries no comments, so they live here):

- `init` **merges** — it deep-merges the two hook entries into any existing
  `.claude/settings.json`, preserving unrelated settings and hooks already
  present. It never overwrites the file wholesale. Idempotent: re-running
  `init` won't duplicate entries.
- Paths are **absolute into this pack** (note the space in `Cloude CODE` —
  the command strings are shell-quoted for that reason). If the pack moves,
  re-run `gate-check init` in every active run.
- **Topology requirement:** hooks in `.claude/settings.json` fire only for
  Claude Code sessions started **in that project directory**. A session driven
  from the pack repo or `~` has no enforcement. Always start the session in
  the run dir.

## Tool matrix (`gate-check doctor` verifies all of it)

| Tool | Needed for | Notes |
|---|---|---|
| Node ≥ 18 | the engine itself | pack is zero-dep stock Node; `node --test` for tests |
| git | gate freshness (HEAD recording), stale detection | run project must be a repo |
| Supabase CLI | Gate 2 `supabase test db` (pgTAP on local shadow db) | |
| Docker (running) | the local shadow database | hard Gate 0 prerequisite; without it Gate 2 is red (break-glass: `--attest`) |
| Vercel CLI | deploys + Gate 3 verification + `vercel env ls` audit | git auto-deploy must be OFF for the run project |
| Playwright (MCP or agent-browser) | Gate 3 smoke: signup → action → persist | |
| gitleaks *(optional)* | Gate 2 secret scan | absent → built-in regex fallback (service-role keys, JWTs, `sk-` patterns) |
| ccusage *(optional)* | Gate 3 cost envelope | absent → manual `/cost` entry prompt |

## Run-dir rule: OFF iCloud, always

Run projects live in `~/builds/<project>/` — never on Desktop, Documents, or
any iCloud-synced path. iCloud's sync placeholders break `next dev`, file
watchers, `node_modules`, and Bun dev servers (repeatedly observed). The pack
itself may live on iCloud because it is text and scripts only — which is also
why you must never `npm install` inside the pack; everything runs on stock
Node.

## Tests

```bash
node --test "/Users/ianveber/Desktop/Cloude CODE/3day-protocol/tests"
```

Zero dependencies. Fixtures are created fresh under `~/builds/` by the suites.
