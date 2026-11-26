// ============================================================
// FILE 258
// PATH: src/features/gate-pass/components/GatePassQuantityField.tsx
// ============================================================

export function GatePassQuantityField({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block text-sm">
      Quantity
      <input
        type="number"
        min="1"
        required
        className="form-input mt-1 w-full"
        value={value}
        onChange={(e) => onChange(Math.max(1, Number(e.target.value)))}
      />
    </label>
  );
}
