import { callClaude, readBody, guard, MODEL_HAIKU } from "../_lib.mjs";

export default async function handler(req, res) {
  if (guard(req, res)) return;
  const body = readBody(req);
  const system = `Si vodja kontrole kakovosti pri INSPECTUS (neodvisna nadzorna družba za poškodbe vozil v pristanišču Koper). Napiši kratek, profesionalen povzetek poročila VLDR v slovenščini, 4-6 stavkov, kot bi ga poslal OEM proizvajalcu ali zavarovalnici. Uporabljaj strokovni besednjak: tranzitne poškodbe, prevzem med prevozniki, obseg poškodb. Fokus na trende in poslovne posledice (odgovornost prevoznikov, tveganje odškodninskih zahtevkov), NE naštevaj golih številk. Bodi konservativen ("nakazuje", "kaže na" — ne pravnih zaključkov).
Vrni IZKLJUČNO navadno besedilo v ENEM strnjenem odstavku. PREPOVEDANO: markdown, naslovi ali kakršnekoli oznake (#, *, -, seznami, alineje), označbe tipa [datum] ali [obdobje]. Začni neposredno s prvim stavkom povzetka.`;
  const user = "Statistika:\n" + JSON.stringify(body);
  // Summary is low-stakes generation over aggregate stats → efficient model.
  const result = await callClaude({ system, user, maxTokens: 600, model: MODEL_HAIKU });
  res.status(200).json(result);
}
