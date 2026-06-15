import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth";
import { setRole } from "./actions";

export default async function Nastavitve() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="content">
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--navy-deep)" }}>Nastavitve</h1>
        <p style={{ color: "#6b7280", marginTop: 8 }}>Ekipa in vloge bodo na voljo, ko bo povezana baza (seed način).</p>
      </div>
    );
  }

  const supabase = await createClient();
  const user = await getSessionUser();
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user?.id ?? "").single();
  const isAdmin = me?.role === "admin";
  const { data: team } = await supabase.from("profiles").select("id,email,full_name,role,created_at").order("created_at", { ascending: true });

  return (
    <div className="content">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--navy-deep)", marginBottom: 6 }}>Nastavitve</h1>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Ekipa INSPECTUS Center.</p>
      </div>

      <div className="vinfilaj-scroll" style={{ marginBottom: 28 }}>
        <table className="vinfilaj-table">
          <thead><tr><th>Email</th><th>Ime</th><th>Vloga</th><th>Pridružen</th>{isAdmin && <th></th>}</tr></thead>
          <tbody>
            {(team ?? []).map(m => (
              <tr key={m.id}>
                <td>{m.email}</td>
                <td>{m.full_name || "—"}</td>
                <td>{m.role === "admin" ? "Skrbnik" : "Član"}</td>
                <td>{(m.created_at || "").slice(0, 10)}</td>
                {isAdmin && (
                  <td>
                    {m.id !== user?.id && (
                      <form action={setRole}>
                        <input type="hidden" name="id" value={m.id} />
                        <input type="hidden" name="role" value={m.role === "admin" ? "member" : "admin"} />
                        <button type="submit" style={{ fontSize: 12, color: "var(--navy)", background: "none", border: "1px solid #e1e7ec", borderRadius: 7, padding: "4px 9px", cursor: "pointer" }}>
                          {m.role === "admin" ? "Nastavi kot Član" : "Nastavi kot Skrbnik"}
                        </button>
                      </form>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: "#f5f7f9", borderRadius: 12, padding: 20, maxWidth: 560 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--navy-deep)", marginBottom: 8 }}>Kako dodati člana ekipe</h2>
        <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.6 }}>
          Vsak z e-pošto <strong>@inspectus.si</strong> se lahko prijavi sam na strani za prijavo — ob prvi prijavi se ustvari račun.
          Zunanje skrbnike (AIS) doda razvijalec v dovoljeni seznam v bazi.
        </p>
      </div>
    </div>
  );
}
