// ============================================================
// FILE 272
// PATH: src/features/gate-pass/components/GatePassPrintButton.tsx
// ============================================================

export function GatePassPrintButton() {
  return (
    <button onClick={() => window.print()} className="btn-secondary">
      Print gate pass
    </button>
  );
}
