// Turns any AI-route error reason into a plain-Slovene phrase for inspectors, so a
// credits / key / rate-limit hiccup never surfaces raw developer jargon (e.g.
// "claude_429", "no_api_key") in client-facing panels. Tolerant of both our typed
// reason tokens and raw upstream error strings.
export function aiErrorMessage(reason?: string | null): string {
  const r = String(reason ?? "").toLowerCase();
  if (/credit|balance|insufficient|402/.test(r)) return "zmanjkalo je dobroimetja na AI računu";
  if (/no_api|api_key|auth|401|unauthor/.test(r)) return "težava z API ključem";
  if (/rate|429|too many/.test(r)) return "preveč zahtev naenkrat — počakaj nekaj sekund";
  if (/network|fetch|timeout|econn/.test(r)) return "omrežna napaka — preveri povezavo";
  return "AI storitev trenutno ni dosegljiva";
}
