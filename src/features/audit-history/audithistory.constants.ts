// FILE 531: src/features/audit-history/audithistory.constants.ts
import type { AuditEventStatus } from "./audithistory.types";

export const AUDIT_HISTORY_STATUSES: readonly AuditEventStatus[] = [
  "active",
  "inactive",
  "archived",
] as const;

export const AUDIT_HISTORY_PAGE_SIZE = 25;
export const AUDIT_HISTORY_MAX_NAME_LENGTH = 120;

export const AUDIT_HISTORY_STATUS_LABELS: Record<AuditEventStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  archived: "Archived",
};
