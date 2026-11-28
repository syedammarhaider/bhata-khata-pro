// ============================================================
// FILE 301
// PATH: src/features/inventory/components/InventoryDateSummary.tsx
import { LocalizedText } from "../../../lib/i18n";
// ============================================================

interface Props {
  startDate?: string;
  endDate?: string;
}

export default function InventoryDateSummary({ startDate, endDate }: Props) {
  return (
    <div className="text-sm text-slate-500">
      <LocalizedText text="Period" />: {startDate || <LocalizedText text="Beginning" />} — {endDate || <LocalizedText text="Today" />}
    </div>
  );
}
