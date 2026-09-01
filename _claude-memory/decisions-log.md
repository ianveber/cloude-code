# Decisions log

Last updated: 2026-09-01

Append-only. Newest first. Do not rewrite history — add a superseding entry.

---

## 2026-09-01 — Shared memory lives in this git repo

**Decision:** Claude Code and Cursor share one memory folder: `./_claude-memory/` in `ianveber/cloude-code`. Obsidian on the Mac should symlink that folder. Notion stays the human ops hub, not a second copy of these notes.

**Why:** Cursor Cloud cannot read `/Users/ianveber/Documents/Obsidian Vault/`. Claude was already instructed to use that path. Without a repo copy, the two agents drift.

**Do not:** Keep a private unsynced Obsidian-only memory after the symlink is in place.

---

## 2026-05-04 — Veta is a vertical agent agency, not ads-as-a-service

**Decision:** Current offer is complete agent systems for specialty service verticals (dental, legal, aesthetic medicine). Acquirer agent is organic only. No paid-media retainers as a product.

**Source:** `docs/positioning.md`, `docs/service-catalog.md`, `docs/principles.md` (dated with playbooks on 2026-05-04).

**Related prior identity:** Notion (2026-04) still describes **Veta Ads** as geometric red/navy performance creative. That is the earlier brand track. Do not pitch Veta as an ads agency unless Ian reopens that line.

---

## Pricing and engagement model (locked in catalog)

- Tier 1 Cluster Sprint: one cluster, 6–8 weeks, ~$18K–$45K
- Tier 2 Vertical Stack: 2–4 clusters, 10–16 weeks, ~$55K–$120K
- Tier 3 Embedded Partner: monthly retainer after handoff
- Price on value of the cluster replaced, not hours
- Read-only phase before write-access; client sign-off required
- Clients own the system; retainer is improvement, not lock-in

---

## Ethospheres (locked from skills + dashboard)

- Brand is **Ethospheres** (etho + spheres). USPTO/Trademarkia check noted as 0 conflicts in dashboard notes; file Class 3 before public announcement
- Channel: professional (clinics) first, D2C second
- Tech story: ethosome vesicles (phospholipid + ethanol, ~100–300nm) for transdermal delivery
- Manufacturing: Korean OEM with vesicular capability; Ethospheres must own SKU-specific formulations
- Team constraint: bootstrapped, Ian + 1 ops
- No celebrity / "revolutionary" voice. Talk like a dermatologist colleague

---

## Agentic OS stack (from skills)

- n8n cloud: Email, Calendar, Project, Knowledge agents
- Local: File Agent via launchd
- Daily research agent: Haiku for research, Sonnet for synthesis; 06:00 via launchd
- Business manager briefing: 07:00 Europe/Ljubljana → `./reports/YYYY-MM-DD-daily-briefing.md`

---

## Still open (not decided here)

- Whether Veta Ads creative retainers remain a live offer alongside the agent agency
- Local Obsidian notes that were not imported on 2026-09-01 — merge after `scripts/link-obsidian-memory.sh`
