"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Domov" },
  { href: "/obdelava", label: "Nova obdelava" },
  { href: "/zgodovina", label: "Zgodovina" },
  { href: "/nastavitve", label: "Nastavitve" },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="sidebar">
      <Image src="/inspectus-logo.png" alt="INSPECTUS" width={150} height={40} priority />
      <nav style={{ marginTop: 24 }}>
        {NAV.map(n => (
          <Link key={n.href} href={n.href} className={path === n.href ? "active" : ""}>{n.label}</Link>
        ))}
      </nav>
      <div style={{ position: "absolute", bottom: 16, fontSize: 11, color: "#9fb0bd" }}>Poganja AIS Slovenija</div>
    </aside>
  );
}
