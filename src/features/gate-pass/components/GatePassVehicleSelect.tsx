// ============================================================
// FILE 256
// PATH: src/features/gate-pass/components/GatePassVehicleSelect.tsx
// ============================================================

export function GatePassVehicleSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      Vehicle number
      <input
        required
        className="form-input mt-1 w-full uppercase"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        placeholder="e.g. LEB-1234"
      />
    </label>
  );
}
