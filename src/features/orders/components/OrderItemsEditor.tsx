// ============================================================
// FILE 208
// PATH: src/features/orders/components/OrderItemsEditor.tsx
// ============================================================

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { findStockForGrade } from "../../../lib/stockLookup";
import type { OrderItem } from "../orders.types";

export function OrderItemsEditor({
  items,
  onChange,
}: {
  items: OrderItem[];
  onChange: (v: OrderItem[]) => void;
}) {
  const [stockByGrade, setStockByGrade] = useState<Record<string, number>>({});

  useEffect(() => {
    void invoke<{ grade_name: string; quantity: number }[]>("get_inventory")
      .then((rows) => {
        const map: Record<string, number> = {};
        rows.forEach((row) => {
          map[(row.grade_name ?? "").toLowerCase()] = row.quantity ?? 0;
        });
        setStockByGrade(map);
      })
      .catch(() => {});
  }, []);

  const add = () =>
    onChange([
      ...items,
      {
        id: crypto.randomUUID(),
        productName: "Bricks",
        grade: "A",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        total: 0,
      },
    ]);

  const update = (
    id: string,
    key: keyof OrderItem,
    value: string | number,
  ) =>
    onChange(
      items.map((i) => {
        if (i.id !== id) return i;
        const next = { ...i, [key]: value };
        next.total = Math.max(0, next.quantity * next.unitPrice - next.discount);
        return next;
      }),
    );

  return (
    <section className="space-y-3">
      <div className="flex justify-between">
        <h3 className="font-medium text-slate-900 dark:text-white">Order items</h3>
        <button type="button" onClick={add} className="text-blue-600 dark:text-blue-400">
          + Add item
        </button>
      </div>
      {items.map((i) => (
        <div
          key={i.id}
          className="grid grid-cols-2 gap-2 rounded-lg border p-3 md:grid-cols-5"
        >
          <input
            className="form-input"
            value={i.productName}
            onChange={(e) => update(i.id, "productName", e.target.value)}
            aria-label="Product"
          />
          <input
            className="form-input"
            value={i.grade}
            onChange={(e) => update(i.id, "grade", e.target.value)}
            aria-label="Grade"
          />
          <div>
            <input
              type="number"
              min="1"
              className="form-input"
              value={i.quantity}
              onChange={(e) => update(i.id, "quantity", Number(e.target.value))}
            />
            {findStockForGrade(stockByGrade, i.grade ?? "") !== undefined && (
              <p className="mt-1 text-[10px] text-slate-400">
                Stock: {findStockForGrade(stockByGrade, i.grade ?? "")!.toLocaleString()}
              </p>
            )}
          </div>
          <input
            type="number"
            min="0"
            className="form-input"
            value={i.unitPrice}
            onChange={(e) => update(i.id, "unitPrice", Number(e.target.value))}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((x) => x.id !== i.id))}
            className="text-red-600 dark:text-red-400"
          >
            Remove
          </button>
        </div>
      ))}
    </section>
  );
}
