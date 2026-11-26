// ============================================================
// FILE 110
// PATH: E:\BRICKSCS\src\features\settings\settings.utils.ts
// ============================================================

import type { BusinessProfile } from "./settings.types";

export function validateBusinessProfile(
  profile: BusinessProfile,
): string[] {
  const errors: string[] = [];

  if (!profile.business_name.trim()) {
    errors.push("Business name is required.");
  }

  if (!profile.owner_name.trim()) {
    errors.push("Owner name is required.");
  }

  if (!profile.phone.trim()) {
    errors.push("Phone number is required.");
  }

  if (profile.email.trim() && !isValidEmail(profile.email)) {
    errors.push("Please enter a valid email address.");
  }

  if (!profile.address.trim()) {
    errors.push("Business address is required.");
  }

  if (!profile.city.trim()) {
    errors.push("City is required.");
  }

  return errors;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "").trim();
}

export function normalizeBusinessProfile(
  profile: BusinessProfile,
): BusinessProfile {
  return {
    business_name: profile.business_name.trim(),
    owner_name: profile.owner_name.trim(),
    phone: normalizePhone(profile.phone),
    email: profile.email.trim().toLowerCase(),
    address: profile.address.trim(),
    city: profile.city.trim(),
    country: profile.country.trim() || "Pakistan",
    currency: profile.currency || "PKR",
    language: profile.language || "en",
  };
}

export function getBusinessDisplayName(
  profile: BusinessProfile | null,
): string {
  return profile?.business_name?.trim() || "Your Brick Kiln";
}
