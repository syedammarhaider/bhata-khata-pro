// ============================================================
// FILE 235
// PATH: src/features/orders/components/OrderExportButton.tsx
// ============================================================

import type { Order } from "../orders.types";

export function OrderExportButton({ orders }: { orders: Order[] }) {
  const exportData = () => {
    const blob = new Blob([JSON.stringify(orders, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button onClick={exportData} className="btn-secondary">
      Export JSON
    </button>
  );
}
