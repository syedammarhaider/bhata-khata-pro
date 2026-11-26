// FILE 360: src/features/suppliers/suppliers.constants.ts
import type { SupplierStatus } from "./suppliers.types";

export const SUPPLIERS_STATUSES: readonly SupplierStatus[] = [
  "active",
  "inactive",
  "archived",
] as const;

export const SUPPLIERS_PAGE_SIZE = 25;
export const SUPPLIERS_MAX_NAME_LENGTH = 120;

export const SUPPLIERS_STATUS_LABELS: Record<SupplierStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  archived: "Archived",
};
