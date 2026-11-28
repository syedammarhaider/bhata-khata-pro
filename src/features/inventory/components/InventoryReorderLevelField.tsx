// ============================================================
// FILE 310
// PATH: src/features/inventory/components/InventoryReorderLevelField.tsx
import { LocalizedText } from "../../../lib/i18n";
// ============================================================

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function InventoryReorderLevelField({ value, onChange }: Props) {
  return (
    <label className="block text-sm font-medium">
      <LocalizedText text="Reorder Level" />
      <input
        type="number"
        min="0"
        value={value}
        onChange={(event) => onChange(Math.max(0, Number(event.target.value)))}
        className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900"
      />
    </label>
  );
}
