// ============================================================
// FILE 307
// PATH: src/features/inventory/components/InventoryUnitLabel.tsx
// ============================================================

import { LocalizedText } from "../../../lib/i18n";

export default function InventoryUnitLabel({
  unit,
}: {
  unit: string;
}) {
  return <span className="text-xs text-slate-500"><LocalizedText text={unit || "bricks"} /></span>;
}
