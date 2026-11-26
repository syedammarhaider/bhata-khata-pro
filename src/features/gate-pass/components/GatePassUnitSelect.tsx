// ============================================================
// FILE 260
// PATH: src/features/gate-pass/components/GatePassUnitSelect.tsx
// ============================================================

import { GATE_PASS_UNITS } from "../gatePass.constants";

export function GatePassUnitSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      Unit
      <select
        className="form-input mt-1 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {GATE_PASS_UNITS.map((u) => (
          <option key={u}>{u}</option>
        ))}
      </select>
    </label>
  );
}
