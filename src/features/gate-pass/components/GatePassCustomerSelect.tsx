// ============================================================
// FILE 255
// PATH: src/features/gate-pass/components/GatePassCustomerSelect.tsx
// ============================================================

export function GatePassCustomerSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      Customer
      <input
        required
        className="form-input mt-1 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Customer name"
      />
    </label>
  );
}
