// FILE 460: src/features/labour/labour.constants.ts
import type { WorkerStatus } from "./labour.types";

export const LABOUR_STATUSES: readonly WorkerStatus[] = [
  "active",
  "inactive",
  "archived",
] as const;

export const LABOUR_PAGE_SIZE = 25;
export const LABOUR_MAX_NAME_LENGTH = 120;

export const LABOUR_STATUS_LABELS: Record<WorkerStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  archived: "Archived",
};
