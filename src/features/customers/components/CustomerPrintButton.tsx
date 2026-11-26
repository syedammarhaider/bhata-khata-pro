// ============================================================
// FILE 346
// PATH: src/features/customers/components/CustomerPrintButton.tsx
// ============================================================

export default function CustomerPrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700">
      Print
    </button>
  );
}
