from __future__ import annotations

from robot_brain.types import (
    Command,
    CommandType,
    Mode,
    Observation,
    PolicyPack,
    SafetyVerdict,
    VerdictKind,
    point_in_polygon,
    projected_pose,
    scale_command_speed,
)


class SafetySupervisor:
    """Hard policy. No model calls. Must run even if cortex is down."""

    def __init__(self, policy: PolicyPack):
        self.policy = policy
        self.execute_calls = 0

    def evaluate(
        self,
        command: Command,
        observation: Observation,
        now_s: float,
        execute_fn=None,
    ) -> SafetyVerdict:
        policy = self.policy
        mode = policy.mode

        def finish(kind: VerdictKind, reason: str, cmd: Command) -> SafetyVerdict:
            executed = False
            if mode == Mode.WRITE and execute_fn is not None:
                if kind in (VerdictKind.ALLOW, VerdictKind.MODIFY):
                    execute_fn(cmd)
                    executed = True
                    self.execute_calls += 1
                elif kind in (VerdictKind.DENY, VerdictKind.ESTOP):
                    safe = Command(type=CommandType.ESTOP, skill_id=cmd.skill_id)
                    execute_fn(safe)
                    executed = True
                    self.execute_calls += 1
            return SafetyVerdict(kind=kind, reason=reason, command=cmd, executed=executed)

        if observation.age_s(now_s) > policy.watchdog_timeout_s:
            return finish(
                VerdictKind.ESTOP,
                "stale_observation",
                Command(type=CommandType.ESTOP, skill_id=command.skill_id),
            )

        if not observation.localized:
            return finish(VerdictKind.ESTOP, "lost_localization", Command(type=CommandType.ESTOP, skill_id=command.skill_id))

        if observation.proximity_m < policy.proximity_halt_m and command.type not in (
            CommandType.HOLD,
            CommandType.ESTOP,
        ):
            return finish(
                VerdictKind.ESTOP,
                "proximity",
                Command(type=CommandType.ESTOP, skill_id=command.skill_id),
            )

        if (
            observation.battery_pct < policy.min_battery_pct
            and command.type not in (CommandType.DOCK, CommandType.HOLD, CommandType.ESTOP)
        ):
            return finish(VerdictKind.DENY, "battery_reserve", command)

        if command.skill_id not in policy.allowed_skills:
            return finish(VerdictKind.DENY, "skill_not_allowed", command)

        if command.type == CommandType.ESTOP:
            return finish(VerdictKind.ESTOP, "commanded_estop", command)

        px, py = projected_pose(observation, command)
        if not point_in_polygon(px, py, policy.geofence):
            return finish(VerdictKind.DENY, "geofence", command)

        if command.speed_mps() > policy.max_speed_mps:
            modified = scale_command_speed(command, policy.max_speed_mps)
            return finish(VerdictKind.MODIFY, "speed_cap", modified)

        return finish(VerdictKind.ALLOW, "ok", command)
