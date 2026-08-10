import { callClaude, readBody, guard } from "../_lib.mjs";

// Combined "Vprašaj po podatkih" endpoint. A Slovenian question can be EITHER:
//   • a FILTER request ("pokaži vse VINe z resnostjo 3")        -> {"filter":[{field,op,value}]}
//   • an ANALYTICAL/aggregate question ("koliko vozil, v %?")    -> {"answer":"… slovenščina …"}
// The analytical branch answers ONLY from the aggregated `stats` the browser computes client-side
// (no VINs/PII leave the browser). Falls back to {"error":"..."} when it can't parse the question.
export default async function handler(req, res) {
  if (guard(req, res)) return;
  const body = readBody(req);
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
   Polja v stats: vehicle_count (vsa vozila), vehicles_damaged (poškodovana vozila), vehicles_with_remarks,
   total_damage_records (vsi zapisi poškodb), class_distribution (po razredih), severity_histogram (po resnosti 1-3),
   top_damage_codes (PART-TYPE kode), damaged_parts (število poškodb po IMENU dela / PART TEXT, npr.
   "Bumper/Cover/Ext-Front" — uporabi za vprašanja po delu, npr. "koliko Front Bumperjev / sprednjih odbijačev je
   poškodovanih"; imena delov so v angleščini, primerjaj pomensko).

Pomen razredov: "Damage" = dejanska transportna poškodba; "Observation" = manjša opazka; "No Damage Evidence" = brez poškodbe.
"Poškodovano vozilo" pomeni vozilo z vsaj eno poškodbo razreda Damage ali Observation (stats.vehicles_damaged).

Če vprašanja ne razumeš, vrni: {"error":"could not parse"}.`;

  const user = `Vprašanje: ${query}\n\nStatistika (JSON):\n${JSON.stringify(stats)}`;
  const result = await callClaude({ system, user, expectJson: true, maxTokens: 700 });
  res.status(200).json(result);
}
