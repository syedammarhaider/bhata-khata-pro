// ============================================================
// FILE 300
// PATH: src/features/inventory/components/InventoryPrintButton.tsx
// ============================================================

export default function InventoryPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700"
    >
      Print Inventory
    </button>
  );
}
