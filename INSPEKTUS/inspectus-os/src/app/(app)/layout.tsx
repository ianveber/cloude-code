import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Auth gate is wired in a later phase. Seed mode (no Supabase env) = open.
  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <TopBar />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
