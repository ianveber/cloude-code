from __future__ import annotations

from typing import List, Tuple

from robot_brain.types import Command, CommandType, Intent, Observation, WorkOrder


CATALOG = ("idle", "goto", "patrol", "inspect", "dock", "hold")

KEYWORDS = {
    "dock": ("dock", "charge", "charger", "home"),
    "inspect": ("inspect", "inspection", "look", "scan"),
    "patrol": ("patrol", "loop", "circuit"),
    "goto": ("goto", "go to", "move to", "navigate"),
    "hold": ("hold", "stop", "wait", "pause"),
    "idle": ("idle", "standby"),
}


class Planner:
    """Deterministic catalog matcher. LLM proposals are out of scope for v0.1."""

    def __init__(self, allowed_skills: List[str], min_battery_pct: float):
        self.allowed_skills = allowed_skills
        self.min_battery_pct = min_battery_pct

    def plan(self, order: WorkOrder, observation: Observation) -> Tuple[Intent, List[Command]]:
        skill, confidence, reason = self._classify(order.job)
        params = dict(order.params)

        if observation.battery_pct < self.min_battery_pct and skill != "dock":
            skill = "dock"
            confidence = 1.0
            reason = "battery_reserve_replan"

        if skill not in self.allowed_skills:
            intent = Intent("hold", {}, 0.0, reason="skill_not_allowed")
            return intent, [Command(type=CommandType.HOLD, skill_id="hold")]

        if confidence < 0.7:
            intent = Intent("hold", {"raw_job": order.job}, confidence, reason=reason)
            return intent, [Command(type=CommandType.HOLD, skill_id="hold")]

        if skill == "goto":
            if "x" not in params or "y" not in params:
                intent = Intent("hold", params, 0.0, reason="missing_goto_params")
                return intent, [Command(type=CommandType.HOLD, skill_id="hold")]
            intent = Intent("goto", params, confidence, reason=reason)
            return intent, [
                Command(
                    type=CommandType.GOTO,
                    target_x=float(params["x"]),
                    target_y=float(params["y"]),
                    skill_id="goto",
                )
            ]

        if skill == "patrol":
            waypoints = params.get("waypoints") or [[2.0, 0.0], [2.0, 2.0], [0.0, 2.0], [0.0, 0.0]]
            idx = int(params.get("index", 0)) % len(waypoints)
            x, y = waypoints[idx]
            intent = Intent("patrol", {"waypoints": waypoints, "index": idx}, confidence, reason=reason)
            return intent, [Command(type=CommandType.GOTO, target_x=x, target_y=y, skill_id="patrol")]

        if skill == "inspect":
            intent = Intent("inspect", params, confidence, reason=reason)
            return intent, [Command(type=CommandType.HOLD, skill_id="inspect")]

        if skill == "dock":
            dock = params.get("dock") or {"x": 0.0, "y": 0.0}
            intent = Intent("dock", dock, confidence, reason=reason)
            return intent, [
                Command(
                    type=CommandType.DOCK,
                    target_x=float(dock.get("x", 0.0)),
                    target_y=float(dock.get("y", 0.0)),
                    skill_id="dock",
                )
            ]

        if skill == "hold":
            intent = Intent("hold", {}, confidence, reason=reason)
            return intent, [Command(type=CommandType.HOLD, skill_id="hold")]

        intent = Intent("idle", {}, 1.0, reason="idle")
        return intent, [Command(type=CommandType.HOLD, skill_id="idle")]

    def _classify(self, job: str) -> Tuple[str, float, str]:
        text = job.lower().strip()
        if text in CATALOG:
            return text, 1.0, "exact"
        best: Tuple[str, str] | None = None
        for skill, words in KEYWORDS.items():
            for w in words:
                if w in text:
                    if best is None or len(w) > len(best[1]):
                        best = (skill, w)
        if best:
            return best[0], 1.0, f"keyword:{best[1]}"
        return "hold", 0.4, "unknown_job"
