// ============================================================
// FILE 296
// PATH: src/features/inventory/components/InventoryGradeSelect.tsx
import { LocalizedText } from "../../../lib/i18n";
// ============================================================

interface GradeOption {
  id: string;
  name: string;
}

interface Props {
  grades: GradeOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function InventoryGradeSelect({
  grades,
  value,
  onChange,
}: Props) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <option value=""><LocalizedText text="Select brick grade" /></option>
      {grades.map((grade) => (
        <option key={grade.id} value={grade.id}>{grade.name}</option>
      ))}
    </select>
  );
}
