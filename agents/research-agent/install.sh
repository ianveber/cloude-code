#!/bin/bash
set -e

echo "🔬 Installing Veta Research Agent..."

PLIST="com.veta.research-agent"
PLIST_SRC="/Users/ianveber/Desktop/Cloude CODE/agents/research-agent/${PLIST}.plist"
PLIST_DEST="$HOME/Library/LaunchAgents/${PLIST}.plist"
SCRIPT="/Users/ianveber/Desktop/Cloude CODE/agents/research-agent/research-agent.py"

# 1. Check API key
if [ ! -f "$HOME/.anthropic_key" ]; then
  echo ""
  echo "⚠️  No API key found. Enter your Anthropic API key:"
  read -s API_KEY
  echo "$API_KEY" > "$HOME/.anthropic_key"
  chmod 600 "$HOME/.anthropic_key"
  echo "✅ API key saved to ~/.anthropic_key"
fi

# 2. Install Python deps
echo "📦 Installing Python dependencies..."
pip3 install anthropic --quiet

# 3. Make script executable
chmod +x "$SCRIPT"

# 4. Install launchd plist
cp "$PLIST_SRC" "$PLIST_DEST"
launchctl unload "$PLIST_DEST" 2>/dev/null || true
launchctl load "$PLIST_DEST"

echo ""
echo "✅ Research Agent installed and scheduled for 6:00 AM daily"
echo ""
echo "Commands:"
echo "  Run now:     python3 '$SCRIPT'"
echo "  View log:    tail -f '/Users/ianveber/Desktop/Cloude CODE/agents/research-agent/research.log'"
echo "  Uninstall:   launchctl unload '$PLIST_DEST' && rm '$PLIST_DEST'"
echo ""
echo "Reports saved to: /Users/ianveber/Desktop/Cloude CODE/agents/research-agent/reports/"
echo "Vault updates:    /Users/ianveber/Documents/Obsidian Vault/_claude-memory/"
