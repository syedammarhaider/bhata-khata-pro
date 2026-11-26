// ============================================================
// FILE 259
// PATH: src/features/gate-pass/components/GatePassGradeSelect.tsx
// ============================================================

export function GatePassGradeSelect({
  value,
  onChange,
  grades = ["A", "B", "C"],
}: {
  value: string;
  onChange: (v: string) => void;
  grades?: string[];
}) {
  return (
    <label className="block text-sm">
      Brick grade
      <select
        className="form-input mt-1 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {grades.map((g) => (
          <option key={g}>{g}</option>
        ))}
      </select>
    </label>
  );
}
