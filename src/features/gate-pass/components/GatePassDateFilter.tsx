// ============================================================
// FILE 252
// PATH: src/features/gate-pass/components/GatePassDateFilter.tsx
// ============================================================

export function GatePassDateFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="date"
      className="form-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
