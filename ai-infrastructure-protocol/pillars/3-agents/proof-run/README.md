# Pillar ③ proof-run — invoice-chaser (2026-07-17)

Real, credential-backed run of the agent factory, committed as proof (not a template).
See the "Worked example — PROVEN" section of `../SKILL.md`.

- `agents/invoice-chaser/spec.json` — the agent contract
- `agents/invoice-chaser/agent.mjs` — the real artifact (zero-dep Node; no send path)
- `agents/invoice-chaser/inputs/invoices.json` — 3 seeded overdue invoices
- `agents/invoice-chaser/drafts/` — the gated output (3 drafts, 0 sends)
- `agents/invoice-chaser/verify.json` — result: green (after a red→fix→green loop)
- `agents/invoice-chaser/journal.jsonl` — the run trail
- `artifacts.json` — registry entry (security: green, shipped: true)
- `gates/gate-3.json` — independent security-gate result: green

Reproduce: `node agents/invoice-chaser/agent.mjs` (needs ~/.anthropic_key). Cost ~€0.01.
