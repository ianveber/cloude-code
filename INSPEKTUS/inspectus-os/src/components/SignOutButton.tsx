"use client";
import { signOut } from "@/lib/auth-actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function SignOutButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => start(async () => { await signOut(); router.replace("/prijava"); router.refresh(); })}
      disabled={pending}
      style={{ fontSize: 12, color: "#6b7280", background: "none", border: "1px solid #e1e7ec", borderRadius: 7, padding: "5px 10px", cursor: "pointer" }}
    >
      {pending ? "Odjavljam…" : "Odjava"}
    </button>
  );
}
