// ============================================================
// FILE 318
// PATH: src/features/inventory/components/InventoryStockHistory.tsx
// ============================================================

import type { StockMovement } from "../inventory.types";
import StockMovementTable from "./StockMovementTable";

export default function InventoryStockHistory({
  movements,
}: {
  movements: StockMovement[];
}) {
  return (
    <section className="space-y-3">
      <h3 className="font-semibold">Stock History</h3>
      <StockMovementTable movements={movements} />
    </section>
  );
}
