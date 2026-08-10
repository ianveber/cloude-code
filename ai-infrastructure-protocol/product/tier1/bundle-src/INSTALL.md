# Install

## Prerequisites (read honestly)

- **Claude Code** installed and working (this toolkit is Claude Code skills). If you don't have it: `code.claude.com`.
- **Basic terminal comfort** — you'll copy a folder and run a few commands. If that sentence worried you, the **Hosted edition** (no terminal) is the version for you — ask about it.
- An **Anthropic API key / Claude Code subscription** for the model calls.

## Steps

**1. Install the skills into your Claude Code.**
```bash
# from the unzipped bundle folder:
cp -R toolkit/skills/* ~/.claude/skills/
```

**2. Put the protocol spine where you'll work from.**
```bash
mkdir -p ~/ai-native && cp -R toolkit/PROTOCOL.md toolkit/pillars toolkit/SKILLS-MANIFEST.md toolkit/DELIVERY-MAP.md ~/ai-native/
```

**3. Verify the skills loaded.** Open Claude Code and type `/` — you should see the protocol's pillar skills and Ian's build skills (`client-pricing-sheet`, `ian-design-standards`) in the list.

**4. Install the companion skills** you'll want — see `COMPANION-SKILLS.md`. You don't need all of them to start; the RUNBOOKs tell you which apply at each gate.

**5. The course PDFs** live in `course/`. Keep them open as you go — start with `00-operating-manual.pdf`.

## Verify install
```bash
ls ~/.claude/skills/ | grep -E "ian-design-standards|client-pricing-sheet" && echo "skills OK"
ls ~/ai-native/PROTOCOL.md && echo "protocol OK"
```
Both lines should print `OK`.

Next → **`QUICKSTART.md`**.
