// ============================================================
// FILE 257
// PATH: src/features/gate-pass/components/GatePassDriverSelect.tsx
// ============================================================

export function GatePassDriverSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      Driver name
      <input
        required
        className="form-input mt-1 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
