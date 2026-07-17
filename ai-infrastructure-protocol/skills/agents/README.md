# skills/agents — maintenance note

All skills in this folder are **real directories** (each self-contained, with its own `SKILL.md`).
Do not replace any of them with symlinks. See the iCloud caveat below for why.

## Skills here
| Skill | In SKILLS-MANIFEST | Origin |
|---|---|---|
| agent-browser | yes | bundled from library |
| dispatching-parallel-agents | yes | bundled from library |
| pair-agent | yes | bundled from library |
| scrape | yes | bundled from library |
| whatsapp-ai-agent | yes | bundled from library |
| composio-cli | no | copied from `~/.agents/skills/composio-cli` |
| voice-builder | no | copied from `agents/external-repos/social-media-skills/skills/voice-builder` |
| hook-generator | no | copied from `agents/external-repos/social-media-skills/skills/hook-generator` |

`composio-cli`, `voice-builder`, and `hook-generator` are named in the pillar ③ agent-factory
`SKILL.md` and the `PROTOCOL.md` pillar→skill map, so the operator will try to open them.

## ⚠️ iCloud symlink issue (why these are real dirs, not symlinks)

This repo lives under `~/Desktop/Cloude CODE/`, which is **iCloud-synced**. iCloud Drive
materializes symlinks into their targets on sync — and when the target is a *relative* path
that doesn't resolve inside the synced tree, iCloud leaves the link **dangling** instead.

That is exactly how the three externally-sourced skills above first broke: they were checked in
as `composio-cli -> ../../.agents/skills/composio-cli`, which resolves to
`skills/.agents/skills/composio-cli` (a path that does not exist) rather than `~/.agents/...`.
`skills/agents/<name>/SKILL.md` therefore failed to resolve and the operator hit a dead link.

**Resolution:** the links were repointed to valid absolute targets, and iCloud then materialized
them into complete real-directory copies (verified: full `SKILL.md` + subdirs, not placeholders).
A real directory cannot decay back into a dangling link, so this is the stable form on this path.

**Trade-off:** these three are now **independent copies** — they no longer track their upstream
sources. If an upstream skill is updated, re-sync its copy manually, e.g.:

```sh
cd "ai-infrastructure-protocol/skills/agents"
rm -rf composio-cli && cp -RL ~/.agents/skills/composio-cli composio-cli
```

## Verify all skills resolve

Run from this directory:

```sh
for s in agent-browser composio-cli dispatching-parallel-agents hook-generator \
         pair-agent scrape voice-builder whatsapp-ai-agent; do
  [ -e "$s/SKILL.md" ] && echo "$s OK" || echo "$s BROKEN"
done
```
