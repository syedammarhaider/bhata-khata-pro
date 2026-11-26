// ============================================================
// Bhatta Khata Pro - Production Types
// ============================================================

export type ProductionStage =
  | "pathai"
  | "bhari"
  | "bharai"
  | "jalai"
  | "nikasi"
  | "completed";

export type ProductionStatus =
  | "planned"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface ProductionBatch {
  id: number;
  batchNumber: string;
  brickGrade: string;
  quantity: number;
  producedQuantity: number;
  damagedQuantity: number;
  stage: ProductionStage;
  status: ProductionStatus;
  startDate: string;
  expectedDate?: string;
  completedDate?: string;
  notes?: string;
  createdAt?: string;
  resources?: ProductionResource[];
}

export interface ProductionResource {
  id: number;
  resourceName: string;
  quantity: number;
  unit: string;
  unitCost: number;
}

export interface ProductionSummary {
  totalBatches: number;
  totalProduced: number;
  totalDamaged: number;
  activeBatches: number;
  completedBatches: number;
}

export interface ProductionStageUpdate {
  batchId: number;
  stage: ProductionStage;
  quantity: number;
  damagedQuantity: number;
  notes?: string;
  date?: string;
}

export interface ProductionFiltersState {
  search: string;
  brickGrade: string;
  stage: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface ProductionFormData {
  batchNumber: string;
  brickGrade: string;
  quantity: number;
  stage: ProductionStage;
  startDate: string;
  expectedDate?: string;
  notes: string;
  resources: ProductionResource[];
}
