// =========================================================
// FILE 564
// PATH: src/features/licensing/licensing.service.ts
// =========================================================

import { invoke } from "@tauri-apps/api/core";

import type {
  LicenseActivationInput,
  LicenseActivationResult,
  LicenseInformation,
} from "./licensing.types";

/**
 * These commands must be registered in Rust lib.rs.
 * The frontend never generates or signs its own license keys.
 */

export async function getLicenseInformation(): Promise<LicenseInformation> {
  return invoke<LicenseInformation>("get_license_information");
}

export async function activateLicense(
  input: LicenseActivationInput,
): Promise<LicenseActivationResult> {
  return invoke<LicenseActivationResult>("activate_license", {
    activationKey: input.activationKey.trim(),
  });
}

export async function checkLicense(): Promise<LicenseInformation> {
  return invoke<LicenseInformation>("check_license");
}
