"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Markdown } from "./markdown";
import type { ChatMessage, CoachProfile } from "@/lib/coach/types";

const STORAGE_KEY = "athlos.coach.profile.v1";
const CHAT_KEY = "athlos.coach.chat.v1";

const SPORTS = ["Nogomet", "Košarka", "Rokomet", "Atletika", "Rugby", "Borilni športi", "Kolesarstvo", "Smučanje", "Plavanje", "Tenis"];
const LEVELS = ["Rekreativec", "Tekmovalec", "Klubski igralec", "Profesionalec"];
const PHASES = ["Off-season", "Pred-sezona", "Sezona", "Po poškodbi"];
const EQUIPMENT = ["Polna telovadnica", "Domači fitnes", "Samo lastna teža", "Stadion / travnik", "Elastike"];

type Draft = {
  name: string;
  sport: string;
  level: string;
  seasonPhase: string;
  goal: string;
  equipment: string[];
  daysPerWeek: number;
  sessionMinutes: number;
  injuries: string;
};

const EMPTY_DRAFT: Draft = {
  name: "",
  sport: "",
  level: "",
  seasonPhase: "",
  goal: "",
  equipment: [],
  daysPerWeek: 4,
  sessionMinutes: 75,
  injuries: "",
};

function draftToProfile(d: Draft): CoachProfile {
  const now = new Date().toISOString();
  return {
    id:
      d.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40) || "sportnik",
    name: d.name.trim() || "Športnik",
    createdAt: now,
    updatedAt: now,
    profile: {
      sport: d.sport,
      level: d.level,
      goal: d.goal.trim(),
      seasonPhase: d.seasonPhase,
      equipment: d.equipment,
      daysPerWeek: d.daysPerWeek,
      sessionMinutes: d.sessionMinutes,
      injuries: d.injuries
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    },
    plans: [],
    feedback: [],
    memoryNotes: [],
  };
}

export default function CoachChat() {
  const [profile, setProfile] = useState<CoachProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [live, setLive] = useState("");
  const [error, setError] = useState("");
  const [showMemory, setShowMemory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Restore memory. Without a database this browser IS Coach's long-term memory.
  useEffect(() => {
    try {
      const p = localStorage.getItem(STORAGE_KEY);
      if (p) setProfile(JSON.parse(p) as CoachProfile);
      const c = localStorage.getItem(CHAT_KEY);
      if (c) setMessages(JSON.parse(c) as ChatMessage[]);
    } catch {
      /* corrupted storage → start clean rather than crash the app */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (profile) localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (messages.length) localStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-40)));
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, live]);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || streaming) return;
      setError("");
      const next: ChatMessage[] = [...messages, { role: "user", content: text.trim() }];
      setMessages(next);
      setInput("");
      setStreaming(true);
      setLive("");

      try {
        const res = await fetch("/api/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next, profileId: profile?.id, profile }),
        });

        if (!res.ok || !res.body) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || "Coach se ni odzval.");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        let acc = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? ""; // keep the partial line

          for (const line of lines) {
            if (!line.trim()) continue;
            const ev = JSON.parse(line) as {
              type: string;
              v?: string;
              text?: string;
              profile?: CoachProfile;
              truncated?: boolean;
              error?: string;
            };

            if (ev.type === "delta") {
              acc += ev.v ?? "";
              setLive(acc);
            } else if (ev.type === "done") {
              // The server's sanitized text is authoritative — replace, don't append.
              const finalText =
                (ev.text ?? acc) +
                (ev.truncated ? '\n\n⚠️ _Odgovor je bil predolg in odrezan — napiši "nadaljuj"._' : "");
              setMessages([...next, { role: "assistant", content: finalText }]);
              if (ev.profile) setProfile(ev.profile);
              setLive("");
            } else if (ev.type === "error") {
              throw new Error(ev.error || "Napaka.");
            }
          }
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Nekaj je šlo narobe.");
        setLive("");
      } finally {
        setStreaming(false);
      }
    },
    [messages, profile, streaming]
  );

  if (!ready) return <div className="coach-boot">Nalagam…</div>;

  // ── Onboarding ────────────────────────────────────────────────────────────
  if (!profile) {
    const valid = draft.name.trim() && draft.sport && draft.level && draft.seasonPhase && draft.equipment.length;
    return (
      <div className="coach-onboard">
        <div className="coach-eyebrow">Coach · Tim Drenovc protokoli</div>
        <h1 className="coach-title">Povej mi, kdo si</h1>
        <p className="coach-sub">
          Coach si zapomni vse, kar mu poveš. Naslednji plan bo nadgradnja tega — ne začenjaš vsakič znova.
        </p>

        <div className="coach-field">
          <label>Ime</label>
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Tvoje ime" />
        </div>

        <div className="coach-field">
          <label>Šport</label>
          <div className="coach-chips">
            {SPORTS.map((s) => (
              <button key={s} type="button" className={draft.sport === s ? "on" : ""} onClick={() => setDraft({ ...draft, sport: s })}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="coach-field">
          <label>Nivo</label>
          <div className="coach-chips">
            {LEVELS.map((s) => (
              <button key={s} type="button" className={draft.level === s ? "on" : ""} onClick={() => setDraft({ ...draft, level: s })}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="coach-field">
          <label>Faza sezone</label>
          <div className="coach-chips">
            {PHASES.map((s) => (
              <button key={s} type="button" className={draft.seasonPhase === s ? "on" : ""} onClick={() => setDraft({ ...draft, seasonPhase: s })}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="coach-field">
          <label>Oprema</label>
          <div className="coach-chips">
            {EQUIPMENT.map((s) => (
              <button
                key={s}
                type="button"
                className={draft.equipment.includes(s) ? "on" : ""}
                onClick={() =>
                  setDraft({
                    ...draft,
                    equipment: draft.equipment.includes(s)
                      ? draft.equipment.filter((x) => x !== s)
                      : [...draft.equipment, s],
                  })
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="coach-row">
          <div className="coach-field">
            <label>Dni na teden</label>
            <input type="number" min={2} max={7} value={draft.daysPerWeek} onChange={(e) => setDraft({ ...draft, daysPerWeek: Number(e.target.value) })} />
          </div>
          <div className="coach-field">
            <label>Minut na trening</label>
            <input type="number" min={30} max={180} step={15} value={draft.sessionMinutes} onChange={(e) => setDraft({ ...draft, sessionMinutes: Number(e.target.value) })} />
          </div>
        </div>

        <div className="coach-field">
          <label>Cilj</label>
          <input value={draft.goal} onChange={(e) => setDraft({ ...draft, goal: e.target.value })} placeholder="npr. eksplozivnost, hitrost, moč" />
        </div>

        <div className="coach-field">
          <label>Poškodbe / omejitve <span className="coach-opt">(neobvezno, loči z vejico)</span></label>
          <input value={draft.injuries} onChange={(e) => setDraft({ ...draft, injuries: e.target.value })} placeholder="npr. gleženj, koleno" />
        </div>

        <button className="coach-cta" disabled={!valid} onClick={() => setProfile(draftToProfile(draft))}>
          Začni s Coachem
        </button>
      </div>
    );
  }

  // ── Chat ──────────────────────────────────────────────────────────────────
  const p = profile.profile;
  return (
    <div className="coach-shell">
      <header className="coach-head">
        <div>
          <div className="coach-eyebrow">Coach · AI</div>
          <h1 className="coach-name">{profile.name}</h1>
          <div className="coach-meta">
            {p.sport} · {p.level} · {p.seasonPhase}
            {p.injuries.length ? ` · ⚠ ${p.injuries.join(", ")}` : ""}
          </div>
        </div>
        <button className="coach-memory-btn" onClick={() => setShowMemory((v) => !v)}>
          Kaj ve o tebi
          <span className="coach-badge">{profile.memoryNotes.length + profile.plans.length}</span>
        </button>
      </header>

      {showMemory && (
        <div className="coach-memory">
          <div className="coach-memory-col">
            <h4>Naučene opombe</h4>
            {profile.memoryNotes.length ? (
              <ul>
                {profile.memoryNotes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            ) : (
              <p className="coach-empty">Še nič. Coach si zapiše, ko izve nekaj trajnega o tebi.</p>
            )}
          </div>
          <div className="coach-memory-col">
            <h4>Zgodovina planov</h4>
            {profile.plans.length ? (
              <ul>
                {profile.plans
                  .slice(-6)
                  .reverse()
                  .map((pl, i) => (
                    <li key={i}>
                      <span className="coach-date">{(pl.date || "").slice(0, 10)}</span> {pl.summary}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="coach-empty">Še ni planov.</p>
            )}
          </div>
        </div>
      )}

      <div className="coach-scroll" ref={scrollRef}>
        {!messages.length && (
          <div className="coach-starters">
            <p className="coach-empty">Začni tukaj:</p>
            {[
              "Naredi mi plan za naslednji teden.",
              "Kako je bil zadnji teden pretežek — prilagodi naslednjega.",
              "Razloži mi, zakaj je ta faza pomembna.",
            ].map((s) => (
              <button key={s} onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`coach-msg ${m.role}`}>
            {m.role === "assistant" ? <Markdown source={m.content} /> : <p className="coach-p">{m.content}</p>}
          </div>
        ))}

        {streaming && (
          <div className="coach-msg assistant">
            {live ? <Markdown source={live} /> : <div className="coach-typing"><span /><span /><span /></div>}
          </div>
        )}

        {error && <div className="coach-error">{error}</div>}
      </div>

      <form
        className="coach-composer"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={streaming ? "Coach piše…" : "Vprašaj Coacha…"}
          disabled={streaming}
        />
        <button type="submit" disabled={streaming || !input.trim()}>
          Pošlji
        </button>
      </form>
    </div>
  );
}
