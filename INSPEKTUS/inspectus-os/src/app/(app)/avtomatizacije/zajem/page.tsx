import Link from "next/link";
import FieldCapture from "@/components/zajem/FieldCapture";

export default function ZajemPage() {
  return (
    <div>
      <p style={{ marginBottom: 8 }}>
        <Link href="/avtomatizacije" style={{ fontSize: 13, color: "#6b7280" }}>← Avtomatizacije</Link>
      </p>
      <FieldCapture />
    </div>
  );
}
