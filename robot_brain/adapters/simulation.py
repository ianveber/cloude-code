from __future__ import annotations

import math
from typing import Optional

from robot_brain.types import Command, CommandType, Observation


class SimulationAdapter:
    """Unicycle plant for commissioning the brain without a chassis."""

    name = "simulation"

    def __init__(
        self,
        x: float = 0.0,
        y: float = 0.0,
        yaw: float = 0.0,
        battery_pct: float = 80.0,
        proximity_m: float = 5.0,
        dt: float = 0.2,
    ):
        self.x = x
        self.y = y
        self.yaw = yaw
        self.battery_pct = battery_pct
        self.proximity_m = proximity_m
        self.dt = dt
        self._execute_count = 0
        self.last_command: Optional[Command] = None
        self.localized = True

    def observe(self, now_s: float) -> Observation:
        return Observation(
            x=self.x,
            y=self.y,
            yaw=self.yaw,
            battery_pct=self.battery_pct,
            proximity_m=self.proximity_m,
            stamp_s=now_s,
            localized=self.localized,
        )

    def execute(self, command: Command) -> None:
        self._execute_count += 1
        self.last_command = command
        if command.type == CommandType.ESTOP or command.type == CommandType.HOLD:
            return
        if command.type == CommandType.DOCK:
            self.battery_pct = min(100.0, self.battery_pct + 5.0)
            return
        vx, vy = command.vx, command.vy
        if command.type == CommandType.GOTO and command.target_x is not None and command.target_y is not None:
            dx = command.target_x - self.x
            dy = command.target_y - self.y
            dist = math.hypot(dx, dy)
            if dist < 0.05:
                return
            step = min(0.3, dist)
            vx = step * dx / dist
            vy = step * dy / dist
        self.x += vx * self.dt
        self.y += vy * self.dt
        self.battery_pct = max(0.0, self.battery_pct - 0.02)

    @property
    def execute_count(self) -> int:
        return self._execute_count
