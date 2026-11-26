// ============================================================
// FILE 171
// PATH: E:\BRICKSCS\src\features\sales\components\SalesItemForm.tsx
// ============================================================

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Plus } from "lucide-react";
import type { SalesItem } from "../sales.types";
import { findStockForGrade } from "../../../lib/stockLookup";
import SalesGradeSelect from "./SalesGradeSelect";
import SalesQuantityField from "./SalesQuantityField";
import SalesPriceField from "./SalesPriceField";

interface SalesItemFormProps {
  onAdd: (item: Omit<SalesItem, "id" | "lineTotal">) => void;
}

export default function SalesItemForm({ onAdd }: SalesItemFormProps) {
  const [brickGrade, setBrickGrade] = useState("A Grade");
  const [quantity, setQuantity] = useState(1000);
  const [unitPrice, setUnitPrice] = useState(20);
  const [error, setError] = useState("");
  const [grades, setGrades] = useState<{ name: string; selling_price: number }[]>([]);
  const [stockByGrade, setStockByGrade] = useState<Record<string, number>>({});

  useEffect(() => {
    void invoke<{ name: string; selling_price: number; is_active: boolean }[]>("get_brick_grades")
      .then((items) => {
        const active = items.filter((item) => item.is_active);
        setGrades(active);
        const selected = active.find((item) => item.name === brickGrade) ?? active[0];
        if (selected) {
          setBrickGrade(selected.name);
          setUnitPrice(selected.selling_price);
        }
      })
      .catch(() => setError("Could not load brick grades."));

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

  function addItem() {
    if (
      !Number.isSafeInteger(quantity) ||
      quantity <= 0 ||
      !Number.isFinite(unitPrice) ||
      unitPrice <= 0
    ) {
      setError("Enter a valid quantity and price.");
      return;
    }

    onAdd({ brickGrade, quantity, unitPrice });
    setError("");
  }

  return (
    <div className="space-y-3 rounded-xl border p-4 dark:border-slate-700">
      <h3 className="text-sm font-semibold">Add brick item</h3>

      {error && <p role="alert" className="text-xs text-rose-600">{error}</p>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SalesGradeSelect
          value={brickGrade}
          onChange={(name) => {
            setBrickGrade(name);
            const selected = grades.find((grade) => grade.name === name);
            if (selected) setUnitPrice(selected.selling_price);
          }}
        />
        <div>
          <SalesQuantityField value={quantity} onChange={setQuantity} />
          {findStockForGrade(stockByGrade, brickGrade) !== undefined && (
            <p
              className={`mt-1 text-xs ${
                quantity > (findStockForGrade(stockByGrade, brickGrade) ?? 0)
                  ? "font-semibold text-rose-600"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Available stock: {findStockForGrade(stockByGrade, brickGrade)!.toLocaleString()} bricks
              {quantity > (findStockForGrade(stockByGrade, brickGrade) ?? 0) && " — exceeds available!"}
            </p>
          )}
        </div>
        <SalesPriceField value={unitPrice} onChange={setUnitPrice} />
      </div>

      <button type="button" onClick={addItem} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white">
        <Plus size={15} />
        Add item
      </button>
    </div>
  );
}
