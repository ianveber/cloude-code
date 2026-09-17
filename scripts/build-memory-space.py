#!/usr/bin/env python3
"""Build Memory Space vault data from `_claude-memory/`.

Each note is tagged with the LLM (or person) that wrote it so the viewer
can color Claude orange, ChatGPT blue, and Cursor purple.
"""

from __future__ import annotations

import argparse
import json
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

PALETTE = {
    "claude": {
        "id": "claude",
        "label": "Claude",
        "color": "#F97316",
        "colorDim": "rgba(249, 115, 22, 0.16)",
    },
    "chatgpt": {
        "id": "chatgpt",
        "label": "ChatGPT",
        "color": "#3B82F6",
        "colorDim": "rgba(59, 130, 246, 0.16)",
    },
    "cursor": {
        "id": "cursor",
        "label": "Cursor",
        "color": "#A855F7",
        "colorDim": "rgba(168, 85, 247, 0.16)",
    },
    "ian": {
        "id": "ian",
        "label": "Ian",
        "color": "#2DD4BF",
        "colorDim": "rgba(45, 212, 191, 0.16)",
    },
}

SOURCE_ALIASES = {
    "claude": "claude",
    "anthropic": "claude",
    "sonnet": "claude",
    "haiku": "claude",
    "opus": "claude",
    "chatgpt": "chatgpt",
    "chat": "chatgpt",
    "gpt": "chatgpt",
    "gpt-4": "chatgpt",
    "gpt-5": "chatgpt",
    "openai": "chatgpt",
    "cursor": "cursor",
    "ian": "ian",
    "human": "ian",
    "user": "ian",
}

WIKI_RE = re.compile(
    r"\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]"
)
SOURCE_BLOCK_RE = re.compile(
    r"<!--\s*source:\s*([A-Za-z0-9_-]+)\s*-->(.*?)<!--\s*/source\s*-->",
    re.S | re.I,
)
SOURCE_MARK_RE = re.compile(r"<!--\s*source:\s*([A-Za-z0-9_-]+)\s*-->", re.I)
LEDGER_HEAD_RE = re.compile(
    r"^##\s+(\d{4}-\d{2}-\d{2})\s+[—–-]\s+(.+)$",
    re.M,
)
HANDOFF_RE = re.compile(
    r"^(?:\d{4}-\d{2}-\d{2})-([a-z0-9]+)-to-([a-z0-9]+)\.md$",
    re.I,
)
LAST_UPDATED_RE = re.compile(
    r"^Last updated:\s*(\d{4}-\d{2}-\d{2})\s*$", re.M | re.I
)
H1_RE = re.compile(r"^#\s+(.+?)\s*$", re.M)
FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n?", re.S)
FILES_CHANGED_RE = re.compile(r"(?im)^-\s*Files changed:\s*(.+)$")
BACKTICK_RE = re.compile(r"`([^`]+)`")


def normalize_source(raw: str | None) -> str | None:
    if raw is None:
        return None
    token = str(raw).strip().lower()
    if not token:
        return None
    token = token.split()[0]
    token = token.strip("()[]{},.;:")
    token = token.replace("chat-gpt", "chatgpt")
    return SOURCE_ALIASES.get(token, token if token in PALETTE else None)


def parse_frontmatter(text: str) -> tuple[dict[str, Any], str]:
    match = FRONTMATTER_RE.match(text)
    if not match:
        return {}, text
    data: dict[str, Any] = {}
    key: str | None = None
    for raw_line in match.group(1).splitlines():
        line = raw_line.rstrip()
        if not line.strip() or line.strip().startswith("#"):
            continue
        if line.lstrip().startswith("- ") and key:
            item = line.lstrip()[2:].strip().strip("'\"")
            current = data.get(key)
            if not isinstance(current, list):
                data[key] = [] if current in (None, "") else [current]
            data[key].append(item)
            continue
        if ":" in line and not line.startswith(" "):
            key, value = line.split(":", 1)
            key = key.strip()
            value = value.strip().strip("'\"")
            if value == "":
                data[key] = []
            elif "," in value and not value.startswith("http"):
                data[key] = [part.strip() for part in value.split(",") if part.strip()]
            else:
                data[key] = value
    body = text[match.end() :]
    return data, body


def dump_frontmatter(data: dict[str, Any]) -> str:
    lines = ["---"]
    for key, value in data.items():
        if isinstance(value, list):
            if not value:
                lines.append(f"{key}: []")
            else:
                lines.append(f"{key}:")
                for item in value:
                    lines.append(f"  - {item}")
        elif value is None:
            continue
        else:
            lines.append(f"{key}: {value}")
    lines.append("---")
    lines.append("")
    return "\n".join(lines)


def extract_wiki_links(text: str) -> list[dict[str, str]]:
    links = []
    seen: set[tuple[str, str]] = set()
    for match in WIKI_RE.finditer(text):
        target = match.group(1).strip()
        display = (match.group(3) or target).strip()
        key = (target, display)
        if not target or key in seen:
            continue
        seen.add(key)
        links.append({"target": target, "display": display})
    return links


def extract_inline_sources(text: str) -> list[str]:
    found: list[str] = []
    for match in SOURCE_BLOCK_RE.finditer(text):
        source = normalize_source(match.group(1))
        if source and source not in found:
            found.append(source)
    for match in SOURCE_MARK_RE.finditer(text):
        source = normalize_source(match.group(1))
        if source and source not in found:
            found.append(source)
    return found


def extract_source_spans(text: str) -> list[dict[str, Any]]:
    spans: list[dict[str, Any]] = []
    for match in SOURCE_BLOCK_RE.finditer(text):
        source = normalize_source(match.group(1))
        if not source:
            continue
        spans.append(
            {
                "source": source,
                "text": match.group(2).strip(),
                "start": match.start(),
                "end": match.end(),
            }
        )
    return spans


def writers_from_heading(rest: str) -> list[str]:
    blob = rest.split("(")[0].strip()
    parts = re.split(r"\s*(?:/|,|&|\band\b)\s*", blob)
    return unique(parts)


def parse_ledger(text: str) -> list[dict[str, Any]]:
    matches = list(LEDGER_HEAD_RE.finditer(text))
    entries: list[dict[str, Any]] = []
    for index, match in enumerate(matches):
        start = match.start()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        block = text[start:end].strip()
        writers = writers_from_heading(match.group(2))
        source = writers[0] if writers else None
        files: list[str] = []
        changed = FILES_CHANGED_RE.search(block)
        if changed:
            for path in BACKTICK_RE.findall(changed.group(1)):
                cleaned = path.strip().strip(",")
                if cleaned and cleaned not in files:
                    files.append(cleaned)
        heading = match.group(0).lstrip("# ").strip()
        entries.append(
            {
                "date": match.group(1),
                "source": source or "cursor",
                "sources": writers or ["cursor"],
                "heading": heading,
                "body": block,
                "files": files,
            }
        )
    return entries


def ledger_sources_by_path(entries: list[dict[str, Any]]) -> dict[str, list[str]]:
    mapping: dict[str, list[str]] = defaultdict(list)
    for entry in entries:
        writers = entry.get("sources") or ([entry.get("source")] if entry.get("source") else [])
        for source in writers:
            if not source:
                continue
            for raw in entry.get("files") or []:
                path = raw.replace("\\", "/").lstrip("./")
                if path.endswith("/**"):
                    path = path[:-3]
                if path.startswith("_claude-memory/"):
                    path = path[len("_claude-memory/") :]
                mapping[path].append(source)
                mapping[Path(path).name].append(source)
    return {key: unique(values) for key, values in mapping.items()}


def unique(values: list[str | None]) -> list[str]:
    out: list[str] = []
    for value in values:
        source = normalize_source(value) if value else None
        if source and source not in out:
            out.append(source)
    return out


def note_id_for(rel_path: str) -> str:
    path = rel_path.replace("\\", "/")
    if path.endswith(".md"):
        path = path[:-3]
    return path


def title_from(body: str, rel_path: str) -> str:
    match = H1_RE.search(body)
    if match:
        return match.group(1).strip()
    stem = Path(rel_path).stem
    if stem == "🗺️ Master MOC":
        return "Master MOC"
    return stem.replace("-", " ")


def last_updated_from(frontmatter: dict[str, Any], body: str) -> str | None:
    value = frontmatter.get("last_updated") or frontmatter.get("updated")
    if isinstance(value, str) and value:
        return value[:10]
    match = LAST_UPDATED_RE.search(body)
    if match:
        return match.group(1)
    return None


def sources_for_note(
    rel_path: str,
    frontmatter: dict[str, Any],
    body: str,
    ledger_map: dict[str, list[str]],
) -> tuple[str, list[str]]:
    inline = extract_inline_sources(body)
    fm_source = normalize_source(
        str(frontmatter.get("source") or frontmatter.get("last_writer") or "")
    )
    fm_sources_raw = frontmatter.get("sources") or frontmatter.get("authors") or []
    if isinstance(fm_sources_raw, str):
        fm_sources_raw = [fm_sources_raw]
    fm_sources = unique([str(item) for item in fm_sources_raw])

    name = Path(rel_path).name
    handoff = HANDOFF_RE.match(name)
    handoff_source = normalize_source(handoff.group(1)) if handoff else None

    from_ledger = unique(
        (ledger_map.get(rel_path) or [])
        + (ledger_map.get(name) or [])
        + (ledger_map.get(note_id_for(rel_path)) or [])
    )

    merged = unique(
        [fm_source, handoff_source]
        + fm_sources
        + inline
        + from_ledger
    )
    if not merged:
        merged = ["cursor"]
    primary = fm_source or handoff_source or merged[0]
    if primary not in merged:
        merged.insert(0, primary)
    return primary, merged


def collect_markdown_files(root: Path) -> list[Path]:
    files = [
        path
        for path in root.rglob("*.md")
        if path.is_file() and ".pre-sync-backup" not in path.parts
    ]
    return sorted(files, key=lambda p: str(p).lower())


def build_vault(memory_root: Path) -> dict[str, Any]:
    memory_root = memory_root.resolve()
    ledger_path = memory_root / "ledger.md"
    ledger_entries = parse_ledger(ledger_path.read_text(encoding="utf-8")) if ledger_path.exists() else []
    ledger_map = ledger_sources_by_path(ledger_entries)

    notes: list[dict[str, Any]] = []
    id_set: set[str] = set()

    for path in collect_markdown_files(memory_root):
        rel = path.relative_to(memory_root).as_posix()
        text = path.read_text(encoding="utf-8")
        frontmatter, body = parse_frontmatter(text)
        note_id = note_id_for(rel)
        id_set.add(note_id)
        primary, sources = sources_for_note(rel, frontmatter, body, ledger_map)
        links = extract_wiki_links(body)
        notes.append(
            {
                "id": note_id,
                "path": rel,
                "folder": str(Path(rel).parent).replace("\\", "/") if Path(rel).parent.as_posix() != "." else "",
                "title": title_from(body, rel),
                "body": body,
                "source": primary,
                "sources": sources,
                "spans": extract_source_spans(body),
                "links": links,
                "last_updated": last_updated_from(frontmatter, body),
                "word_count": len(re.findall(r"\S+", body)),
            }
        )

    def resolve_target(target: str) -> str | None:
        cleaned = target.strip().replace("\\", "/")
        if cleaned.endswith(".md"):
            cleaned = cleaned[:-3]
        if cleaned in id_set:
            return cleaned
        lowered = {item.lower(): item for item in id_set}
        if cleaned.lower() in lowered:
            return lowered[cleaned.lower()]
        stem = cleaned.split("/")[-1].lower()
        matches = [item for item in id_set if item.split("/")[-1].lower() == stem]
        if len(matches) == 1:
            return matches[0]
        return None

    backlinks: dict[str, list[str]] = defaultdict(list)
    edges: list[dict[str, str]] = []
    for note in notes:
        resolved = []
        seen_targets: set[str] = set()
        for link in note["links"]:
            target_id = resolve_target(link["target"])
            link["resolved"] = target_id
            if not target_id or target_id in seen_targets:
                continue
            seen_targets.add(target_id)
            resolved.append(target_id)
            backlinks[target_id].append(note["id"])
            edges.append({"from": note["id"], "to": target_id})
        note["resolved_links"] = resolved
        note["backlinks"] = []

    for note in notes:
        note["backlinks"] = backlinks.get(note["id"], [])

    tree = build_tree(notes)
    counts = {key: 0 for key in PALETTE}
    for note in notes:
        for source in note["sources"]:
            if source in counts:
                counts[source] += 1

    return {
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "memory_root": "_claude-memory",
        "palette": PALETTE,
        "counts": counts,
        "notes": notes,
        "edges": edges,
        "ledger": ledger_entries,
        "tree": tree,
        "stats": {
            "notes": len(notes),
            "links": len(edges),
            "ledger_entries": len(ledger_entries),
        },
    }


def build_tree(notes: list[dict[str, Any]]) -> list[dict[str, Any]]:
    folders: dict[str, dict[str, Any]] = {}
    root_notes: list[dict[str, Any]] = []

    for note in sorted(notes, key=lambda n: (n["folder"], n["title"].lower())):
        item = {
            "id": note["id"],
            "title": note["title"],
            "path": note["path"],
            "source": note["source"],
            "sources": note["sources"],
        }
        folder = note["folder"]
        if not folder:
            root_notes.append(item)
            continue
        if folder not in folders:
            folders[folder] = {
                "id": folder,
                "title": folder.split("/")[-1],
                "path": folder,
                "children": [],
            }
        folders[folder]["children"].append(item)

    nodes: list[dict[str, Any]] = []
    nested_ids = set()
    for folder in sorted(folders):
        parent = str(Path(folder).parent).replace("\\", "/")
        if parent in folders and parent != ".":
            folders[parent].setdefault("folders", []).append(folders[folder])
            nested_ids.add(folder)

    for folder, node in folders.items():
        if folder not in nested_ids:
            nodes.append(node)

    return [{"id": "", "title": "vault", "path": "", "children": root_notes, "folders": nodes}]


def stamp_frontmatter(text: str, source: str, extra_sources: list[str] | None = None) -> str:
    data, body = parse_frontmatter(text)
    primary, merged = sources_for_note(
        "stamped.md",
        {**data, "source": source, "sources": extra_sources or data.get("sources") or []},
        body,
        {},
    )
    data["source"] = primary
    data["sources"] = merged
    body = body.lstrip("\n")
    if not body.endswith("\n"):
        body += "\n"
    return dump_frontmatter(data) + body


def stamp_memory_files(memory_root: Path, default_source: str = "cursor") -> int:
    ledger_path = memory_root / "ledger.md"
    ledger_map = ledger_sources_by_path(
        parse_ledger(ledger_path.read_text(encoding="utf-8")) if ledger_path.exists() else []
    )
    changed = 0
    for path in collect_markdown_files(memory_root):
        rel = path.relative_to(memory_root).as_posix()
        original = path.read_text(encoding="utf-8")
        frontmatter, body = parse_frontmatter(original)
        primary, sources = sources_for_note(rel, frontmatter, body, ledger_map)
        if not primary:
            primary = default_source
            sources = unique(sources + [default_source])
        data, body_only = parse_frontmatter(original)
        data["source"] = primary
        data["sources"] = sources
        new_text = dump_frontmatter(data) + body_only.lstrip("\n")
        if not new_text.endswith("\n"):
            new_text += "\n"
        if new_text != original:
            path.write_text(new_text, encoding="utf-8")
            changed += 1
    return changed


def write_vault(vault: dict[str, Any], out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    json_path = out_dir / "vault.json"
    js_path = out_dir / "vault-data.js"
    payload = json.dumps(vault, ensure_ascii=False, indent=2)
    json_path.write_text(payload + "\n", encoding="utf-8")
    js_path.write_text("window.MEMORY_VAULT = " + payload + ";\n", encoding="utf-8")


def repo_root() -> Path:
    return Path(__file__).resolve().parent.parent


def main() -> None:
    parser = argparse.ArgumentParser(description="Build the Memory Space vault index.")
    parser.add_argument(
        "--memory-root",
        default=str(repo_root() / "_claude-memory"),
        help="Path to the markdown vault",
    )
    parser.add_argument(
        "--out",
        default=str(repo_root() / "memory-space"),
        help="Output directory for vault.json / vault-data.js",
    )
    parser.add_argument(
        "--stamp",
        action="store_true",
        help="Write source/sources YAML frontmatter onto memory notes",
    )
    args = parser.parse_args()
    memory_root = Path(args.memory_root)
    if args.stamp:
        count = stamp_memory_files(memory_root)
        print(f"Stamped source frontmatter on {count} notes")
    vault = build_vault(memory_root)
    write_vault(vault, Path(args.out))
    print(
        f"Memory Space vault: {vault['stats']['notes']} notes, "
        f"{vault['stats']['links']} links → {args.out}"
    )


if __name__ == "__main__":
    main()
