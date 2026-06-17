// @ts-nocheck
async function post(path: string, body: unknown) {
  try {
    const r = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!r.ok) return { error: `http_${r.status}` };
    return await r.json();
  } catch (e) {
    return { error: "network", detail: String(e) };
  }
}

export const validate  = (damages: unknown) => post("/api/claude/validate",  { damages });
export const summarize = (stats: unknown)   => post("/api/claude/summarize", stats);
export const filter    = (query: unknown)   => post("/api/claude/filter",    { query });
export const ask       = (query: unknown, stats: unknown) => post("/api/claude/ask", { query, stats });
