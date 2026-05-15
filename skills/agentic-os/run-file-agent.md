# Skill: Run File Agent
**Category:** Agentic OS · Operations · Files
**Status:** READY

## Prompt
Run the File Agent to organise files on Ian's Mac.

File Agent script: /Users/ianveber/Desktop/Cloude CODE/agents/file-agent/file-agent.py

Steps:
1. First, run a dry-run to see what would be moved:
   `python3 '/Users/ianveber/Desktop/Cloude CODE/agents/file-agent/file-agent.py' --dry-run`

2. Review the output — confirm the moves look correct

3. If confirmed, run the real sort:
   `python3 '/Users/ianveber/Desktop/Cloude CODE/agents/file-agent/file-agent.py'`

4. Check the log written to:
   `/Users/ianveber/Documents/Obsidian Vault/Agentic-OS/04-Agent-Logs/file-agent/[today's date].md`

5. Report back: how many files moved, any errors, what went where

The agent scans: ~/Downloads and ~/Desktop
It skips: project folders (STARTUP, CASTRUM, ZALIFE, aisos, vetaads, etc.), dotfiles, Obsidian Vault, Cloude CODE
It handles: AI media (hf_ prefix → vetaads), screenshots → ~/Desktop/screenshots/YYYY-MM/, PDFs → ~/Documents/PDFs/, etc.
