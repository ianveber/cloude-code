# Biomasa — social media agent cluster

Client engagement for **Biomasa d.o.o.** (Nazarje / Luče), delivered with **iPROM** (Maja Gorjanc). End client already has an AI website ambassador from **iPROM + Retoba** (`ambasador.biomasa.si`). This cluster is the **social publishing agent**, not a second chatbot.

**Operator console:** [`biomasa-social.html`](../../biomasa-social.html) (repo root).

**Status:** `read-only-phase`. The console drafts, queues, and exports copy. It does **not** post to Meta, LinkedIn, or YouTube.

## What this cluster does

Takes Biomasa's live commercial calendar (kurilna sezona, Eko sklad, Fröling products, BBC Nazarje fuels, B2B projects, fairs, AI ambassador) and produces platform-native drafts for Facebook, Instagram, LinkedIn, and YouTube. A human at iPROM / Biomasa approves before anything is published.

## Files

| File | Role |
|---|---|
| `agent-spec-social.md` | Cluster spec (`social-energy-biomasa`) |
| `brand-voice.md` | Voice, claims, off-brand list |
| `content-pillars.md` | Eight pillars + weekly mix |
| `tool-manifest-publishing.md` | Meta / LinkedIn / YouTube / Higgsfield — copy-out only |
| `eval-log.md` | Read-only review log |

## Do not

- Auto-publish. Write access is not granted.
- Invent project names, kW ratings, subsidy amounts, or customer quotes.
- Treat the Retoba ambassador as Veta's build. Promote it; do not rebuild it.
- Send email to iPROM or Biomasa from this repo.

## Evidence trail (2026-09-16 / 2026-09-17)

Claude produced `BIOMASA_digitalna_revizija.docx` + `.xlsx` (Ian sent them to `maja.gorjanc@iprom.si`). The Gmail MCP in Cursor Cloud cannot download those attachments. The console's audit view is reconstructed from **public** sources (biomasa.si, Facebook, LinkedIn) plus that email evidence. When the original files are in the repo, replace the reconstruction.