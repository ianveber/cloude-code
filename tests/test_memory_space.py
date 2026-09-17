#!/usr/bin/env python3
"""Tests for Memory Space vault indexing and LLM source colors."""

from __future__ import annotations

import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BUILDER_PATH = ROOT / "scripts" / "build-memory-space.py"

spec = importlib.util.spec_from_file_location("build_memory_space", BUILDER_PATH)
builder = importlib.util.module_from_spec(spec)
assert spec.loader is not None
sys.modules["build_memory_space"] = builder
spec.loader.exec_module(builder)


class NormalizeSourceTests(unittest.TestCase):
    def test_aliases(self) -> None:
        self.assertEqual(builder.normalize_source("Claude"), "claude")
        self.assertEqual(builder.normalize_source("sonnet"), "claude")
        self.assertEqual(builder.normalize_source("ChatGPT"), "chatgpt")
        self.assertEqual(builder.normalize_source("gpt"), "chatgpt")
        self.assertEqual(builder.normalize_source("cursor (Mac path)"), "cursor")
        self.assertEqual(builder.normalize_source("Ian"), "ian")
        self.assertIsNone(builder.normalize_source("unknown-model"))

    def test_palette_hex(self) -> None:
        self.assertEqual(builder.PALETTE["claude"]["color"], "#F97316")
        self.assertEqual(builder.PALETTE["chatgpt"]["color"], "#3B82F6")
        self.assertEqual(builder.PALETTE["cursor"]["color"], "#A855F7")


class FrontmatterTests(unittest.TestCase):
    def test_roundtrip_sources_list(self) -> None:
        text = "---\nsource: claude\nsources:\n  - claude\n  - cursor\n---\n\n# Hello\n"
        data, body = builder.parse_frontmatter(text)
        self.assertEqual(data["source"], "claude")
        self.assertEqual(data["sources"], ["claude", "cursor"])
        self.assertTrue(body.startswith("# Hello"))

    def test_missing_frontmatter(self) -> None:
        data, body = builder.parse_frontmatter("# Title\n\nBody\n")
        self.assertEqual(data, {})
        self.assertIn("# Title", body)


class WikiAndSpansTests(unittest.TestCase):
    def test_wiki_links(self) -> None:
        text = "See [[ethospheres]] and [[clients/autoflow|AutoFlow]]."
        links = builder.extract_wiki_links(text)
        self.assertEqual(links[0]["target"], "ethospheres")
        self.assertEqual(links[1]["target"], "clients/autoflow")
        self.assertEqual(links[1]["display"], "AutoFlow")

    def test_inline_source_blocks(self) -> None:
        text = (
            "Intro\n"
            "<!-- source:claude -->Orange block<!-- /source -->\n"
            "<!-- source:chatgpt -->Blue block<!-- /source -->\n"
        )
        self.assertEqual(builder.extract_inline_sources(text), ["claude", "chatgpt"])
        spans = builder.extract_source_spans(text)
        self.assertEqual([span["source"] for span in spans], ["claude", "chatgpt"])


class LedgerTests(unittest.TestCase):
    def test_parse_ledger_and_file_map(self) -> None:
        text = """# Ledger

## 2026-09-17 — cursor (Obsidian upgrade)

- Worked on: vault
- Files changed: `_claude-memory/SYNC.md`, `ethospheres.md`

## 2026-09-16 — chatgpt

- Files changed: `context.md`
"""
        entries = builder.parse_ledger(text)
        self.assertEqual(len(entries), 2)
        self.assertEqual(entries[0]["source"], "cursor")
        self.assertEqual(entries[1]["source"], "chatgpt")
        mapping = builder.ledger_sources_by_path(entries)
        self.assertIn("cursor", mapping["SYNC.md"])
        self.assertIn("chatgpt", mapping["context.md"])
        self.assertIn("cursor", mapping["ethospheres.md"])

    def test_shared_heading_writers(self) -> None:
        text = "## 2026-09-17 — ian / cursor\n\n- Files changed: `decisions-log.md`\n"
        entries = builder.parse_ledger(text)
        self.assertEqual(entries[0]["sources"], ["ian", "cursor"])
        mapping = builder.ledger_sources_by_path(entries)
        self.assertEqual(mapping["decisions-log.md"], ["ian", "cursor"])


class VaultBuildTests(unittest.TestCase):
    def test_mixed_sources_and_backlinks(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "context.md").write_text(
                "---\nsource: chatgpt\nsources:\n  - chatgpt\n---\n\n"
                "# Context\n\nSee [[ethospheres]].\n",
                encoding="utf-8",
            )
            (root / "ethospheres.md").write_text(
                "---\nsource: cursor\n---\n\n# Ethospheres\n\n"
                "<!-- source:claude -->Claude added this.<!-- /source -->\n"
                "Back to [[context]].\n",
                encoding="utf-8",
            )
            (root / "ledger.md").write_text(
                "## 2026-09-17 — cursor\n\n- Files changed: `ethospheres.md`\n",
                encoding="utf-8",
            )
            vault = builder.build_vault(root)
            by_id = {note["id"]: note for note in vault["notes"]}
            self.assertEqual(by_id["context"]["source"], "chatgpt")
            self.assertEqual(sorted(by_id["ethospheres"]["sources"]), ["claude", "cursor"])
            self.assertIn("ethospheres", by_id["context"]["resolved_links"])
            self.assertIn("context", by_id["ethospheres"]["backlinks"])
            self.assertGreaterEqual(vault["stats"]["notes"], 3)

    def test_handoff_filename_source(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            handoffs = root / "handoffs"
            handoffs.mkdir()
            (handoffs / "2026-09-17-claude-to-cursor.md").write_text(
                "# Handoff\n\nPickup.\n",
                encoding="utf-8",
            )
            vault = builder.build_vault(root)
            note = vault["notes"][0]
            self.assertEqual(note["source"], "claude")

    def test_real_memory_cloud_builds(self) -> None:
        memory = ROOT / "_claude-memory"
        self.assertTrue(memory.is_dir())
        vault = builder.build_vault(memory)
        self.assertGreaterEqual(vault["stats"]["notes"], 15)
        ids = {note["id"] for note in vault["notes"]}
        self.assertTrue(any("context" == item or item.endswith("context") for item in ids))
        self.assertEqual(vault["palette"]["claude"]["color"], "#F97316")


class StampTests(unittest.TestCase):
    def test_stamp_adds_yaml(self) -> None:
        original = "# Note\n\nHello.\n"
        stamped = builder.stamp_frontmatter(original, "cursor", ["cursor"])
        data, body = builder.parse_frontmatter(stamped)
        self.assertEqual(data["source"], "cursor")
        self.assertIn("cursor", data["sources"])
        self.assertIn("# Note", body)


if __name__ == "__main__":
    unittest.main()
