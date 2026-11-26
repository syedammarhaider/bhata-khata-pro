// ============================================================
// FILE 261
// PATH: src/features/gate-pass/components/GatePassDestinationField.tsx
// ============================================================

export function GatePassDestinationField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      Destination
      <input
        required
        className="form-input mt-1 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Delivery location"
      />
    </label>
  );
}
