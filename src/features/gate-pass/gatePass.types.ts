// ============================================================
// FILE 239
// PATH: src/features/gate-pass/gatePass.types.ts
// ============================================================

export type GatePassStatus =
  | "prepared"
  | "approved"
  | "dispatched"
  | "delivered"
  | "cancelled";

export interface GatePass {
  id: string;
  passNumber: string;
  orderId?: string;
  customerId: string;
  customerName: string;
  dispatchDate: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  brickGrade: string;
  quantity: number;
  unit: string;
  destination: string;
  status: GatePassStatus;
  notes?: string;
  createdAt: string;
}

export interface GatePassFormData {
  orderId?: string;
  customerId: string;
  customerName: string;
  dispatchDate: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  brickGrade: string;
  quantity: number;
  unit: string;
  destination: string;
  notes?: string;
}
