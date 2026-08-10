#!/usr/bin/env python3
"""
AIS agency dashboard — Python stdlib HTTP server. No installs.

    python3 agency/dashboard/server.py

Serves two same-origin surfaces so they can share localStorage:

    /            agency dashboard  — engagements, pipeline, economics, library
    /owner       Owner OS          — Theory-of-Constraints board

Port defaults to 4733, override with AIS_DASHBOARD_PORT.
Everything it reads lives under agency/. Nothing outside that directory
is reachable, including via symlink.
"""

from __future__ import annotations

import json
import mimetypes
import os
import re
import sys
from datetime import date
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse, parse_qs, unquote

HERE = Path(__file__).resolve().parent
AGENCY_ROOT = HERE.parent
ENGAGEMENTS = AGENCY_ROOT / "engagements"
PORT = int(os.environ.get("AIS_DASHBOARD_PORT", "4733"))
HOST = os.environ.get("AIS_DASHBOARD_HOST", "127.0.0.1")

SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]{0,63}$")

# Library sections shown in the sidebar, in reading order.
LIBRARY_SECTIONS = ["docs", "verticals", "agents", "delivery", "sales", "ops"]

# Delivery phases, from delivery/phases.md. Order is load-bearing.
PHASES = ["discovery", "scoping", "onboarding", "build", "validation", "handoff", "operate"]
PHASE_LABEL = {
    "discovery": "Discovery",
    "scoping": "Scoping",
    "onboarding": "Onboarding",
    "build": "Build",
    "validation": "Validation",
    "handoff": "Handoff",
    "operate": "Running",
}


# ── path safety ────────────────────────────────────────────────────────────────

def safe_path(relative: str) -> Path | None:
    """Resolve `relative` under AGENCY_ROOT, or None if it escapes.

    Resolves symlinks before comparing, so a link pointing outside the
    agency directory is rejected rather than followed.
    """
    if not relative:
        return None
    candidate = (AGENCY_ROOT / relative.lstrip("/")).resolve()
    root = AGENCY_ROOT.resolve()
    if candidate != root and root not in candidate.parents:
        return None
    return candidate


def valid_slug(slug: str) -> bool:
    return bool(slug) and bool(SLUG_RE.match(slug))


# ── readers — every one returns None rather than raising ───────────────────────

def read_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None


def first_heading(path: Path) -> str | None:
    """The first markdown H1, used as a human title for library files."""
    try:
        with path.open(encoding="utf-8") as fh:
            for _ in range(40):
                line = fh.readline()
                if not line:
                    break
                if line.startswith("# "):
                    return line[2:].strip()
    except OSError:
        pass
    return None


def list_clients() -> list[dict]:
    if not ENGAGEMENTS.is_dir():
        return []
    out = []
    for entry in sorted(ENGAGEMENTS.iterdir()):
        if not entry.is_dir() or entry.name.startswith((".", "_")):
            continue
        meta = read_json(entry / "client.json") or {}
        out.append({
            "slug": entry.name,
            "name": meta.get("name") or entry.name,
            "vertical": meta.get("vertical"),
            "function": meta.get("function"),
            "phase": meta.get("phase"),
            "phase_label": PHASE_LABEL.get(meta.get("phase", ""), meta.get("phase")),
            "next_action": meta.get("next_action"),
            "economics": meta.get("economics"),
            "has_meta": bool(meta),
        })
    return out


def list_client_files(slug: str) -> list[dict]:
    base = ENGAGEMENTS / slug
    if not base.is_dir():
        return []
    files = []
    for path in sorted(base.rglob("*")):
        if not path.is_file() or path.name.startswith("."):
            continue
        rel = path.relative_to(AGENCY_ROOT).as_posix()
        try:
            size = path.stat().st_size
        except OSError:
            size = 0
        files.append({
            "name": path.name,
            "path": rel,
            "folder": path.parent.relative_to(base).as_posix() or ".",
            "size": size,
        })
    return files


def detect_voice_profile(slug: str):
    return read_json(ENGAGEMENTS / slug / "voice-profile.json")


def synthetic_status(slug: str) -> dict | None:
    """Counts for the synthetic corpus, per delivery/synthetic-data.md."""
    base = ENGAGEMENTS / slug / "synthetic"
    if not base.is_dir():
        return None
    corpus = [p for p in (base / "corpus").rglob("*") if p.is_file()] if (base / "corpus").is_dir() else []
    edges = [p for p in (base / "edge-cases").rglob("*") if p.is_file()] if (base / "edge-cases").is_dir() else []
    return {
        "corpus": len(corpus),
        "edge_cases": len(edges),
        "corpus_target": 200,
        "edge_target": 50,
        "ready": len(corpus) >= 200 and len(edges) >= 50,
    }


def client_detail(slug: str) -> dict | None:
    base = ENGAGEMENTS / slug
    if not base.is_dir():
        return None
    meta = read_json(base / "client.json") or {}
    return {
        "slug": slug,
        "meta": meta,
        "phase_label": PHASE_LABEL.get(meta.get("phase", ""), meta.get("phase")),
        "phases": [
            {"key": p, "label": PHASE_LABEL[p],
             "done": PHASES.index(p) < PHASES.index(meta["phase"]) if meta.get("phase") in PHASES else False,
             "current": meta.get("phase") == p}
            for p in PHASES
        ],
        "files": list_client_files(slug),
        "voice_profile": detect_voice_profile(slug),
        "synthetic": synthetic_status(slug),
    }


def list_library() -> list[dict]:
    out = []
    for section in LIBRARY_SECTIONS:
        folder = AGENCY_ROOT / section
        if not folder.is_dir():
            continue
        entries = []
        for path in sorted(folder.glob("*.md")):
            entries.append({
                "name": path.stem,
                "title": first_heading(path) or path.stem,
                "path": path.relative_to(AGENCY_ROOT).as_posix(),
            })
        if entries:
            out.append({"section": section, "entries": entries})
    return out


def repo_state() -> dict:
    clients = list_clients()
    return {
        "agency": "AIS",
        "today": date.today().isoformat(),
        "clients": clients,
        "library": list_library(),
        "counts": {
            "clients": len(clients),
            "running": sum(1 for c in clients if c.get("phase") == "operate"),
            "in_build": sum(1 for c in clients if c.get("phase") in ("onboarding", "build", "validation")),
        },
    }


def create_client(payload: dict) -> tuple[int, dict]:
    slug = (payload.get("slug") or "").strip().lower()
    name = (payload.get("name") or "").strip()
    if not valid_slug(slug):
        return 400, {"error": "Slug must be lowercase letters, numbers and hyphens."}
    if not name:
        return 400, {"error": "Name is required."}
    base = ENGAGEMENTS / slug
    if base.exists():
        return 409, {"error": f"An engagement called {slug} already exists."}

    for sub in ("assets", "synthetic/corpus", "synthetic/edge-cases"):
        (base / sub).mkdir(parents=True, exist_ok=True)

    meta = {
        "slug": slug,
        "name": name,
        "vertical": payload.get("vertical") or "document-operations",
        "function": payload.get("function") or "",
        "phase": "discovery",
        "started": date.today().isoformat(),
        "owners": {"ais": payload.get("owner_ais") or "", "client": ""},
        "volume": "",
        "systems": [],
        "economics": {"currency": "EUR", "build_fee": None, "retainer": None, "run_cost": None},
        "next_action": {"what": "Book discovery call", "owner": payload.get("owner_ais") or "", "due": ""},
        "links": [],
    }
    (base / "client.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    template = AGENCY_ROOT / "templates" / "client-onboarding-template.md"
    starter = template.read_text(encoding="utf-8") if template.is_file() else "# {name}\n\nTODO\n"
    (base / "engagement.md").write_text(starter.replace("{{CLIENT_NAME}}", name).replace("{{SLUG}}", slug), encoding="utf-8")

    return 201, {"created": slug}


# ── http ───────────────────────────────────────────────────────────────────────

class Handler(BaseHTTPRequestHandler):
    server_version = "AIS-Dashboard"
    # Browsers open speculative connections and sit on them. Don't wait forever
    # for a request line that may never arrive.
    timeout = 15

    def log_message(self, fmt, *args):  # quieter console
        sys.stderr.write("  %s\n" % (fmt % args))

    # -- helpers

    def send_json(self, obj, status=200):
        body = json.dumps(obj, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def send_file(self, path: Path, as_text_type: str | None = None):
        if not path.is_file():
            return self.send_json({"error": "Not found"}, 404)
        try:
            data = path.read_bytes()
        except OSError:
            return self.send_json({"error": "Could not read that file"}, 500)
        ctype = as_text_type or mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        if ctype.startswith("text/") or path.suffix in (".md", ".json", ".html", ".css", ".js"):
            if "charset" not in ctype:
                ctype += "; charset=utf-8"
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    # -- routes

    def do_GET(self):
        url = urlparse(self.path)
        route = unquote(url.path)

        if route in ("/", "/index.html"):
            return self.send_file(HERE / "index.html")

        if route in ("/owner", "/owner/", "/owner.html"):
            return self.send_file(HERE / "owner.html")

        if route == "/api/state":
            return self.send_json(repo_state())

        if route.startswith("/api/client/"):
            slug = route[len("/api/client/"):].strip("/")
            if not valid_slug(slug):
                return self.send_json({"error": "Bad slug"}, 400)
            detail = client_detail(slug)
            if detail is None:
                return self.send_json({"error": "No such engagement"}, 404)
            return self.send_json(detail)

        if route == "/file":
            rel = (parse_qs(url.query).get("path") or [""])[0]
            target = safe_path(rel)
            if target is None:
                return self.send_json({"error": "Path is outside the agency folder"}, 403)
            forced = "text/plain" if target.suffix in (".md", ".json") else None
            return self.send_file(target, forced)

        if route.startswith("/asset/"):
            rest = route[len("/asset/"):]
            slug, _, tail = rest.partition("/")
            if not valid_slug(slug) or not tail:
                return self.send_json({"error": "Bad asset path"}, 400)
            target = safe_path(f"engagements/{slug}/assets/{tail}")
            if target is None:
                return self.send_json({"error": "Path is outside the agency folder"}, 403)
            return self.send_file(target)

        return self.send_json({"error": "Not found"}, 404)

    def do_POST(self):
        url = urlparse(self.path)
        if unquote(url.path) != "/api/client":
            return self.send_json({"error": "Not found"}, 404)
        try:
            length = int(self.headers.get("Content-Length") or 0)
            payload = json.loads(self.rfile.read(length) or b"{}")
        except (ValueError, OSError):
            return self.send_json({"error": "Could not read that request"}, 400)
        if not isinstance(payload, dict):
            return self.send_json({"error": "Expected an object"}, 400)
        status, body = create_client(payload)
        return self.send_json(body, status)


def main():
    ENGAGEMENTS.mkdir(parents=True, exist_ok=True)
    # Threaded: a single-threaded server deadlocks the moment a browser opens an
    # idle preconnect socket, because the accept loop blocks reading from it.
    httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    httpd.daemon_threads = True
    print(f"Agency dashboard server: http://{HOST}:{PORT}/")
    print(f"Owner OS:                http://{HOST}:{PORT}/owner")
    print(f"Serving from:            {AGENCY_ROOT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
        httpd.server_close()


if __name__ == "__main__":
    main()
