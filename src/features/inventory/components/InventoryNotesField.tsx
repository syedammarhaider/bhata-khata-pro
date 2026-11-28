// ============================================================
// FILE 311
// PATH: src/features/inventory/components/InventoryNotesField.tsx
// ============================================================

import { LocalizedText } from "../../../lib/i18n";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function InventoryNotesField({ value, onChange }: Props) {
  return (
    <label className="block text-sm font-medium">
      <LocalizedText text="Notes" />
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="mt-1 w-full rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900"
      />
    </label>
  );
}
