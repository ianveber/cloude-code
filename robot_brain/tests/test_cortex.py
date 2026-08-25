from __future__ import annotations

import unittest

from robot_brain.adapters.simulation import SimulationAdapter
from robot_brain.cortex import Cortex, run_loop
from robot_brain.safety import SafetySupervisor
from robot_brain.types import (
    Command,
    CommandType,
    Mode,
    Observation,
    PolicyPack,
    VerdictKind,
    WorkOrder,
    point_in_polygon,
)


class GeofenceTests(unittest.TestCase):
    def test_square_contains_origin(self):
        poly = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
        self.assertTrue(point_in_polygon(0, 0, poly))
        self.assertFalse(point_in_polygon(2, 0, poly))


class SupervisorTests(unittest.TestCase):
    def setUp(self):
        self.policy = PolicyPack.default_sim()
        self.policy.mode = Mode.READ_ONLY
        self.sup = SafetySupervisor(self.policy)
        self.obs = Observation(0, 0, 0, 80, 5.0, stamp_s=10.0)

    def test_read_only_never_executes(self):
        calls = []

        def boom(cmd):
            calls.append(cmd)

        v = self.sup.evaluate(
            Command(type=CommandType.VELOCITY, vx=0.2, skill_id="goto"),
            self.obs,
            now_s=10.0,
            execute_fn=boom,
        )
        self.assertEqual(v.kind, VerdictKind.ALLOW)
        self.assertFalse(v.executed)
        self.assertEqual(calls, [])
        self.assertEqual(self.sup.execute_calls, 0)

    def test_stale_observation_estop(self):
        v = self.sup.evaluate(
            Command(type=CommandType.VELOCITY, vx=0.2, skill_id="goto"),
            self.obs,
            now_s=12.5,
        )
        self.assertEqual(v.kind, VerdictKind.ESTOP)
        self.assertEqual(v.reason, "stale_observation")

    def test_proximity_estop(self):
        obs = Observation(0, 0, 0, 80, 0.1, stamp_s=10.0)
        v = self.sup.evaluate(
            Command(type=CommandType.VELOCITY, vx=0.2, skill_id="goto"),
            obs,
            now_s=10.0,
        )
        self.assertEqual(v.kind, VerdictKind.ESTOP)
        self.assertEqual(v.reason, "proximity")

    def test_geofence_deny(self):
        v = self.sup.evaluate(
            Command(type=CommandType.GOTO, target_x=50, target_y=50, skill_id="goto"),
            self.obs,
            now_s=10.0,
        )
        self.assertEqual(v.kind, VerdictKind.DENY)
        self.assertEqual(v.reason, "geofence")

    def test_speed_cap_modify(self):
        v = self.sup.evaluate(
            Command(type=CommandType.VELOCITY, vx=4.0, skill_id="goto"),
            self.obs,
            now_s=10.0,
        )
        self.assertEqual(v.kind, VerdictKind.MODIFY)
        self.assertLessEqual(v.command.speed_mps(), self.policy.max_speed_mps + 1e-9)

    def test_write_mode_executes_allow(self):
        self.policy.mode = Mode.WRITE
        self.sup = SafetySupervisor(self.policy)
        adapter = SimulationAdapter()
        v = self.sup.evaluate(
            Command(type=CommandType.VELOCITY, vx=0.2, skill_id="goto"),
            self.obs,
            now_s=10.0,
            execute_fn=adapter.execute,
        )
        self.assertTrue(v.executed)
        self.assertEqual(adapter.execute_count, 1)


class CortexTests(unittest.TestCase):
    def test_inspect_not_confused_with_dock_keyword(self):
        policy = PolicyPack.default_sim()
        cortex = Cortex(policy=policy, adapter=SimulationAdapter())
        rec = cortex.step(WorkOrder("1", "inspect dock 4"), now_s=0.0)
        self.assertEqual(rec["intent"]["skill_id"], "inspect")

    def test_unknown_job_holds(self):
        policy = PolicyPack.default_sim()
        policy.mode = Mode.SIM
        cortex = Cortex(policy=policy, adapter=SimulationAdapter())
        rec = cortex.step(WorkOrder("1", "please dance the macarena"), now_s=0.0)
        self.assertEqual(rec["intent"]["skill_id"], "hold")
        self.assertLess(rec["intent"]["confidence"], 0.7)

    def test_sim_mode_still_executes_on_sim_adapter_only_when_write(self):
        policy = PolicyPack.default_sim()
        policy.mode = Mode.SIM
        adapter = SimulationAdapter()
        cortex = run_loop([WorkOrder("1", "patrol")], policy=policy, adapter=adapter)
        self.assertEqual(adapter.execute_count, 0)
        self.assertGreaterEqual(len(cortex.events), 1)

    def test_write_patrol_moves(self):
        policy = PolicyPack.default_sim()
        policy.mode = Mode.WRITE
        adapter = SimulationAdapter()
        run_loop(
            [WorkOrder("1", "patrol", {"waypoints": [[1.0, 0.0]], "index": 0})],
            policy=policy,
            adapter=adapter,
        )
        self.assertGreater(adapter.execute_count, 0)

    def test_low_battery_replans_dock(self):
        policy = PolicyPack.default_sim()
        adapter = SimulationAdapter(battery_pct=10.0)
        cortex = Cortex(policy=policy, adapter=adapter)
        rec = cortex.step(WorkOrder("1", "patrol"), now_s=0.0)
        self.assertEqual(rec["intent"]["skill_id"], "dock")


if __name__ == "__main__":
    unittest.main()
