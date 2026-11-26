// ============================================================
// FILE 307
// PATH: src/features/inventory/components/InventoryUnitLabel.tsx
// ============================================================

export default function InventoryUnitLabel({
  unit,
}: {
  unit: string;
}) {
  return <span className="text-xs text-slate-500">{unit || "bricks"}</span>;
}
