#!/usr/bin/env python3
"""
Veta Daily Research Agent
Runs every morning at 6:00 AM via launchd.
Reads active projects from Obsidian vault → researches web → writes findings back.
Uses claude-haiku (12x cheaper than Sonnet) via Ruflo cost-routing principle.
"""

import os
import sys
import json
import re
import datetime
import urllib.request
import urllib.error
from pathlib import Path

# ── CONFIG ────────────────────────────────────────────────────────────────────
VAULT      = Path("/Users/ianveber/Documents/Obsidian Vault/_claude-memory")
REPORTS    = Path("/Users/ianveber/Desktop/Cloude CODE/agents/research-agent/reports")
API_KEY    = os.environ.get("ANTHROPIC_API_KEY") or open(Path.home()/".anthropic_key").read().strip() if (Path.home()/".anthropic_key").exists() else None
HAIKU      = "claude-haiku-4-5-20251001"   # cheapest Claude — Ruflo Tier 2 routing
SONNET     = "claude-sonnet-4-6"           # only for final synthesis
LOG_FILE   = Path("/Users/ianveber/Desktop/Cloude CODE/agents/research-agent/research.log")

RESEARCH_TOPICS = [
    {"project": "Ethospheres",  "file": "ethospheres.md",   "queries": ["ethosome cosmesotherapy 2025 2026", "Korean skincare OEM manufacturing news", "clinic skincare professional channel trends"]},
    {"project": "ZaLife",       "file": "zalife.md",        "queries": ["youth leadership bootcamp Slovenia", "leadership programs teenagers Europe 2026"]},
    {"project": "AutoFlow",     "file": "clients/autoflow.md","queries": ["AI lead scoring SaaS market 2026", "email automation AI tools pricing"]},
    {"project": "Veta Agency",  "file": "veta-agency.md",   "queries": ["AI marketing agency Slovenia", "AI native agency pricing models 2026"]},
]

# ── LOGGING ───────────────────────────────────────────────────────────────────
REPORTS.mkdir(parents=True, exist_ok=True)
LOG_FILE.parent.mkdir(parents=True, exist_ok=True)

def log(msg):
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

# ── CLAUDE API (Haiku — cheap tier) ───────────────────────────────────────────
def claude(prompt, model=HAIKU, system=None):
    if not API_KEY:
        log("ERROR: No ANTHROPIC_API_KEY found. Set it in ~/.anthropic_key or env.")
        return None
    messages = [{"role": "user", "content": prompt}]
    body = {"model": model, "max_tokens": 1024, "messages": messages}
    if system:
        body["system"] = system
    data = json.dumps(body).encode()
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=data,
        headers={
            "x-api-key": API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            result = json.loads(r.read())
            return result["content"][0]["text"]
    except Exception as e:
        log(f"Claude API error: {e}")
        return None

# ── WEB FETCH (free — no API key needed) ─────────────────────────────────────
import urllib.parse
import html
import re as _re

def web_search(query):
    """Multi-source search — tries Brave API key if set, falls back to DDG HTML scrape."""
    brave_key = os.environ.get("BRAVE_API_KEY") or (
        open(Path.home()/".brave_key").read().strip()
        if (Path.home()/".brave_key").exists() else None
    )
    if brave_key:
        return _brave_search(query, brave_key)
    return _ddg_search(query)

def _brave_search(query, key):
    """Brave Search API — free tier: 2000 queries/month."""
    encoded = urllib.parse.quote_plus(query)
    url = f"https://api.search.brave.com/res/v1/web/search?q={encoded}&count=5"
    req = urllib.request.Request(url, headers={
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": key
    })
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read())
            results = []
            for item in data.get("web", {}).get("results", [])[:5]:
                title = item.get("title","")
                desc = item.get("description","")
                if title or desc:
                    results.append(f"{title}: {desc}")
            return "\n".join(results)
    except Exception as e:
        log(f"  Brave search failed, falling back to DDG: {e}")
        return _ddg_search(query)

def _ddg_search(query):
    """DuckDuckGo HTML scrape — completely free."""
    encoded = urllib.parse.quote_plus(query)
    url = f"https://html.duckduckgo.com/html/?q={encoded}"
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            "Accept-Language": "en-US,en;q=0.9"
        })
        with urllib.request.urlopen(req, timeout=15) as r:
            raw = r.read().decode("utf-8", errors="ignore")
        # Extract result snippets
        snippets = _re.findall(r'class="result__snippet"[^>]*>(.*?)</a>', raw, _re.DOTALL)
        cleaned = []
        for s in snippets[:6]:
            text = _re.sub(r'<[^>]+>', '', s)
            text = html.unescape(text).strip()
            if len(text) > 30:
                cleaned.append(text)
        return "\n".join(cleaned) if cleaned else ""
    except Exception as e:
        log(f"  DDG search error for '{query}': {e}")
        return ""

# ── READ VAULT CONTEXT ────────────────────────────────────────────────────────
def read_vault_file(filename):
    path = VAULT / filename
    if path.exists():
        return path.read_text(encoding="utf-8")[:3000]
    return ""

# ── WRITE VAULT UPDATE ────────────────────────────────────────────────────────
def write_vault_update(filename, new_section):
    path = VAULT / filename
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(new_section, encoding="utf-8")
        return
    content = path.read_text(encoding="utf-8")
    marker = "## 🔬 Daily Research Updates"
    today = datetime.date.today().isoformat()
    new_block = f"\n\n### {today}\n{new_section}"
    if marker in content:
        # Remove old entries beyond 7 days to keep file lean
        parts = content.split(marker)
        old_updates = parts[1] if len(parts) > 1 else ""
        # Keep last 7 entries
        entries = re.split(r'\n### \d{4}-\d{2}-\d{2}', old_updates)
        recent = entries[-6:] if len(entries) > 6 else entries
        trimmed = "\n### ".join([""] + [e.lstrip("\n") for e in recent if e.strip()])
        path.write_text(parts[0] + marker + trimmed + new_block, encoding="utf-8")
    else:
        path.write_text(content + f"\n\n{marker}" + new_block, encoding="utf-8")
    log(f"  ✅ Updated vault: {filename}")

# ── RESEARCH ONE PROJECT ──────────────────────────────────────────────────────
def research_project(topic):
    project = topic["project"]
    log(f"Researching: {project}")

    # 1. Gather raw web data (free)
    raw_data = []
    for query in topic["queries"]:
        result = web_search(query)
        if result:
            raw_data.append(f"Query: {query}\n{result}")
        else:
            log(f"  No results for: {query}")

    if not raw_data:
        log(f"  ⚠️  No web data found for {project}, skipping")
        return None

    # 2. Synthesize with Haiku (cheap — Ruflo Tier 2)
    vault_context = read_vault_file(topic["file"])
    combined_data = "\n\n---\n\n".join(raw_data)

    synthesis = claude(
        prompt=f"""Here is fresh web research for the {project} project:

{combined_data}

Current vault context (what we already know):
{vault_context[:1000] if vault_context else "No existing context"}

Write a concise research update (max 200 words) covering:
1. Any new trends or developments relevant to this project
2. Competitive moves or market signals
3. One specific actionable insight for Ian

Format as plain text, no headers. Be specific and concrete.""",
        model=HAIKU,
        system="You are a business intelligence analyst. Be concise, specific, and actionable. No fluff."
    )

    if not synthesis:
        return None

    log(f"  🧠 Synthesis complete ({len(synthesis)} chars, Haiku model)")
    return synthesis

# ── GENERATE DAILY REPORT ─────────────────────────────────────────────────────
def generate_report(results):
    today = datetime.date.today().isoformat()
    report_path = REPORTS / f"{today}-research.md"
    lines = [f"# Daily Research — {today}\n", f"*Generated by Veta Research Agent using claude-haiku (Ruflo Tier 2 routing)*\n"]
    for project, finding in results.items():
        lines.append(f"\n## {project}\n")
        lines.append(finding + "\n")
    report_path.write_text("\n".join(lines), encoding="utf-8")
    log(f"📄 Report saved: {report_path}")
    return report_path

# ── MAIN ──────────────────────────────────────────────────────────────────────
def main():
    log("=" * 60)
    log("Veta Research Agent starting (Ruflo Tier 2 / Haiku routing)")
    log("=" * 60)

    if not API_KEY:
        log("FATAL: No API key. Add your Anthropic key to ~/.anthropic_key")
        log("  echo 'your-key-here' > ~/.anthropic_key")
        sys.exit(1)

    results = {}
    errors = []

    for topic in RESEARCH_TOPICS:
        try:
            finding = research_project(topic)
            if finding:
                results[topic["project"]] = finding
                write_vault_update(topic["file"], finding)
        except Exception as e:
            err = f"{topic['project']}: {e}"
            errors.append(err)
            log(f"  ❌ Error — {err}")

    if results:
        report_path = generate_report(results)
        log(f"\n✅ Research complete — {len(results)} projects updated")
        log(f"   Vault updated at: {VAULT}")
        log(f"   Report: {report_path}")
    else:
        log("⚠️  No results gathered — check API key and network")

    if errors:
        log(f"Errors ({len(errors)}): {'; '.join(errors)}")

    log("=" * 60)

if __name__ == "__main__":
    main()
