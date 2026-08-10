#!/usr/bin/env node
// invoice-chaser — integration-automation artifact (Pillar ③ factory proof)
//
// Reads overdue invoices, drafts a Slovene payment-reminder email per invoice via
// the Anthropic API, and writes each draft for HUMAN APPROVAL. It DRAFTS ONLY.
//
// LEAST-PRIVILEGE BY CONSTRUCTION: there is no send code path anywhere in this file.
// The Anthropic key can generate text; it cannot send email. The gmail:draft /
// stripe:read surfaces are production wiring (composio) — this proof uses local files
// so it has zero side effects on any real account.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const MODEL = "claude-sonnet-4-6";
const COST_CAP_EUR = 0.50;       // guardrail: per-run spend ceiling
const MAX_INVOICES = 25;         // guardrail: run-rate limit
// Anthropic public price (per 1M tokens) for cost accounting only.
const PRICE_IN = 3.0, PRICE_OUT = 15.0, USD_EUR = 0.92;

const KEY = fs.readFileSync(path.join(process.env.HOME, ".anthropic_key"), "utf8").trim();
const jlog = (o) => fs.appendFileSync(path.join(DIR, "journal.jsonl"),
  JSON.stringify({ ts: new Date().toISOString(), ...o }) + "\n");

async function draftReminder(inv) {
  const sys = "Si vljuden, a odločen računovodski asistent slovenskega podjetja. Napiši KRATEK opomnik za plačilo zapadlega računa (slovenščina). Vrni SAMO telo e-pošte, brez uvodne razlage. Zahteve: (1) ZAČNI z nagovorom stranke po imenu podjetja, npr. 'Spoštovani v podjetju <ime>,'; (2) jasno navedi številko računa, znesek in dni zamude; (3) vljudno prosi za plačilo.";
  const user = `Ime stranke (podjetja) — OBVEZNO ga navedi v nagovoru: ${inv.customerName}\nRačun: ${inv.id}\nZnesek: ${inv.amount.toFixed(2)} ${inv.currency}\nZapadlost: ${inv.dueDate} (${inv.daysOverdue} dni zamude)\nNapiši opomnik.`;
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: 500, system: sys, messages: [{ role: "user", content: user }] }),
  });
  if (!r.ok) throw new Error(`anthropic_${r.status}: ${(await r.text()).slice(0, 200)}`);
  const j = await r.json();
  const body = (j.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();
  const u = j.usage || { input_tokens: 0, output_tokens: 0 };
  return { body, inTok: u.input_tokens, outTok: u.output_tokens };
}

async function main() {
  const invoices = JSON.parse(fs.readFileSync(path.join(DIR, "inputs", "invoices.json"), "utf8"));
  if (invoices.length > MAX_INVOICES) { jlog({ step: "halt", reason: `over rate limit ${invoices.length}>${MAX_INVOICES}` }); process.exit(1); }
  jlog({ step: "start", invoices: invoices.length, model: MODEL, sendEnabled: false });

  const draftsDir = path.join(DIR, "drafts");
  fs.mkdirSync(draftsDir, { recursive: true });
  let costEur = 0, sends = 0; const manifest = [];

  for (const inv of invoices) {
    const { body, inTok, outTok } = await draftReminder(inv);
    costEur += (inTok / 1e6 * PRICE_IN + outTok / 1e6 * PRICE_OUT) * USD_EUR;
    if (costEur > COST_CAP_EUR) { jlog({ step: "halt", reason: `cost cap €${COST_CAP_EUR} exceeded` }); process.exit(1); }
    const subject = `Opomnik za plačilo — račun ${inv.id} (${inv.amount.toFixed(2)} ${inv.currency})`;
    const draft = `To: ${inv.customerEmail}\nSubject: ${subject}\nStatus: DRAFT — za človeško odobritev (NI poslano)\n\n${body}\n`;
    fs.writeFileSync(path.join(draftsDir, `${inv.id}.txt`), draft);
    manifest.push({ invoice: inv.id, to: inv.customerEmail, amount: `${inv.amount.toFixed(2)} ${inv.currency}`, draftFile: `drafts/${inv.id}.txt`, sent: false });
    jlog({ step: "draft", invoice: inv.id, to: inv.customerEmail, bytes: draft.length, sent: false });
  }

  fs.writeFileSync(path.join(draftsDir, "_manifest.json"),
    JSON.stringify({ drafts: manifest.length, sends, costEur: +costEur.toFixed(4), model: MODEL }, null, 2));
  jlog({ step: "done", drafts: manifest.length, sends, costEur: +costEur.toFixed(4) });
  console.log(`drafts=${manifest.length} sends=${sends} costEur=${costEur.toFixed(4)}`);
}
main().catch((e) => { jlog({ step: "error", error: String(e.message || e) }); console.error(e.message); process.exit(1); });
