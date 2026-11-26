// =========================================================
// FILE 562
// PATH: src/features/licensing/licensing.constants.ts
// =========================================================

export const LICENSE_CONFIG = {
  productName: "Bhatta Khata Pro",
  licenseVersion: 1,
  defaultCurrency: "PKR",
  activationRequired: true,
  allowCustomerSelfRenewal: false,
  allowCustomerSelfExtension: false,
  allowOfflineOperation: true,
  allowMultipleDevices: false,
  maximumDevices: 1,
  showOwnerControlsToCustomer: false,
} as const;

export const LICENSE_MESSAGES = {
  notActivated: "Please enter a valid activation key.",
  expired: "Your subscription has expired.",
  suspended: "This software license has been suspended.",
  invalid: "The activation key is invalid.",
  success: "Your software has been activated successfully.",
  renewal: "Your subscription has been renewed.",
  connection: "Connect to the internet to receive your renewal key.",
} as const;
