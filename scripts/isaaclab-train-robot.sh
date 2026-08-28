#!/usr/bin/env bash
# Quick-start robot training with Isaac Lab
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/activate.sh"

TASK="${1:-Isaac-Velocity-Flat-Anymal-C-v0}"
NUM_ENVS="${2:-4096}"

echo "Starting RL training: ${TASK} with ${NUM_ENVS} parallel environments"
echo "Press Ctrl+C to stop."
echo ""

./isaaclab.sh -p scripts/reinforcement_learning/rsl_rl/train.py \
  --task="${TASK}" \
  --num_envs="${NUM_ENVS}" \
  --headless
