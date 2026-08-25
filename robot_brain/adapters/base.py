from __future__ import annotations

from typing import Protocol

from robot_brain.types import Command, Observation


class HardwareAdapter(Protocol):
    name: str

    def observe(self, now_s: float) -> Observation: ...

    def execute(self, command: Command) -> None: ...

    @property
    def execute_count(self) -> int: ...


class ReadOnlySink:
    """Wraps a live adapter so execute() is never forwarded. Audit counter included."""

    def __init__(self, inner: HardwareAdapter):
        self.inner = inner
        self.name = f"read_only({inner.name})"
        self._blocked = 0

    def observe(self, now_s: float) -> Observation:
        return self.inner.observe(now_s)

    def execute(self, command: Command) -> None:
        self._blocked += 1
        raise RuntimeError(
            f"read_only HAL refused execute({command.type.value}); "
            "supervisor must not call execute in read_only/sim except via SimulationAdapter"
        )

    @property
    def execute_count(self) -> int:
        return self.inner.execute_count

    @property
    def blocked_execute_attempts(self) -> int:
        return self._blocked
