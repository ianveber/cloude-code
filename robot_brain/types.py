from __future__ import annotations

from dataclasses import asdict, dataclass, field, replace
from enum import Enum
from typing import Any, Dict, List, Optional


class Mode(str, Enum):
    SIM = "sim"
    READ_ONLY = "read_only"
    WRITE = "write"


class CommandType(str, Enum):
    VELOCITY = "velocity"
    GOTO = "goto"
    DOCK = "dock"
    HOLD = "hold"
    ESTOP = "estop"


class VerdictKind(str, Enum):
    ALLOW = "allow"
    MODIFY = "modify"
    DENY = "deny"
    ESTOP = "estop"


@dataclass
class Observation:
    x: float
    y: float
    yaw: float
    battery_pct: float
    proximity_m: float
    stamp_s: float
    localized: bool = True

    def age_s(self, now_s: float) -> float:
        return now_s - self.stamp_s


@dataclass
class Command:
    type: CommandType
    vx: float = 0.0
    vy: float = 0.0
    wz: float = 0.0
    target_x: Optional[float] = None
    target_y: Optional[float] = None
    skill_id: str = "idle"

    def speed_mps(self) -> float:
        return (self.vx**2 + self.vy**2) ** 0.5


@dataclass
class Intent:
    skill_id: str
    params: Dict[str, Any]
    confidence: float
    reason: str = ""


@dataclass
class WorkOrder:
    id: str
    job: str
    params: Dict[str, Any] = field(default_factory=dict)


@dataclass
class PolicyPack:
    version: str
    max_speed_mps: float
    max_accel_mps2: float
    geofence: List[List[float]]  # list of [x, y] polygon, CCW
    min_battery_pct: float
    proximity_halt_m: float
    watchdog_timeout_s: float
    allowed_skills: List[str]
    mode: Mode

    @staticmethod
    def default_sim() -> "PolicyPack":
        return PolicyPack(
            version="0.1.0-sim",
            max_speed_mps=1.0,
            max_accel_mps2=0.5,
            geofence=[[-10.0, -10.0], [10.0, -10.0], [10.0, 10.0], [-10.0, 10.0]],
            min_battery_pct=15.0,
            proximity_halt_m=0.4,
            watchdog_timeout_s=1.0,
            allowed_skills=["idle", "goto", "patrol", "inspect", "dock", "hold"],
            mode=Mode.SIM,
        )


@dataclass
class SafetyVerdict:
    kind: VerdictKind
    reason: str
    command: Command
    executed: bool

    def to_dict(self) -> Dict[str, Any]:
        d = asdict(self)
        d["kind"] = self.kind.value
        d["command"]["type"] = self.command.type.value
        return d


def point_in_polygon(x: float, y: float, polygon: List[List[float]]) -> bool:
    """Ray-casting. Vertices are [x, y]."""
    inside = False
    n = len(polygon)
    if n < 3:
        return False
    j = n - 1
    for i in range(n):
        xi, yi = polygon[i]
        xj, yj = polygon[j]
        intersects = ((yi > y) != (yj > y)) and (
            x < (xj - xi) * (y - yi) / ((yj - yi) or 1e-12) + xi
        )
        if intersects:
            inside = not inside
        j = i
    return inside


def projected_pose(obs: Observation, cmd: Command, dt: float = 0.2) -> tuple[float, float]:
    if cmd.type == CommandType.GOTO and cmd.target_x is not None and cmd.target_y is not None:
        return cmd.target_x, cmd.target_y
    return obs.x + cmd.vx * dt, obs.y + cmd.vy * dt


def scale_command_speed(cmd: Command, max_speed: float) -> Command:
    speed = cmd.speed_mps()
    if speed <= max_speed or speed == 0:
        return cmd
    scale = max_speed / speed
    return replace(cmd, vx=cmd.vx * scale, vy=cmd.vy * scale)
