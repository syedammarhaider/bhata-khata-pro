
import type {
  LanguageCode,
  PermissionAction,
  PermissionModule,
  UserRole,
} from "../types";

/* ============================================================
   APPLICATION INFORMATION
   ============================================================ */

export const APP_CONFIG = {
  name: "Bhatta Khata Pro",
  shortName: "BKP",
  version: "1.0.0",
  description: "Brick Kiln Management ERP",
  developer: "Bhatta Khata Pro",
  defaultCurrency: "PKR",
  defaultCountry: "Pakistan",
  defaultLanguage: "en" as LanguageCode,
  databaseName: "bhatta-khata-pro.db",
  supportEmail: "",
  supportPhone: "",
} as const;

/* ============================================================
   USER ROLES
   ============================================================ */

export const USER_ROLES: Record<UserRole, string> = {
  admin: "Administrator",
  manager: "Manager",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin: "Full access to business operations, financials and settings.",
  manager: "Restricted access to assigned operational modules.",
};

/* ============================================================
   PERMISSION ACTIONS
   ============================================================ */

export const PERMISSION_ACTIONS: PermissionAction[] = [
  "view",
  "create",
  "edit",
  "delete",
  "approve",
  "print",
  "export",
];

/* ============================================================
   MODULE DEFINITIONS
   ============================================================ */

export interface ModuleDefinition {
  id: PermissionModule;
  label: string;
  description: string;
  route: string;
  icon: string;
  group: NavigationGroup;
  adminOnly?: boolean;
  managerDefaultAccess?: boolean;
}

export type NavigationGroup =
  | "overview"
  | "operations"
  | "business"
  | "accounts"
  | "management"
  | "system";

export const MODULES: ModuleDefinition[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Business overview and performance",
    route: "/dashboard",
    icon: "LayoutDashboard",
    group: "overview",
    managerDefaultAccess: true,
  },
  {
    id: "production",
    label: "Production",
    description: "Pathai, Bhari, Nikasi and production batches",
    route: "/production",
    icon: "Factory",
    group: "operations",
    managerDefaultAccess: true,
  },
  {
    id: "inventory",
    label: "Inventory",
    description: "Brick stock, grades and stock movements",
    route: "/inventory",
    icon: "Boxes",
    group: "operations",
    managerDefaultAccess: true,
  },
  {
    id: "sales",
    label: "Sales",
    description: "Sales transactions and sales records",
    route: "/sales",
    icon: "ShoppingCart",
    group: "operations",
    managerDefaultAccess: true,
  },
  {
    id: "orders",
    label: "Orders",
    description: "Customer orders and delivery tracking",
    route: "/orders",
    icon: "ClipboardList",
    group: "operations",
    managerDefaultAccess: true,
  },
  {
    id: "gate_pass",
    label: "Gate Pass",
    description: "Brick dispatch and vehicle gate passes",
    route: "/gate-pass",
    icon: "Truck",
    group: "operations",
    managerDefaultAccess: true,
  },
  {
    id: "customers",
    label: "Customers",
    description: "Customer information and khata ledger",
    route: "/customers",
    icon: "Users",
    group: "business",
    managerDefaultAccess: true,
  },
  {
    id: "suppliers",
    label: "Suppliers",
    description: "Supplier records and outstanding balances",
    route: "/suppliers",
    icon: "Contact",
    group: "business",
    managerDefaultAccess: true,
  },
  {
    id: "payments",
    label: "Payments",
    description: "Receipts, payments and payment history",
    route: "/payments",
    icon: "Wallet",
    group: "accounts",
    managerDefaultAccess: false,
  },
  {
    id: "labour",
    label: "Labour",
    description: "Worker records and labour management",
    route: "/labour",
    icon: "HardHat",
    group: "operations",
    managerDefaultAccess: true,
  },
  {
    id: "attendance",
    label: "Attendance",
    description: "Daily worker attendance",
    route: "/attendance",
    icon: "CalendarCheck",
    group: "operations",
    managerDefaultAccess: true,
  },
  {
    id: "wages",
    label: "Wages",
    description: "Worker wages, advances and settlements",
    route: "/wages",
    icon: "Banknote",
    group: "accounts",
    managerDefaultAccess: false,
  },
  {
    id: "coal_fuel",
    label: "Coal & Fuel",
    description: "Fuel purchases, usage and remaining stock",
    route: "/coal-fuel",
    icon: "Flame",
    group: "operations",
    managerDefaultAccess: true,
  },
  {
    id: "expenses",
    label: "Expenses",
    description: "Business expenses and expense categories",
    route: "/expenses",
    icon: "Receipt",
    group: "accounts",
    managerDefaultAccess: false,
  },
  {
    id: "purchases",
    label: "Purchases",
    description: "Supplier purchases and purchase records",
    route: "/purchases",
    icon: "ShoppingBag",
    group: "business",
    managerDefaultAccess: true,
  },
  {
    id: "reports",
    label: "Reports",
    description: "Business, financial and operational reports",
    route: "/reports",
    icon: "FileBarChart",
    group: "management",
    managerDefaultAccess: false,
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Business trends and performance analysis",
    route: "/analytics",
    icon: "ChartNoAxesCombined",
    group: "management",
    managerDefaultAccess: false,
  },
  {
    id: "backup_restore",
    label: "Backup & Restore",
    description: "Create and restore database backups",
    route: "/backup-restore",
    icon: "DatabaseBackup",
    group: "system",
    adminOnly: true,
  },
  {
    id: "admin",
    label: "Admin Panel",
    description: "Sales monitoring, audit trail and security",
    route: "/admin",
    icon: "Shield",
    group: "system",
    adminOnly: true,
  },
  {
    id: "settings",
    label: "Settings",
    description: "Business, printer, language and application settings",
    route: "/settings",
    icon: "Settings",
    group: "system",
    adminOnly: true,
  },
];

/* ============================================================
   NAVIGATION GROUPS
   ============================================================ */

export const NAVIGATION_GROUPS: {
  id: NavigationGroup;
  label: string;
}[] = [
  { id: "overview", label: "Overview" },
  { id: "operations", label: "Operations" },
  { id: "business", label: "Business" },
  { id: "accounts", label: "Accounts" },
  { id: "management", label: "Management" },
  { id: "system", label: "System" },
];

/* ============================================================
   DEFAULT ROLE ACCESS
   These are UI defaults only. The Rust backend must enforce
   permissions independently before accessing protected data.
   ============================================================ */

export const DEFAULT_ROLE_ACCESS: Record<
  UserRole,
  PermissionModule[]
> = {
  admin: MODULES.map((module) => module.id),

  manager: MODULES
    .filter((module) => module.managerDefaultAccess)
    .map((module) => module.id),
};

export const ADMIN_ONLY_MODULES: PermissionModule[] = MODULES
  .filter((module) => module.adminOnly)
  .map((module) => module.id);

/* ============================================================
   DEFAULT PERMISSION GENERATOR
   ============================================================ */

export function getDefaultPermissions(
  role: UserRole,
): PermissionModule[] {
  return [...DEFAULT_ROLE_ACCESS[role]];
}

export function canAccessModule(
  role: UserRole,
  moduleId: PermissionModule,
  customPermissions?: PermissionModule[],
): boolean {
  if (customPermissions) {
    return customPermissions.includes(moduleId);
  }

  return DEFAULT_ROLE_ACCESS[role].includes(moduleId);
}

/* ============================================================
   BRICK CONFIGURATION
   ============================================================ */

export const BRICK_UNIT = {
  singular: "Brick",
  plural: "Bricks",
  short: "pcs",
  display: "Bricks",
} as const;

export const DEFAULT_BRICK_GRADES = [
  {
    grade_code: "A",
    grade_name: "A Grade",
    description: "Premium quality bricks",
    selling_price: 0,
    sort_order: 1,
    is_active: true,
  },
  {
    grade_code: "B",
    grade_name: "B Grade",
    description: "Standard quality bricks",
    selling_price: 0,
    sort_order: 2,
    is_active: true,
  },
  {
    grade_code: "C",
    grade_name: "C Grade",
    description: "Economy quality bricks",
    selling_price: 0,
    sort_order: 3,
    is_active: true,
  },
  {
    grade_code: "D",
    grade_name: "D Grade",
    description: "Low quality or damaged bricks",
    selling_price: 0,
    sort_order: 4,
    is_active: true,
  },
] as const;

/* ============================================================
   PRODUCTION STAGES
   ============================================================ */

export const PRODUCTION_STAGES = [
  {
    id: "pathai",
    label: "Pathai",
    description: "Brick moulding and preparation",
  },
  {
    id: "bhari",
    label: "Bhari",
    description: "Loading and kiln preparation",
  },
  {
    id: "nikasi",
    label: "Nikasi",
    description: "Unloading and finished brick removal",
  },
] as const;

/* ============================================================
   TRANSACTION STATUSES
   ============================================================ */

export const TRANSACTION_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "voided", label: "Voided" },
  { value: "reversed", label: "Reversed" },
] as const;

export const ORDER_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "dispatched", label: "Dispatched" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

/* ============================================================
   PAYMENT METHODS
   ============================================================ */

export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "bank", label: "Bank Transfer" },
  { value: "cheque", label: "Cheque" },
  { value: "online", label: "Online Payment" },
  { value: "other", label: "Other" },
] as const;

/* ============================================================
   DEFAULT APPLICATION SETTINGS
   ============================================================ */

export const DEFAULT_BUSINESS_SETTINGS = {
  date_format: "DD/MM/YYYY",
  time_format: "12h" as const,
  timezone: "Asia/Karachi",
  decimal_places: 2,
  currency_symbol: "Rs.",
  default_payment_method: "cash" as const,
  low_stock_alert: true,
  negative_stock_allowed: false,
  financial_year_start: "07-01",
  backup_reminder: true,
};

export const DEFAULT_PRINTER_SETTINGS = {
  printer_name: "",
  paper_size: "A4" as const,
  orientation: "portrait" as const,
  show_logo: true,
  show_business_address: true,
  footer_text: "Thank you for your business.",
  copies: 1,
};

export const DEFAULT_NOTIFICATION_SETTINGS = {
  low_stock: true,
  pending_payments: true,
  delayed_orders: true,
  backup_reminder: true,
  license_expiry: true,
};

/* ============================================================
   THEME
   ============================================================ */

export const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System Default" },
] as const;

/* ============================================================
   LANGUAGE
   ============================================================ */

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English", direction: "ltr" },
  { value: "ur", label: "Urdu", direction: "rtl" },
] as const;

/* ============================================================
   PAGINATION
   ============================================================ */

export const PAGINATION = {
  defaultPage: 1,
  defaultPageSize: 25,
  pageSizeOptions: [10, 25, 50, 100],
  maximumPageSize: 500,
} as const;

/* ============================================================
   FINANCIAL SAFETY
   ============================================================ */

export const FINANCIAL_RULES = {
  allowDirectFinancialDelete: false,
  requireVoidReason: true,
  requireReversalForPostedTransactions: true,
  requireAuditForFinancialChanges: true,
  allowNegativePayments: false,
  allowNegativeStockByDefault: false,
} as const;

/* ============================================================
   DATABASE CONFIGURATION
   ============================================================ */

export const DATABASE_CONFIG = {
  filename: "bhatta-khata-pro.db",
  schemaVersion: 1,
  busyTimeoutMs: 5000,
  enableForeignKeys: true,
  journalMode: "WAL",
  synchronous: "NORMAL",
} as const;

/* ============================================================
   APPLICATION ROUTES
   ============================================================ */

export const APP_ROUTES = {
  setup: "/setup",
  login: "/login",
  dashboard: "/dashboard",
  license: "/license",
  notFound: "/404",
} as const;

/* ============================================================
   VALIDATION LIMITS
   ============================================================ */

export const VALIDATION_LIMITS = {
  businessName: 150,
  ownerName: 100,
  username: 50,
  phone: 30,
  email: 150,
  address: 500,
  notes: 2000,
  referenceNumber: 100,
  maximumBrickQuantity: 100_000_000,
} as const;
