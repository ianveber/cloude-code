"""Veta Cortex — software brain for OEM robots.

The planner proposes. The supervisor decides. The HAL is the only I/O.
"""

from robot_brain.cortex import Cortex, run_loop
from robot_brain.safety import SafetySupervisor
from robot_brain.types import Command, Intent, Observation, PolicyPack, SafetyVerdict, WorkOrder

__all__ = [
    "Command",
    "Cortex",
    "Intent",
    "Observation",
    "PolicyPack",
    "SafetySupervisor",
    "SafetyVerdict",
    "WorkOrder",
    "run_loop",
]

__version__ = "0.1.0"
