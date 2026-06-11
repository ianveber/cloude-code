"use client";

import { useState, useTransition } from "react";

type Variant = "inline" | "banner" | "stacked";

type Props = {
  variant?: Variant;
  source?: string;
  buttonLabel?: string;
  placeholder?: string;
};

export default function WaitlistForm({
  variant = "inline",
  source = "landing",
  buttonLabel = "Rezerviraj mesto",
  placeholder = "tvoj@email.si",
}: Props) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [position, setPosition] = useState<number | null>(null);
  const [already, setAlready] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent) return;
    setStatus("idle");
    setMessage("");
    startTransition(async () => {
      try {
        const res = await fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, source, consent: true }),
        });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          setStatus("error");
          setMessage(json.error ?? "Nekaj je šlo narobe.");
          return;
        }
        setStatus("ok");
        setPosition(json.position ?? null);
        setAlready(Boolean(json.already));
        setNeedsConfirm(Boolean(json.needsConfirm));
      } catch {
        setStatus("error");
        setMessage("Mreža ni odzivna. Poskusi znova.");
      }
    });
  };

  if (status === "ok") {
    const { title, sub } = successCopy({ already, needsConfirm, position });
    return (
      <div className={`wl wl-${variant} wl-success`}>
        <div className="wl-success-icon">
          {needsConfirm && !already ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
        </div>
        <div>
          <div className="wl-success-title">{title}</div>
          <div className="wl-success-sub">{sub}</div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`wl wl-${variant}`}>
      <input
        type="email"
        required
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="wl-input"
        aria-label="Email"
      />
      <button type="submit" disabled={isPending || !email || !consent} className="wl-btn">
        {isPending ? "..." : (
          <>
            {buttonLabel}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M5 12h14m-6-6l6 6-6 6" />
            </svg>
          </>
        )}
      </button>
      <label className="wl-consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          aria-label="Soglasje za e-pošto"
        />
        <span>
          Strinjam se, da mi ATHLOS pošilja e-pošto (nasveti za pripravo + novice o lansiranju).{" "}
          <a
            href="/zasebnost"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Politika zasebnosti
          </a>
          . Odjava kadarkoli.
        </span>
      </label>
      {status === "error" && <div className="wl-error">{message}</div>}
    </form>
  );
}

function successCopy({
  already,
  needsConfirm,
  position,
}: {
  already: boolean;
  needsConfirm: boolean;
  position: number | null;
}): { title: string; sub: string } {
  if (already) {
    return {
      title: "Že si na seznamu.",
      sub: "Če še nisi potrdil prijave, preveri email (tudi mapo z neželeno pošto).",
    };
  }
  if (needsConfirm) {
    return {
      title: "Skoraj tam — potrdi email.",
      sub:
        position !== null
          ? `Mesto #${position} med prvimi 100 je rezervirano. Klikni potrditev v emailu, da ga zakleneš.`
          : "Poslali smo ti potrditveno povezavo. Klikni jo, da dokončaš prijavo.",
    };
  }
  // Newsletter tool not wired yet — legacy "you're on the list" behaviour.
  return {
    title: "Si na seznamu.",
    sub:
      position !== null
        ? `Mesto #${position} od prvih 100 z early bird ceno. Pošljemo ti dostop pred lansiranjem.`
        : "Pošljemo ti dostop pred lansiranjem.",
  };
}
