// FILE 509: src/features/wages/wages.constants.ts
import type { WageStatus } from "./wages.types";

export const WAGES_STATUSES: readonly WageStatus[] = [
  "active",
  "inactive",
  "archived",
] as const;

export const WAGES_PAGE_SIZE = 25;
export const WAGES_MAX_NAME_LENGTH = 120;

export const WAGES_STATUS_LABELS: Record<WageStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  archived: "Archived",
};
