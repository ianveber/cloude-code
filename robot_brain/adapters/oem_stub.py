"""OEM adapters land here after discovery names the chassis.

Do not import vendor SDKs from cortex or supervisor.
"""

from robot_brain.types import Command, Observation


class OemAdapterStub:
    """Fails closed until a real adapter is implemented."""

    name = "oem_stub"

    def observe(self, now_s: float) -> Observation:
        raise NotImplementedError(
            "OEM HAL is a stub. Name the robot model and SDK in discovery, "
            "then implement HardwareAdapter. Use SimulationAdapter until then."
        )

    def execute(self, command: Command) -> None:
        raise NotImplementedError("OEM HAL is a stub — no actuator writes.")

    @property
    def execute_count(self) -> int:
        return 0
