// ============================================================
// FILE 109
// PATH: E:\BRICKSCS\src\features\production\production.constants.ts
// ============================================================

import type {
  ProductionStage,
  ProductionStatus,
  ProductionFiltersState,
} from "./production.types";

export const PRODUCTION_STAGES: {
  value: ProductionStage;
  label: string;
  description: string;
}[] = [
  {
    value: "pathai",
    label: "Pathai",
    description: "Brick moulding and preparation",
  },
  {
    value: "bhari",
    label: "Bhari",
    description: "Loading and kiln preparation",
  },
  {
    value: "bharai",
    label: "Bharai",
    description: "Kiln chamber loading",
  },
  {
    value: "jalai",
    label: "Jalai",
    description: "Firing and baking bricks",
  },
  {
    value: "nikasi",
    label: "Nikasi",
    description: "Brick removal and unloading",
  },
  {
    value: "completed",
    label: "Completed",
    description: "Production batch completed",
  },
];

export const PRODUCTION_STATUSES: {
  value: ProductionStatus;
  label: string;
}[] = [
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const DEFAULT_PRODUCTION_FILTERS: ProductionFiltersState = {
  search: "",
  brickGrade: "all",
  stage: "all",
  status: "all",
  startDate: "",
  endDate: "",
};

export const PRODUCTION_VALIDATION = {
  batchNumberMaxLength: 40,
  notesMaxLength: 1000,
  minimumQuantity: 1,
  maximumQuantity: 100_000_000,
};

export const PRODUCTION_TABLE_PAGE_SIZE = 20;
