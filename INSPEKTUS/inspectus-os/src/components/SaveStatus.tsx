"use client";
import { useEffect, useRef, useState } from "react";
import { saveRun } from "@/lib/runs-actions";
import type { RunInput } from "@/lib/runs";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default function SaveStatus({ ready, payload }: { ready: boolean; payload: () => RunInput }) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const savedRef = useRef(false);

  useEffect(() => {
    if (!ready || savedRef.current) return;
    if (!isSupabaseConfigured()) return; // seed mode: nothing to save
    savedRef.current = true;
    setState("saving");
    saveRun(payload())
      .then(r => setState(r.ok ? "saved" : "error"))
      .catch(() => setState("error"));
  }, [ready, payload]);

  if (!isSupabaseConfigured() || state === "idle") return null;
  const map = {
    saving: { t: "Shranjevanje…", c: "#6b7280" },
    saved: { t: "✓ Shranjeno v Zgodovino", c: "var(--success, #1a7f37)" },
    error: { t: "Ni shranjeno — preveri prijavo (izdelki spodaj delujejo).", c: "#a01f0a" },
  } as const;
  const s = map[state];
  return <div style={{ fontSize: 13, fontWeight: 600, color: s.c, margin: "8px 0" }}>{s.t}</div>;
}
