import { KNOWLEDGE } from "./knowledge";

const apiKey = process.env.ANTHROPIC_API_KEY;

// Anthropic API call helper — mirrors inspectus-vldr/api/_lib.mjs exactly.
// Uses prompt-cached knowledge system block on every call.
async function callClaude({
  system,
  user,
  expectJson = false,
  maxTokens = 1024,
}: {
  system: string;
  user: string;
  expectJson?: boolean;
  maxTokens?: number;
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
        model: "claude-sonnet-4-6",
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
