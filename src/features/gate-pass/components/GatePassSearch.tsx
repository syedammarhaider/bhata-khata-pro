// ============================================================
// FILE 253
// PATH: src/features/gate-pass/components/GatePassSearch.tsx
// ============================================================

export function GatePassSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      className="form-input w-full"
      placeholder="Search gate passes..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
