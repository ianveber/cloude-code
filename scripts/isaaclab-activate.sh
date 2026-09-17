#!/usr/bin/env bash
# Activate Isaac Lab environment for robot training
export ISAACLAB_PATH="/workspace/IsaacLab"
cd "$ISAACLAB_PATH"

# Accept NVIDIA EULA non-interactively
export ACCEPT_EULA=Y
export OMNI_KIT_ACCEPT_EULA=YES

# Activate Python environment
source env_isaaclab/bin/activate

echo "Isaac Lab environment activated."
echo "  PyTorch: $(python -c 'import torch; print(torch.__version__)')"
echo "  CUDA:    $(python -c 'import torch; print("available" if torch.cuda.is_available() else "NOT AVAILABLE (need GPU)")')"
echo ""
echo "Quick commands:"
echo "  Train quadruped:  ./isaaclab.sh -p scripts/reinforcement_learning/rsl_rl/train.py --task=Isaac-Velocity-Flat-Anymal-C-v0 --headless"
echo "  List all tasks:   ./isaaclab.sh -p scripts/environments/list_envs.py"
echo "  Launch GUI:       isaacsim"
