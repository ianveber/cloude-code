# Isaac Sim Robot Training Stack

This workspace contains a complete Isaac Sim + Isaac Lab setup for GPU-accelerated robot training.

## What's Installed

| Component | Path | Purpose |
|-----------|------|---------|
| **Isaac Sim** (source) | `/workspace/IsaacSim` | NVIDIA Omniverse robotics simulator |
| **Isaac Lab** | `/workspace/IsaacLab` | RL/IL training framework (30+ envs, 16+ robots) |
| **Python venv** | `/workspace/IsaacLab/env_isaaclab` | Isaac Sim 6.0.1 + training deps |
| **Setup script** | `/workspace/IsaacSim/setup-robot-training.sh` | One-command setup on GPU machines |

## Requirements

- **GPU**: NVIDIA RTX 4080 minimum (RTX 5080 / L40S recommended)
- **Driver**: Latest NVIDIA driver supporting CUDA 12.8+
- **OS**: Ubuntu 22.04 or 24.04 (x86_64)
- **RAM**: 32 GB+ recommended
- **Disk**: 50 GB+ free space

> **Note**: This cloud VM has no GPU. Packages are installed but simulation/training requires a GPU machine.

## Quick Start (GPU Machine)

```bash
# 1. Activate environment
cd /workspace/IsaacLab
source env_isaaclab/bin/activate

# 2. Verify Isaac Sim loads
python -c "import isaacsim; print('Isaac Sim OK')"

# 3. Train a quadruped robot (headless, fastest)
./isaaclab.sh -p scripts/reinforcement_learning/rsl_rl/train.py \
  --task=Isaac-Velocity-Flat-Anymal-C-v0 --headless

# 4. Train an ant locomotion task
./isaaclab.sh -p scripts/reinforcement_learning/rsl_rl/train.py \
  --task=Isaac-Ant-v0 --headless

# 5. Launch Isaac Sim GUI
isaacsim
```

## Available Training Tasks

Isaac Lab ships with 30+ ready-to-train environments:

| Category | Example Tasks |
|----------|---------------|
| **Quadrupeds** | `Isaac-Velocity-Flat-Anymal-C-v0`, `Isaac-Velocity-Rough-Unitree-Go2-v0` |
| **Humanoids** | `Isaac-Velocity-Flat-H1-v0`, `Isaac-Velocity-Flat-G1-v0` |
| **Manipulation** | `Isaac-Reach-Franka-v0`, `Isaac-Lift-Cube-Franka-v0` |
| **Classic RL** | `Isaac-Cartpole-v0`, `Isaac-Ant-v0` |

List all tasks:
```bash
./isaaclab.sh -p scripts/environments/list_envs.py
```

## RL Frameworks Supported

- **RSL-RL** (default, GPU-optimized)
- **Stable Baselines 3**
- **RL Games**
- **SKRL**

## Alternative Setup Methods

```bash
# Pip install (recommended — already configured)
./IsaacSim/setup-robot-training.sh pip

# Build from source
./IsaacSim/setup-robot-training.sh source

# Docker container
./IsaacSim/setup-robot-training.sh docker

# Check system requirements
./IsaacSim/setup-robot-training.sh check
```

## Source Build (Isaac Sim GUI)

If you built from source:
```bash
cd /workspace/IsaacSim/_build/linux-x86_64/release
./isaac-sim.sh
```

## Troubleshooting

- **No GPU**: `nvidia-smi` must work. Isaac Sim cannot run without NVIDIA GPU.
- **First launch slow**: Initial startup takes 2-5 minutes (shader compilation).
- **Headless training**: Always use `--headless` flag for faster RL training.
- **EULA**: Accepted at `/workspace/IsaacSim/.eula_accepted`

## Documentation

- [Isaac Sim Docs](https://docs.isaacsim.omniverse.nvidia.com/latest/index.html)
- [Isaac Lab Docs](https://isaac-sim.github.io/IsaacLab)
- [RL Training Tutorial](https://isaac-sim.github.io/IsaacLab/source/tutorials/03_envs/run_rl_training.html)
