
import { APP_CONFIG } from "../lib/constants";

export const APP_METADATA = {
  name: APP_CONFIG.name,
  shortName: APP_CONFIG.shortName,
  version: APP_CONFIG.version,
  description: APP_CONFIG.description,
  defaultRoute: "/dashboard",
  setupRoute: "/setup",
  loginRoute: "/login",
} as const;

export const STORAGE_KEYS = {
  theme: "bkp.theme",
  language: "bkp.language",
  sidebarCollapsed: "bkp.sidebar.collapsed",
  session: "bkp.session",
  onboardingCompleted: "bkp.onboarding.completed",
  dashboardLayout: "bkp.dashboard.layout",
} as const;

export const FEATURE_FLAGS = {
  production: true,
  inventory: true,
  sales: true,
  orders: true,
  invoices: true,
  gatePass: true,
  returns: true,
  customers: true,
  suppliers: true,
  payments: true,
  cashbook: true,
  labour: true,
  attendance: true,
  wages: true,
  coalFuel: true,
  transport: true,
  expenses: true,
  purchases: true,
  reports: true,
  analytics: true,
  customization: true,
  auditHistory: true,
  backupRestore: true,
  licensing: true,
  ownerApplication: true,
} as const;

export const APP_LIMITS = {
  maximumUploadSizeBytes: 10 * 1024 * 1024,
  maximumLogoSizeBytes: 5 * 1024 * 1024,
  maximumSearchLength: 150,
  defaultTablePageSize: 25,
  maximumTablePageSize: 500,
  notificationLimit: 50,
  recentActivityLimit: 20,
} as const;

export const SECURITY_CONFIG = {
  sessionTimeoutMinutes: 30,
  maximumLoginAttempts: 5,
  loginLockoutMinutes: 15,
  requireStrongPassword: true,
  minimumPasswordLength: 10,
  auditSensitiveOperations: true,
  protectFinancialTransactions: true,
} as const;

export const BACKUP_CONFIG = {
  automaticBackupEnabled: true,
  backupIntervalHours: 24,
  maximumAutomaticBackups: 14,
  backupFileExtension: ".bkp",
} as const;

export const LICENSE_CONFIG = {
  expiryWarningDays: 5,
  allowOfflineLicenseValidation: true,
  preserveDatabaseWhenExpired: true,
  requireSignedLicense: true,
} as const;

export const PRINT_CONFIG = {
  defaultPaperSize: "A4",
  defaultOrientation: "portrait",
  defaultCopies: 1,
  supportedPaperSizes: [
    "A4",
    "A5",
    "thermal_58mm",
    "thermal_80mm",
  ],
} as const;

export const APP_ENVIRONMENT = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  platform: "desktop",
  runtime: "tauri",
} as const;
