# Handoff — cursor → claude

Date: 2026-09-17
Status: open

## Goal

iPROM (Maja) can run Biomasa social from `biomasa-social.html` without the agent publishing. Original Claude audit files are still only in Gmail.

## Context already in memory

- `_claude-memory/clients/biomasa.md`
- `agents/energy-biomasa/agent-spec-social.md`

## Done so far

- Spec, voice, pillars, copy-out tool manifest
- Working console: generate, weekly mix, queue approve/reject/export, optional Claude rewrite that discards new numbers
- Seeded drafts from public 2026 content (Črnomelj, Bovec, Solčava, ambassador, servis)
- Browser pass: Fröling generate without subsidy checkbox; kurilna blocked until checkbox; unapproved export toast `Najprej odobri`; queue CTA on its own line; mobile hamburger

## Your next actions

1. If Ian can paste the Gmail zip/docx into `agents/energy-biomasa/source/`, replace the reconstructed audit view.
2. Score the first 20 drafts with Maja (eval-log).
3. Do not connect Meta write until that gate.

## Do not

- Email maja.gorjanc@iprom.si
- Rebuild ambasador.biomasa.si
- Invent Eko sklad amounts
