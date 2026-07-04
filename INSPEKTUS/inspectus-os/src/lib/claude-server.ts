import { KNOWLEDGE } from "./knowledge";

const apiKey = process.env.ANTHROPIC_API_KEY;

// ── Per-task model selection (Ian's call, 2026-06-26) ───────────────────────
// TEXT pipeline (validate / summarize / ask / filter) → Haiku 4.5: matched Opus on
//   VLDR validation (100% recall, 0 false positives) at ~1/6 the cost; structured/analytical
//   work it handles cleanly.
// VISION (VIN OCR) → Opus 4.8: accuracy wins for VIN reading — the 2026-06-17 benchmark had
//   Opus at 9/9 while cheaper models returned confidently-WRONG VINs (silent misfiling). The
//   17-char VIN_RE guard below stays as a belt-and-braces check on top of that.
const MODEL_TEXT = "claude-haiku-4-5";
const MODEL_VISION = "claude-opus-4-8";

// Anthropic API call helper — mirrors inspectus-vldr/api/_lib.mjs exactly.
// Uses prompt-cached knowledge system block on every call.
async function callClaude({
  system,
  user,
  expectJson = false,
  maxTokens = 1024,
  model = MODEL_TEXT,
}: {
  system: string;
  user: string;
  expectJson?: boolean;
  maxTokens?: number;
  model?: string;
}): Promise<Record<string, unknown>> {
  if (!apiKey) return { error: "no_api_key" };

  const sys: unknown[] = [];
  if (KNOWLEDGE) sys.push({ type: "text", text: KNOWLEDGE, cache_control: { type: "ephemeral" } });
  sys.push({ type: "text", text: system, cache_control: { type: "ephemeral" } });

  let r: Response;
  try {
    r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "anthropic-beta": "prompt-caching-2024-07-31",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system: sys,
        messages: [{ role: "user", content: user }],
      }),
    });
  } catch (e) {
    return { error: "network", detail: String(e) };
  }

  if (!r.ok) return { error: "claude_" + r.status, detail: await r.text() };

  const data = await r.json() as { content?: { text?: string }[] };
  const text = data.content?.[0]?.text ?? "";

  if (!expectJson) return { text };

  try {
    let cleaned = text.replace(/```json\s*|\s*```/g, "").trim();
    const a = cleaned.indexOf("{");
    const b = cleaned.lastIndexOf("}");
    if (a !== -1 && b > a) cleaned = cleaned.slice(a, b + 1);
    return { json: JSON.parse(cleaned) };
  } catch {
    return { error: "json_parse", raw: text };
  }
}

// ---------------------------------------------------------------------------
// Route functions — one per endpoint. Prompt bodies ported from:
//   api/claude/validate.mjs  → runValidate  → returns { json: { issues } } or error
//   api/claude/summarize.mjs → runSummarize → returns { text } or error
//   api/claude/filter.mjs    → runFilter    → returns { json: { filter } } or error
// ---------------------------------------------------------------------------

export async function runValidate(body: { damages?: unknown[] }): Promise<Record<string, unknown>> {
  const system = `Si revizor kakovosti podatkov za INSPECTUS — pregled poškodb vozil (VLDR, finished-vehicle logistics) v pristanišču Koper. Uporabljaš sistem kod AIAG-ECG: PART CODE = območje poškodbe, TYPE CODE = vrsta poškodbe, SEVERITY = obseg (1=manjši, 2=srednji, 3=večji). NE ugibaj pomena posameznih številčnih kod.
Razredi (CLASS) so natanko trije: 'No Damage Evidence', 'Damage', 'Observation'. Preveri notranjo skladnost vsake poškodbe: ali se CLASS ujema s SEVERITY in z opisom v COMMENTS, ali manjka razred, ali je kombinacija neverjetna (npr. 'No Damage Evidence' ob opisu razpoke/udarnine, ali 'Damage' pri SEVERITY 1 brez utemeljitve). Ne izmišljuj si drugih razredov.
Vrni IZKLJUČNO veljaven JSON v obliki:
{ "issues": [ { "vin": "...", "row_index": 0, "kind": "nekonsistentna_koda"|"prazen_razred"|"neverjetna_kombinacija", "message": "...", "suggestion": "..." } ] }
Sporočila in predlogi naj bodo v slovenščini, v strokovnem registru pregledovalca. Bodi jedrnat. Preskoči vrstice brez težav. Največ 12 težav. Brez proze, brez markdowna — zgolj JSON objekt.`;

  const user = "Damages:\n" + JSON.stringify((body.damages || []).slice(0, 200), null, 2);
  return callClaude({ system, user, expectJson: true, maxTokens: 3000 });
}

export async function runSummarize(body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const system = `Si vodja kontrole kakovosti pri INSPECTUS (neodvisna nadzorna družba za poškodbe vozil v pristanišču Koper). Napiši kratek, profesionalen povzetek poročila VLDR v slovenščini, 4-6 stavkov, kot bi ga poslal OEM proizvajalcu ali zavarovalnici. Uporabljaj strokovni besednjak: tranzitne poškodbe, prevzem med prevozniki, obseg poškodb. Fokus na trende in poslovne posledice (odgovornost prevoznikov, tveganje odškodninskih zahtevkov), ne na sezname številk. Bodi konservativen ("nakazuje", "kaže na" — ne pravnih zaključkov). Brez markdowna.`;
  const user = "Statistika:\n" + JSON.stringify(body, null, 2);
  return callClaude({ system, user, maxTokens: 600 });
}

export async function runFilter(body: { query?: unknown }): Promise<Record<string, unknown>> {
  const system = `Pretvori slovensko vprašanje v JSON filter objekt za podatke o poškodbah vozil (INSPECTUS VLDR).
Razpoložljiva polja: vin (string), make_model (string, npr. FORD TRANSIT), part_code (string, npr. 55), type_code (string, npr. 12), severity (int 1-3), class (eno od: "No Damage Evidence"|"Damage"|"Observation"), cause (string, npr. Transport / Warranty), comments (string). Za class uporabi eq z angleško vrednostjo (npr. "Observation").
Vrni IZKLJUČNO: {"filter":[{"field":"...","op":"...","value":...}]} ali {"error":"could not parse"}.`;

  const user = String(body.query ?? "");
  return callClaude({ system, user, expectJson: true, maxTokens: 400 });
}

// ---------------------------------------------------------------------------
// "Vprašaj po podatkih" — combined endpoint. A Slovene question can be EITHER a
// FILTER request ("pokaži vse VINe z resnostjo 3") -> {filter:[...]} OR an
// ANALYTICAL/aggregate question ("koliko vozil, v %?") -> {answer:"…"} answered
// ONLY from the aggregated stats the browser computes (no VINs/PII leave the page).
// Ported from inspectus-vldr (client feedback 2026-06-17).
// ---------------------------------------------------------------------------
export async function runAsk(body: { query?: unknown; stats?: unknown }): Promise<Record<string, unknown>> {
  const query = String(body.query ?? "");
  const stats = body.stats ?? {};
  const system = `Si analitični pomočnik za podatke o poškodbah vozil (INSPECTUS VLDR, standard AIAG-ECG).
Uporabnik postavi vprašanje v slovenščini. Odločì se med dvema načinoma in vrni IZKLJUČNO veljaven JSON:

1) FILTER — če želi prikazati/izpisati določena vozila ali poškodbe po pogoju
   (npr. "pokaži vse VINe z resnostjo 3", "vozila razreda Observation").
   Polja: vin (string), make_model (string), part_code (string), type_code (string),
   severity (int 1-3), class ("No Damage Evidence"|"Damage"|"Observation"), cause (string), comments (string).
   Vrni: {"filter":[{"field":"...","op":"eq|gt|gte|lt|lte|contains","value":...}]}

2) ODGOVOR — če je vprašanje analitično/agregatno (števila, vsote, deleži, odstotki, porazdelitve,
   povprečja, "koliko", "kolikšen delež", "v procentih"). Odgovori v slovenščini, jedrnato in konkretno,
   z uporabo IZKLJUČNO spodnjih statistik (stats). Kjer je smiselno, navedi odstotke (zaokroži na 1 decimalko).
   Ne izmišljuj si številk, ki jih v stats ni. Vrni: {"answer":"…"}
   Polja v stats: vehicle_count, vehicles_damaged, vehicles_with_remarks, total_damage_records,
   class_distribution, severity_histogram, top_damage_codes, damaged_parts (število poškodb po IMENU dela /
   PART TEXT, npr. "Bumper/Cover/Ext-Front" — uporabi za vprašanja po delu, npr. "koliko Front Bumperjev je
   poškodovanih"; imena delov so v angleščini, primerjaj pomensko).

Pomen razredov: "Damage" = dejanska transportna poškodba; "Observation" = manjša opazka; "No Damage Evidence" = brez poškodbe.
"Poškodovano vozilo" pomeni vozilo z vsaj eno poškodbo razreda Damage ali Observation (stats.vehicles_damaged).

Če vprašanja ne razumeš, vrni: {"error":"could not parse"}.`;

  const user = `Vprašanje: ${query}\n\nStatistika (JSON):\n${JSON.stringify(stats)}`;
  return callClaude({ system, user, expectJson: true, maxTokens: 700 });
}

// ---------------------------------------------------------------------------
// VIN photo sorter (vision). Reads the VIN visible in a single damage photo.
// Structured output so the response is clean JSON — no preamble. One call per
// image; the route runs them with a small concurrency cap. Returns vin "" when
// none is legible, and an `error` reason when the AI call itself failed (out of
// credits, bad key, network) so the UI can say "AI unavailable" instead of
// silently leaving every photo unsorted.
// ---------------------------------------------------------------------------
export type VinImage = { id: string; media_type: string; data: string };
export type VinError = "no_api_key" | "credits" | "auth" | "rate_limit" | "api" | "network";
export type VinResult = { id: string; vin: string; error?: VinError };

// A VIN is exactly 17 chars from A–Z (excluding I, O, Q) and 0–9. Rejecting
// anything else turns a model misread (e.g. an 18-char hallucination) into a
// safe "left unsorted for manual sorting" rather than a wrong-vehicle mis-file.
const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;

function classifyVinError(status: number, body: string): VinError {
  const b = body.toLowerCase();
  // Out-of-credits surfaces as 400/402 with a billing message; match a few wordings
  // so a reworded API error still shows the tailored "zmanjkalo dobroimetja" banner.
  if ((status === 400 || status === 402) && (b.includes("credit") || b.includes("insufficient") || b.includes("billing"))) return "credits";
  if (status === 401 || status === 403) return "auth";
  if (status === 429) return "rate_limit";
  return "api";
}

export async function runVinExtract(img: VinImage): Promise<VinResult> {
  if (!apiKey) return { id: img.id, vin: "", error: "no_api_key" };

  let r: Response;
  try {
    r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL_VISION,
        max_tokens: 300,
        system: "Si pregledovalec vozil pri INSPECTUS. Z dane fotografije preberi VIN — 17-mestno identifikacijsko številko vozila — če je viden na tablici, nalepki, vetrobranskem steklu ali oznaki. NE ugibaj: če VIN ni jasno čitljiv, vrni found=false in prazen vin. VIN vsebuje samo velike črke (brez I, O, Q) in številke.",
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: img.media_type, data: img.data } },
            { type: "text", text: "Preberi VIN s te fotografije." },
          ],
        }],
        output_config: {
          format: {
            type: "json_schema",
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["found", "vin"],
              properties: {
                found: { type: "boolean" },
                vin: { type: "string" },
              },
            },
          },
        },
      }),
    });
  } catch {
    return { id: img.id, vin: "", error: "network" };
  }

  if (!r.ok) {
    const body = await r.text().catch(() => "");
    return { id: img.id, vin: "", error: classifyVinError(r.status, body) };
  }

  let data: { content?: { text?: string }[]; stop_reason?: string };
  try {
    data = await r.json() as { content?: { text?: string }[]; stop_reason?: string };
  } catch {
    return { id: img.id, vin: "", error: "api" };
  }
  const text = data.content?.find(b => b.text)?.text ?? "";
  // Empty body, a truncation (max_tokens), or a refusal is an AI failure — NOT a clean
  // "no VIN". Flag it so the inspector retries instead of assuming the photo had no VIN.
  if (!text || data.stop_reason === "max_tokens" || data.stop_reason === "refusal") {
    return { id: img.id, vin: "", error: "api" };
  }
  let parsed: { found?: boolean; vin?: string } = {};
  // On a normal 200 the structured schema guarantees valid JSON; an unparseable body
  // here is anomalous, so treat it as an AI failure rather than a silent clean miss.
  try { parsed = JSON.parse(text); } catch { return { id: img.id, vin: "", error: "api" }; }
  const raw = parsed.found && typeof parsed.vin === "string" ? parsed.vin.trim().toUpperCase() : "";
  // Accept only well-formed VINs; a malformed read is treated as "no VIN" (safe).
  const vin = VIN_RE.test(raw) ? raw : "";
  return { id: img.id, vin };
}
