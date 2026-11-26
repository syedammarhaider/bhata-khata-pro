// ============================================================
// FILE 287
// PATH: src/features/inventory/components/InventoryEmptyState.tsx
// ============================================================

import EmptyState from "../../../components/common/EmptyState";
import { Package } from "lucide-react";

export default function InventoryEmptyState() {
  return (
    <EmptyState
      title="No inventory records"
      description="Inventory records will appear here after stock is added or production is recorded."
      icon={Package}
    />
  );
}
