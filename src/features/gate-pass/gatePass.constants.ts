// ============================================================
// FILE 240
// PATH: src/features/gate-pass/gatePass.constants.ts
// ============================================================

import type { GatePassStatus } from "./gatePass.types";

export const GATE_PASS_STATUSES: GatePassStatus[] = [
  "prepared",
  "approved",
  "dispatched",
  "delivered",
  "cancelled",
];

export const GATE_PASS_STATUS_LABELS: Record<GatePassStatus, string> = {
  prepared: "Prepared",
  approved: "Approved",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const GATE_PASS_UNITS = ["Bricks", "Thousand bricks"];
export const GATE_PASS_PREFIX = "GP";
