from __future__ import annotations

import json
from dataclasses import asdict
from pathlib import Path
from typing import Any, Dict, List, Optional

from robot_brain.adapters.simulation import SimulationAdapter
from robot_brain.safety import SafetySupervisor
from robot_brain.skills import Planner
from robot_brain.types import Mode, PolicyPack, WorkOrder


class Cortex:
    def __init__(self, policy: Optional[PolicyPack] = None, adapter=None):
        self.policy = policy or PolicyPack.default_sim()
        self.adapter = adapter or SimulationAdapter()
        self.supervisor = SafetySupervisor(self.policy)
        self.planner = Planner(self.policy.allowed_skills, self.policy.min_battery_pct)
        self.events: List[Dict[str, Any]] = []
        self.skill_runner_paused = False
        self._ticket_window: List[float] = []

    def step(self, order: WorkOrder, now_s: float) -> Dict[str, Any]:
        obs = self.adapter.observe(now_s)
        intent, commands = self.planner.plan(order, obs)
        execute_fn = None
        if self.policy.mode == Mode.WRITE:
            execute_fn = self.adapter.execute

        verdicts = []
        for cmd in commands:
            v = self.supervisor.evaluate(cmd, obs, now_s, execute_fn=execute_fn)
            verdicts.append(v)
            if v.kind.value in ("deny", "estop") or intent.confidence < 0.7:
                self._note_ticket(now_s, v.reason if v.kind.value in ("deny", "estop") else intent.reason)

        record = {
            "t": now_s,
            "mode": self.policy.mode.value,
            "work_order": {"id": order.id, "job": order.job, "params": order.params},
            "observation": asdict(obs),
            "intent": asdict(intent),
            "verdicts": [v.to_dict() for v in verdicts],
            "adapter_execute_count": self.adapter.execute_count,
            "skill_runner_paused": self.skill_runner_paused,
        }
        self.events.append(record)
        return record

    def _note_ticket(self, now_s: float, reason: str) -> None:
        self._ticket_window = [t for t in self._ticket_window if now_s - t <= 600]
        self._ticket_window.append(now_s)
        if len(self._ticket_window) > 10:
            self.skill_runner_paused = True

    def dump_log(self, path: Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("w", encoding="utf-8") as f:
            for e in self.events:
                f.write(json.dumps(e) + "\n")


def run_loop(
    jobs: List[WorkOrder],
    policy: Optional[PolicyPack] = None,
    adapter=None,
    dt: float = 0.2,
) -> Cortex:
    cortex = Cortex(policy=policy, adapter=adapter)
    t = 0.0
    for order in jobs:
        if cortex.skill_runner_paused:
            break
        cortex.step(order, t)
        t += dt
    return cortex
