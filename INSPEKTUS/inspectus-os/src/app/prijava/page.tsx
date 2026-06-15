"use client";
import { useActionState, useState } from "react";
import Image from "next/image";
import { signInPassword, sendMagicLink } from "./actions";

export default function Prijava() {
  const [pwState, pwAction, pwPending] = useActionState(signInPassword, {} as any);
  const [mlState, mlAction, mlPending] = useActionState(sendMagicLink, {} as any);
  const [showMagic, setShowMagic] = useState(false);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f5f7f9" }}>
      <div style={{ width: 360, background: "#fff", borderRadius: 14, padding: 32, boxShadow: "0 6px 30px rgba(16,42,67,.08)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <Image src="/inspectus-logo.png" alt="INSPECTUS" width={160} height={42} priority />
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--navy-deep)", textAlign: "center", marginBottom: 4 }}>Prijava v Center</h1>
        <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center", marginBottom: 22 }}>Dostop za ekipo INSPECTUS.</p>

        {!showMagic ? (
          <form action={pwAction}>
            <label style={lbl}>Email</label>
            <input name="email" type="email" required autoComplete="email" style={inp} placeholder="ime@inspectus.si" />
            <label style={lbl}>Geslo</label>
            <input name="password" type="password" required autoComplete="current-password" style={inp} />
            {pwState?.error && <div style={err}>{pwState.error}</div>}
            <button type="submit" disabled={pwPending} style={btn}>{pwPending ? "Prijavljam…" : "Prijava"}</button>
            <button type="button" onClick={() => setShowMagic(true)} style={linkBtn}>Pošlji magično povezavo namesto gesla</button>
          </form>
        ) : (
          <form action={mlAction}>
            <label style={lbl}>Email</label>
            <input name="email" type="email" required autoComplete="email" style={inp} placeholder="ime@inspectus.si" />
            {mlState?.error && <div style={err}>{mlState.error}</div>}
            {mlState?.sent
              ? <div style={ok}>Povezava poslana — preveri svoj email. ✉️</div>
              : <button type="submit" disabled={mlPending} style={btn}>{mlPending ? "Pošiljam…" : "Pošlji povezavo"}</button>}
            <button type="button" onClick={() => setShowMagic(false)} style={linkBtn}>Nazaj na geslo</button>
          </form>
        )}
      </div>
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", margin: "10px 0 4px" };
const inp: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1px solid #d7dee4", borderRadius: 8, fontSize: 14, outline: "none" };
const btn: React.CSSProperties = { width: "100%", marginTop: 18, padding: "11px", background: "var(--navy, #16324f)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" };
const linkBtn: React.CSSProperties = { width: "100%", marginTop: 12, background: "none", border: "none", color: "#6b7280", fontSize: 12.5, cursor: "pointer", textDecoration: "underline" };
const err: React.CSSProperties = { marginTop: 12, color: "#a01f0a", fontSize: 13 };
const ok: React.CSSProperties = { marginTop: 16, color: "var(--success, #1a7f37)", fontSize: 13, fontWeight: 600, textAlign: "center" };
