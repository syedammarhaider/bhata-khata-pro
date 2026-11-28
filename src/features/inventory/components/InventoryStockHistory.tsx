// ============================================================
// FILE 318
// PATH: src/features/inventory/components/InventoryStockHistory.tsx
import { LocalizedText } from "../../../lib/i18n";
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
      <h3 className="font-semibold"><LocalizedText text="Stock History" /></h3>
      <StockMovementTable movements={movements} />
    </section>
  );
}
