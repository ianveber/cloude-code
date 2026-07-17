# Pillar ① — App Development

The app pillar is the **four-gate app engine**, already built and verified:
`../../../3day-protocol/`.

It is the G2 build path for any artifact that is a **web application**
(Next.js + Supabase + Vercel): a client portal, an internal tool, a dashboard, a
customer-facing app. The blueprint (pillar ②) sends app-shaped backlog items here.

## How it plugs into the protocol

```
blueprint backlog item (kind: app)
        │
        ▼
  3day-protocol four gates:
  G0 intake → G1 design → G2 security → G3 deploy → SHIP-REPORT.md
        │
        ▼
  register in .protocol/artifacts.json  →  must also pass Pillar ⑤ Security gate
```

The app engine already enforces the security-critical parts of Pillar ⑤ for apps
(RLS pgTAP, secret scan, input validation, deploy hard-block). Pillar ⑤ adds the
agent/API-specific checks on top for non-app artifacts.

## Supporting skills (bundled)

`skills/build/`: `supabase`, `supabase-postgres-best-practices` (via supabase),
`deploy-to-vercel`, `interface-design`, `ian-design-standards`,
`web-design-guidelines`, `shadcn`.

## Run it

Follow `../../../3day-protocol/SKILL.md`. Start a run in `~/builds/<project>/`,
`gate-check init`, then drive the four gates. The app engine's own SHIP-REPORT is
the artifact this pillar contributes to the company's INFRASTRUCTURE-REPORT.
