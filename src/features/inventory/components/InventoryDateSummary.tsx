// ============================================================
// FILE 301
// PATH: src/features/inventory/components/InventoryDateSummary.tsx
// ============================================================

interface Props {
  startDate?: string;
  endDate?: string;
}

export default function InventoryDateSummary({ startDate, endDate }: Props) {
  return (
    <div className="text-sm text-slate-500">
      Period: {startDate || "Beginning"} — {endDate || "Today"}
    </div>
  );
}
