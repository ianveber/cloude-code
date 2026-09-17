#!/usr/bin/env bash
# Isaac Sim + Isaac Lab setup for robot training
# Run on a Linux machine with NVIDIA GPU (RTX 4080+ recommended)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
ISAACLAB_DIR="${WORKSPACE_DIR}/IsaacLab"
ISAACSIM_DIR="${WORKSPACE_DIR}/IsaacSim"

echo "=== Isaac Sim Robot Training Setup ==="
echo "Workspace: ${WORKSPACE_DIR}"

# --- Prerequisites check ---
check_gpu() {
  if ! command -v nvidia-smi &>/dev/null; then
    echo "ERROR: nvidia-smi not found. Isaac Sim requires an NVIDIA GPU."
    echo "  Minimum: RTX 4080 / A40"
    echo "  Recommended: RTX 5080 / L40S"
    exit 1
  fi
  nvidia-smi --query-gpu=name,driver_version,memory.total --format=csv,noheader
}

check_glibc() {
  local glibc_version
  glibc_version=$(ldd --version | head -1 | grep -oP '\d+\.\d+' | head -1)
  echo "GLIBC version: ${glibc_version} (requires 2.35+)"
}

# --- Accept NVIDIA EULA (required for build/run) ---
accept_eula() {
  if [[ ! -f "${ISAACSIM_DIR}/.eula_accepted" ]]; then
    echo "Accepting NVIDIA Isaac Sim EULA..."
    touch "${ISAACSIM_DIR}/.eula_accepted"
  fi
}

# --- Install system dependencies ---
install_system_deps() {
  echo "Installing system dependencies..."
  sudo apt-get update
  sudo apt-get install -y \
    git git-lfs build-essential rsync python3 python3-venv python3-pip \
    gcc-11 g++-11 cmake \
    libgl1-mesa-dev libx11-dev libxcursor-dev libxi-dev libxinerama-dev libxrandr-dev

  sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-11 200
  sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-11 200
}

# --- Pip-based install (recommended for training) ---
setup_pip_training() {
  echo "Setting up Isaac Sim (pip) + Isaac Lab for robot training..."

  if [[ ! -d "${ISAACLAB_DIR}" ]]; then
    git clone --depth 1 https://github.com/isaac-sim/IsaacLab.git "${ISAACLAB_DIR}"
  fi

  # Install uv if missing
  if ! command -v uv &>/dev/null; then
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="${HOME}/.local/bin:${PATH}"
  fi

  cd "${ISAACLAB_DIR}"

  if [[ ! -d env_isaaclab ]]; then
    uv venv env_isaaclab --python 3.12
  fi

  source env_isaaclab/bin/activate
  uv pip install -U pip setuptools wheel

  echo "Installing Isaac Sim 6.0.1 (this may take 15-30 minutes)..."
  uv pip install "isaacsim[all,extscache]==6.0.1.0" \
    --extra-index-url https://pypi.nvidia.com \
    --index-strategy unsafe-best-match \
    --prerelease=allow

  echo "Installing PyTorch with CUDA 12.8..."
  uv pip install -U torch==2.10.0 torchvision==0.25.0 \
    --index-url https://download.pytorch.org/whl/cu128

  echo "Installing Isaac Lab extensions..."
  ./isaaclab.sh --install

  echo ""
  echo "=== Setup complete! ==="
  echo ""
  echo "Activate the environment:"
  echo "  cd ${ISAACLAB_DIR} && source env_isaaclab/bin/activate"
  echo ""
  echo "Train a quadruped robot (headless):"
  echo "  ./isaaclab.sh -p scripts/reinforcement_learning/rsl_rl/train.py --task=Isaac-Velocity-Flat-Anymal-C-v0 --headless"
  echo ""
  echo "Train a humanoid:"
  echo "  ./isaaclab.sh -p scripts/reinforcement_learning/rsl_rl/train.py --task=Isaac-Velocity-Flat-H1-v0 --headless"
  echo ""
  echo "Launch Isaac Sim GUI:"
  echo "  isaacsim"
}

# --- Source build (advanced) ---
setup_source_build() {
  echo "Building Isaac Sim from source..."
  accept_eula
  cd "${ISAACSIM_DIR}"
  git lfs install && git lfs pull
  ./build.sh --skip-compiler-version-check
  echo "Run Isaac Sim:"
  echo "  cd ${ISAACSIM_DIR}/_build/linux-x86_64/release && ./isaac-sim.sh"
}

# --- Docker setup ---
setup_docker() {
  echo "Setting up Docker deployment..."
  sudo apt-get install -y docker.io
  curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | \
    sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
  curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
  sudo apt-get update
  sudo apt-get install -y nvidia-container-toolkit
  sudo nvidia-ctk runtime configure --runtime=docker

  accept_eula
  cd "${ISAACSIM_DIR}"
  ./tools/docker/prep_docker_build.sh --build
  ./tools/docker/build_docker.sh --tag isaac-sim:latest

  echo "Run with GPU:"
  echo "  docker run --rm -e ACCEPT_EULA=Y --gpus all -p 8211:8211 isaac-sim:latest"
}

usage() {
  cat <<EOF
Usage: $0 [pip|source|docker|check]

  pip     Install Isaac Sim via pip + Isaac Lab (recommended for training)
  source  Build Isaac Sim from source
  docker  Build and run Docker container
  check   Verify GPU and system requirements

Default: pip
EOF
}

MODE="${1:-pip}"
case "$MODE" in
  check)
    check_glibc
    check_gpu
    echo "System looks ready."
    ;;
  pip)
    check_glibc
    check_gpu
    install_system_deps
    setup_pip_training
    ;;
  source)
    check_gpu
    install_system_deps
    setup_source_build
    ;;
  docker)
    check_gpu
    install_system_deps
    setup_docker
    ;;
  *)
    usage
    exit 1
    ;;
esac
