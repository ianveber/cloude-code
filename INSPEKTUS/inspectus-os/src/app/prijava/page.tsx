"use client";
import { useActionState } from "react";
import Image from "next/image";
import { signInPassword } from "./actions";

export default function Prijava() {
  const [pwState, pwAction, pwPending] = useActionState(signInPassword, {} as any);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f5f7f9" }}>
      <div style={{ width: 360, background: "#fff", borderRadius: 14, padding: 32, boxShadow: "0 6px 30px rgba(16,42,67,.08)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <Image src="/inspectus-logo.png" alt="INSPECTUS" width={160} height={42} priority />
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--navy-deep)", textAlign: "center", marginBottom: 4 }}>Prijava v Center</h1>
        <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center", marginBottom: 22 }}>Dostop za ekipo INSPECTUS.</p>

        <form action={pwAction}>
          <label style={lbl}>Email</label>
          <input name="email" type="email" required autoComplete="email" style={inp} placeholder="ime@inspectus.si" />
          <label style={lbl}>Geslo</label>
          <input name="password" type="password" required minLength={6} autoComplete="current-password" style={inp} />
          <p style={hint}>Prvič tukaj? Vpiši email in si izberi geslo (vsaj 6 znakov) — račun se ustvari samodejno.</p>
          {pwState?.error && <div style={err}>{pwState.error}</div>}
          {pwState?.notice && <div style={ok}>{pwState.notice}</div>}
          <button type="submit" disabled={pwPending} style={btn}>{pwPending ? "Prijavljam…" : "Prijava"}</button>
        </form>
      </div>
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", margin: "10px 0 4px" };
const inp: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1px solid #d7dee4", borderRadius: 8, fontSize: 14, outline: "none" };
const btn: React.CSSProperties = { width: "100%", marginTop: 18, padding: "11px", background: "var(--navy, #16324f)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" };
const hint: React.CSSProperties = { marginTop: 6, fontSize: 11.5, lineHeight: 1.4, color: "#8a929b" };
const err: React.CSSProperties = { marginTop: 12, color: "#a01f0a", fontSize: 13 };
const ok: React.CSSProperties = { marginTop: 16, color: "var(--success, #1a7f37)", fontSize: 13, fontWeight: 600, textAlign: "center" };
