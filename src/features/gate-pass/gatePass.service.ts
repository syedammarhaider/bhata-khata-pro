// ============================================================
// FILE 242
// PATH: src/features/gate-pass/gatePass.service.ts
// ============================================================

import type { GatePass, GatePassFormData } from "./gatePass.types";
import { validateGatePass } from "./gatePass.utils";

export function prepareGatePass(data: GatePassFormData): GatePass {
  const errors = validateGatePass(data);
  if (errors.length) throw new Error(errors.join(" "));
  return {
    ...data,
    id: crypto.randomUUID(),
    passNumber: `GP-${Date.now()}`,
    status: "prepared",
    createdAt: new Date().toISOString(),
  };
}

// Preparation only. Inventory deduction and permanent dispatch posting require SQLite transaction integration.
