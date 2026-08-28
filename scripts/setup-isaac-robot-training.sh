#!/usr/bin/env bash
# One-command setup for Isaac Sim + Isaac Lab robot training
# Clones repos, installs dependencies, configures environment
set -euo pipefail

WORKSPACE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ISAACSIM_DIR="${WORKSPACE}/IsaacSim"
ISAACLAB_DIR="${WORKSPACE}/IsaacLab"

echo "=== Isaac Sim Robot Training Setup ==="

# Clone repos if missing
if [[ ! -d "${ISAACSIM_DIR}" ]]; then
  git clone --depth 1 https://github.com/isaac-sim/IsaacSim.git "${ISAACSIM_DIR}"
fi
if [[ ! -d "${ISAACLAB_DIR}" ]]; then
  git clone --depth 1 https://github.com/isaac-sim/IsaacLab.git "${ISAACLAB_DIR}"
fi

# Accept EULA
touch "${ISAACSIM_DIR}/.eula_accepted"

# Run full setup (requires GPU)
exec "${ISAACSIM_DIR}/setup-robot-training.sh" "${1:-pip}"
