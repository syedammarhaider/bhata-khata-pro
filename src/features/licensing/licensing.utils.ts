// =========================================================
// FILE 563
// PATH: src/features/licensing/licensing.utils.ts
// =========================================================

import type { LicenseInformation } from "./licensing.types";

function toMilliseconds(timestampSeconds: number): number {
  return timestampSeconds * 1000;
}

export function getDaysRemaining(expiresAt: number): number {
  const remaining = toMilliseconds(expiresAt) - Date.now();
  return Math.max(0, Math.ceil(remaining / 86400000));
}

export function isLicenseExpired(expiresAt: number): boolean {
  return Date.now() >= toMilliseconds(expiresAt);
}

export function formatLicenseDate(timestamp: number): string {
  return new Date(toMilliseconds(timestamp)).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getLicenseStatusLabel(
  status: LicenseInformation["status"],
): string {
  const labels: Record<LicenseInformation["status"], string> = {
    active: "Active",
    expired: "Expired",
    not_activated: "Not Activated",
    suspended: "Suspended",
    invalid: "Invalid License",
  };

  return labels[status];
}
