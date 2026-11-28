// ============================================================
// FILE 294
// PATH: src/features/inventory/components/StockQuantityCard.tsx
// ============================================================

import { LocalizedText } from "../../../lib/i18n";

interface Props {
  title: string;
  quantity: number;
  unit?: string;
}

export default function StockQuantityCard({
  title,
  quantity,
  unit = "bricks",
}: Props) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <p className="text-sm text-slate-500"><LocalizedText text={title} /></p>
      <p className="mt-2 text-2xl font-semibold">
        {quantity.toLocaleString()}
      </p>
      <p className="text-xs text-slate-500"><LocalizedText text={unit} /></p>
    </div>
  );
}
