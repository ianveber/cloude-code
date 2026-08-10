"use client";
import { useRef, useState } from "react";

interface Props {
  onFile: (f: File) => void;
}

export default function DropZone({ onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) onFile(f);
    // reset so same file can be picked again
    e.target.value = "";
  }

  return (
    <div
      className={`drop-zone${dragging ? " dragover" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        border: "2px dashed #c3ccd4",
        borderRadius: 12,
        padding: "32px 24px",
        textAlign: "center",
        cursor: "pointer",
        transition: "border-color .2s, background .2s",
        marginBottom: 20,
        background: dragging ? "rgba(66,80,96,0.05)" : "#fafafa",
        borderColor: dragging ? "#425060" : "#c3ccd4",
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
      <div style={{ fontWeight: 700, color: "#425060", marginBottom: 4 }}>
        Povlecite SURVEY REPORT.xlsx sem
      </div>
      <div style={{ fontSize: 13, color: "#6b7280" }}>
        ali kliknite za izbiro datoteke (.xlsx, .xls)
      </div>
      <div style={{ fontSize: 12, color: "#9aa3ad", marginTop: 8 }}>
        <a
          href="/sample-survey-report.xlsx"
          download
          onClick={e => e.stopPropagation()}
          style={{ color: "#425060", textDecoration: "underline" }}
        >
          prenesite vzorec
        </a>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </div>
  );
}
