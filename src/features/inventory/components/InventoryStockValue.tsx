// ============================================================
// FILE 309
// PATH: src/features/inventory/components/InventoryStockValue.tsx
// ============================================================

interface Props {
  quantity: number;
  unitPrice: number;
}

export default function InventoryStockValue({ quantity, unitPrice }: Props) {
  const value = quantity * unitPrice;

  return (
    <div>
      <p className="text-xs text-slate-500">Estimated Stock Value</p>
      <p className="mt-1 text-lg font-semibold">
        PKR {value.toLocaleString("en-PK", { maximumFractionDigits: 2 })}
      </p>
      <p className="text-xs text-slate-400">
        Based on the supplied unit price; this is not an accounting valuation.
      </p>
    </div>
  );
}
