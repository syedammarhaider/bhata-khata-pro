// FILE 546: src/features/backup-restore/backuprestore.constants.ts
import type { BackupStatus } from "./backuprestore.types";

export const BACKUP_RESTORE_STATUSES: readonly BackupStatus[] = [
  "active",
  "inactive",
  "archived",
] as const;

export const BACKUP_RESTORE_PAGE_SIZE = 25;
export const BACKUP_RESTORE_MAX_NAME_LENGTH = 120;

export const BACKUP_RESTORE_STATUS_LABELS: Record<BackupStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  archived: "Archived",
};
