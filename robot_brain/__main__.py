"""CLI: python -m robot_brain --mode sim --log reports/cortex-run.jsonl"""

from __future__ import annotations

import argparse
from pathlib import Path

from robot_brain.adapters.simulation import SimulationAdapter
from robot_brain.cortex import run_loop
from robot_brain.types import Mode, PolicyPack, WorkOrder


def main() -> None:
    parser = argparse.ArgumentParser(description="Veta Cortex simulation / read-only runner")
    parser.add_argument("--mode", choices=["sim", "read_only", "write"], default="sim")
    parser.add_argument("--log", default="reports/cortex-run.jsonl")
    parser.add_argument(
        "--job",
        action="append",
        default=[],
        help="Work order job text. Repeatable. Default: demo patrol then dock.",
    )
    args = parser.parse_args()

    policy = PolicyPack.default_sim()
    policy.mode = Mode(args.mode)
    adapter = SimulationAdapter()
    jobs_text = args.job or ["patrol north wing", "inspect dock 4", "unknown gibberish", "dock"]
    orders = [WorkOrder(id=str(i + 1), job=j) for i, j in enumerate(jobs_text)]
    cortex = run_loop(orders, policy=policy, adapter=adapter)
    log_path = Path(args.log)
    cortex.dump_log(log_path)
    last = cortex.events[-1] if cortex.events else {}
    print(
        f"steps={len(cortex.events)} mode={policy.mode.value} "
        f"executes={adapter.execute_count} log={log_path} "
        f"paused={cortex.skill_runner_paused} last_intent={last.get('intent')}"
    )


if __name__ == "__main__":
    main()
