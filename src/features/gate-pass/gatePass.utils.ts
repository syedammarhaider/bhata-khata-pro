// ============================================================
// FILE 241
// PATH: src/features/gate-pass/gatePass.utils.ts
// ============================================================

import type { GatePass } from "./gatePass.types";

export const validateGatePass = (p: Partial<GatePass>) => {
  const errors: string[] = [];
  if (!p.customerName?.trim()) errors.push("Customer is required.");
  if (!p.vehicleNumber?.trim()) errors.push("Vehicle number is required.");
  if (!p.driverName?.trim()) errors.push("Driver name is required.");
  if (!p.brickGrade?.trim()) errors.push("Brick grade is required.");
  if (!p.destination?.trim()) errors.push("Destination is required.");
  if (!p.quantity || p.quantity <= 0)
    errors.push("Quantity must be greater than zero.");
  return errors;
};

export const filterGatePasses = (items: GatePass[], q: string) =>
  items.filter((p) =>
    `${p.passNumber} ${p.customerName} ${p.vehicleNumber} ${p.driverName}`
      .toLowerCase()
      .includes(q.toLowerCase()),
  );

export const getDispatchedQuantity = (items: GatePass[]) =>
  items
    .filter((p) => p.status === "dispatched" || p.status === "delivered")
    .reduce((s, p) => s + p.quantity, 0);
