# Skill: Agent Status Check
**Category:** Agentic OS · Operations · Monitoring
**Status:** READY

## Prompt
Check the status of all 5 Agentic OS agents and report back.

**n8n Agents** (ian199999.app.n8n.cloud):
- Email Agent: https://ian199999.app.n8n.cloud/workflow/4WwekqSJWqzix0AV
- Calendar Agent: https://ian199999.app.n8n.cloud/workflow/6vMBDHDVoYUiw3TY
- Project Agent: https://ian199999.app.n8n.cloud/workflow/t6H02QOssSDlYwFP
- Knowledge Agent: https://ian199999.app.n8n.cloud/workflow/wrMzV3d9EXsLZywL

**Local Agent:**
- File Agent: `launchctl list | grep veta.fileagent`

For each n8n agent, check via the n8n MCP:
1. Is the workflow active (toggle on)?
2. When did it last run?
3. Did the last execution succeed or error?
4. Are credentials properly assigned?

For the File Agent:
1. Is the launchd job installed and running?
2. When did it last run (check log at ~/Documents/Obsidian Vault/Agentic-OS/04-Agent-Logs/file-agent/)?

Report format:
| Agent | Status | Last Run | Last Result | Action Needed |
|-------|--------|----------|-------------|---------------|
