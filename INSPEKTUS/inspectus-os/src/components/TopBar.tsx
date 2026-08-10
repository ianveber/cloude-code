import { getSessionUser } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";

export default async function TopBar() {
  const user = await getSessionUser();
  return (
    <header className="topbar">
      <div style={{ fontWeight: 700, color: "var(--navy-deep)" }}>INSPECTUS Center</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".1em" }}>
          AI · VLDR poveljniški center
        </div>
        {user && (
          <>
            <span style={{ fontSize: 12.5, color: "#374151" }}>{user.email}</span>
            <SignOutButton />
          </>
        )}
      </div>
    </header>
  );
}
