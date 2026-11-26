// =========================================================
// FILE 561
// PATH: src/features/licensing/licensing.types.ts
// =========================================================

export type LicenseStatus =
  | "active"
  | "expired"
  | "not_activated"
  | "suspended"
  | "invalid";

export interface LicensePayload {
  licenseId: string;
  customerId: string;
  businessName: string;
  deviceId: string;
  issuedAt: number;
  expiresAt: number;
  issuedBy: string;
  version: number;
}

export interface LicenseInformation {
  status: LicenseStatus;
  customerName: string | null;
  licenseId: string | null;
  expiresAt: number | null;
  daysRemaining: number | null;
  deviceId: string | null;
}

export interface LicenseActivationInput {
  activationKey: string;
}

export interface LicenseActivationResult {
  success: boolean;
  message: string;
  license?: LicenseInformation;
}

export interface LicenseHistoryEntry {
  id: string;
  action: "activated" | "renewed" | "expired" | "suspended";
  date: string;
  description: string;
}
