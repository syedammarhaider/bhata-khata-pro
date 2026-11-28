// ============================================================
// FILE 312
// PATH: src/features/inventory/components/InventoryReferenceField.tsx
import { LocalizedText } from "../../../lib/i18n";
// ============================================================

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function InventoryReferenceField({ value, onChange }: Props) {
  return (
    <label className="block text-sm font-medium">
      <LocalizedText text="Reference Number" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900"
        placeholder="STK-0001"
      />
    </label>
  );
}
