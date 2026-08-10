import { callClaude, readBody, guard, MODEL_HAIKU } from "../_lib.mjs";

export default async function handler(req, res) {
  if (guard(req, res)) return;
  const body = readBody(req);
  const system = `Pretvori slovensko vprašanje v JSON filter objekt za podatke o poškodbah vozil (INSPECTUS VLDR).
Razpoložljiva polja: vin (string), make_model (string, npr. FORD TRANSIT), part_code (string, npr. 55), type_code (string, npr. 12), severity (int 1-3), class (eno od: "No Damage Evidence"|"Damage"|"Observation"), cause (string, npr. Transport / Warranty), comments (string). Za class uporabi eq z angleško vrednostjo (npr. "Observation").
Vrni IZKLJUČNO: {"filter":[{"field":"...","op":"...","value":...}]} ali {"error":"could not parse"}.`;
  const user = String(body.query ?? "");
  const result = await callClaude({ system, user, expectJson: true, maxTokens: 400, model: MODEL_HAIKU });
  res.status(200).json(result);
}
