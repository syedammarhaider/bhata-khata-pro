// ============================================================
// FILE 275
// PATH: src/features/gate-pass/components/GatePassExportButton.tsx
// ============================================================

import type { GatePass } from "../gatePass.types";

export function GatePassExportButton({ items }: { items: GatePass[] }) {
  const run = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gate-passes.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button onClick={run} className="btn-secondary">
      Export JSON
    </button>
  );
}
