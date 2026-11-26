// ============================================================
// Bhatta Khata Pro - Inventory Page
// Live stock tracking, modal adjustments, reliable print engine
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  Boxes,
  Printer,
  FileSpreadsheet,
  X,
  CheckCircle2,
} from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import SectionCard from "../../components/common/SectionCard";
import { printRecord, printTable } from "../../lib/print";
import InventorySummaryCards from "./components/InventorySummaryCards";
import InventoryFilters from "./components/InventoryFilters";
import InventoryTable from "./components/InventoryTable";
import InventoryEmptyState from "./components/InventoryEmptyState";
import type { InventoryItem, StockStatus } from "./inventory.types";
import {
  calculateInventorySummary,
  filterInventory,
  getAvailableStock,
  getStockStatus,
} from "./inventory.utils";

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Adjustment Modal State
  const [adjustModalItem, setAdjustModalItem] = useState<InventoryItem | null>(null);
  const [adjustGrade, setAdjustGrade] = useState("");
  const [adjustQuantity, setAdjustQuantity] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustType, setAdjustType] = useState<"adjustment" | "in" | "damage" | "return">("adjustment");
  const [reorderLevel, setReorderLevel] = useState(10000);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StockStatus | "all">("all");
  const [valuation, setValuation] = useState(0);
  const [gradeOptions, setGradeOptions] = useState<
    { name: string; selling_price: number; is_active: boolean }[]
  >([]);

  async function loadInventory() {
    setError("");
    try {
      const records = await invoke<
        {
          id: number;
          grade_name: string;
          quantity: number;
          reserved_quantity: number;
          damaged_quantity: number;
          reorder_level: number;
          updated_at: string;
        }[]
      >("get_inventory");

      const mappedItems: InventoryItem[] = records.map((record) => ({
        id: String(record.id),
        gradeId: String(record.id),
        gradeName: record.grade_name,
        quantity: record.quantity,
        reservedQuantity: record.reserved_quantity,
        damagedQuantity: record.damaged_quantity,
        reorderLevel: record.reorder_level,
        unit: "bricks",
        updatedAt: record.updated_at,
      }));

      setItems(mappedItems);

      const grades = await invoke<
        { name: string; selling_price: number; is_active: boolean }[]
      >("get_brick_grades");
      setGradeOptions(grades);

      const rates = new Map(grades.map((grade) => [grade.name, grade.selling_price]));
      const totalVal = records.reduce(
        (total, record) =>
          total + record.quantity * (rates.get(record.grade_name) ?? 0),
        0,
      );
      setValuation(totalVal);
    } catch (err) {
      setError(String(err));
    }
  }

  useEffect(() => {
    void loadInventory();
  }, []);

  function handleOpenAdjust(item: InventoryItem) {
    setAdjustModalItem(item);
    setAdjustGrade(item.gradeName);
    setAdjustQuantity(item.quantity);
    setAdjustType("adjustment");
    setReorderLevel(item.reorderLevel);
    setAdjustReason("");
  }

  function handleOpenNewAdjust() {
    if (items.length > 0) {
      handleOpenAdjust(items[0]);
    } else {
      setAdjustModalItem(null);
      setAdjustGrade("");
      setAdjustQuantity(0);
      setAdjustType("adjustment");
      setReorderLevel(10000);
      setAdjustReason("");
    }
  }

  async function applyAdjustment() {
    setError("");
    if (!adjustGrade.trim()) {
      setError("Please select a brick grade.");
      return;
    }

    if (!Number.isSafeInteger(adjustQuantity) || adjustQuantity < 0) {
      setError("Quantity must be a valid non-negative whole number.");
      return;
    }

    try {
      await invoke("adjust_inventory", {
        gradeName: adjustGrade.trim(),
        quantity: adjustQuantity,
        reorderLevel,
        reason: adjustReason.trim() || `Manual stock adjustment (${adjustType})`,
        movementType: adjustType,
      });

      setSuccessMsg(`Stock for "${adjustGrade}" updated successfully.`);
      setTimeout(() => setSuccessMsg(""), 4000);
      setAdjustModalItem(null);
      await loadInventory();
    } catch (err) {
      setError(String(err));
    }
  }

  function exportInventoryCsv() {
    const header = [
      "Grade",
      "Total Stock",
      "Reserved",
      "Available",
      "Damaged",
      "Reorder Level",
      "Status",
    ];
    const rows = filteredItems.map((item) => [
      item.gradeName,
      item.quantity,
      item.reservedQuantity,
      getAvailableStock(item),
      item.damagedQuantity,
      item.reorderLevel,
      getStockStatus(item),
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "bhatta-inventory-stock-sheet.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function printStockSheet() {
    printTable({
      title: "Kiln Brick Inventory Register",
      subtitle: `Total Stock Valuation: PKR ${valuation.toLocaleString("en-PK")}`,
      columns: [
        "Brick Grade",
        "Total Stock",
        "Reserved",
        "Available",
        "Damaged",
        "Reorder Level",
        "Stock Status",
      ],
      rows: filteredItems.map((item) => [
        item.gradeName,
        item.quantity.toLocaleString(),
        item.reservedQuantity.toLocaleString(),
        getAvailableStock(item).toLocaleString(),
        item.damagedQuantity.toLocaleString(),
        item.reorderLevel.toLocaleString(),
        getStockStatus(item).toUpperCase(),
      ]),
    });
  }

  function printGradeStock(item: InventoryItem) {
    const rate =
      gradeOptions.find((g) => g.name === item.gradeName)?.selling_price ?? 0;
    printRecord({
      title: "Brick Grade Stock Certificate",
      subtitle: `Grade: ${item.gradeName}`,
      sections: [
        {
          title: "Current Physical Stock Count",
          fields: [
            { label: "Brick Grade", value: item.gradeName },
            { label: "Total Physical Stock", value: `${item.quantity.toLocaleString()} Bricks` },
            { label: "Reserved for Orders", value: `${item.reservedQuantity.toLocaleString()} Bricks` },
            { label: "Available Ready Stock", value: `${getAvailableStock(item).toLocaleString()} Bricks` },
            { label: "Damaged / Broken", value: `${item.damagedQuantity.toLocaleString()} Bricks` },
            { label: "Minimum Reorder Level", value: `${item.reorderLevel.toLocaleString()} Bricks` },
            { label: "Selling Rate", value: `PKR ${rate.toLocaleString("en-PK")} per 1,000` },
            {
              label: "Estimated Inventory Value",
              value: `PKR ${((item.quantity / 1000) * rate).toLocaleString("en-PK")}`,
            },
            { label: "Stock Condition", value: getStockStatus(item).toUpperCase() },
            { label: "Last Stock Update", value: item.updatedAt || "—" },
          ],
        },
      ],
    });
  }

  const summary = useMemo(() => calculateInventorySummary(items), [items]);

  const filteredItems = useMemo(
    () => filterInventory(items, search, status),
    [items, search, status],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Monitor brick stock, ready inventory, reserved dispatch commitments, and physical count adjustments."
        icon={Boxes}
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleOpenNewAdjust}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <Boxes size={15} />
              Adjust Stock
            </button>

            <button
              type="button"
              onClick={printStockSheet}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <Printer size={15} />
              Print Stock Sheet
            </button>

            <button
              type="button"
              onClick={exportInventoryCsv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <FileSpreadsheet size={15} />
              Export CSV
            </button>
          </div>
        }
      />

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
        >
          {error}
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          {successMsg}
        </div>
      )}

      {/* Valuation Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Stock Valuation
          </p>
          <p className="mt-1 text-2xl font-black text-indigo-600 dark:text-indigo-400">
            PKR {valuation.toLocaleString("en-PK")}
          </p>
          <p className="mt-1 text-xs text-slate-400">Based on grade selling prices</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Low Stock Alerts
          </p>
          <p className="mt-1 text-2xl font-black text-amber-500">
            {items.filter((item) => getStockStatus(item) === "low-stock").length} Grades
          </p>
          <p className="mt-1 text-xs text-slate-400">At or below reorder threshold</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Out of Stock
          </p>
          <p className="mt-1 text-2xl font-black text-rose-500">
            {items.filter((item) => getStockStatus(item) === "out-of-stock").length} Grades
          </p>
          <p className="mt-1 text-xs text-slate-400">Requires fresh kiln output</p>
        </div>
      </div>

      <InventorySummaryCards summary={summary} />

      {/* Stock Register Table */}
      <SectionCard title="Brick Stock Register">
        <InventoryFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
        />

        {filteredItems.length > 0 ? (
          <InventoryTable
            items={filteredItems}
            onAdjust={handleOpenAdjust}
            onPrint={printGradeStock}
          />
        ) : (
          <InventoryEmptyState />
        )}
      </SectionCard>

      {/* 🌟 DEDICATED STOCK ADJUSTMENT MODAL */}
      {adjustModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Adjust Brick Stock &bull; {adjustGrade}
                </h3>
                <p className="text-xs text-slate-500">
                  Update quantities, add production receipts, or record broken bricks
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAdjustModalItem(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Brick Grade
                </label>
                <select
                  value={adjustGrade}
                  onChange={(e) => setAdjustGrade(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.gradeName}>
                      {i.gradeName} (Current: {i.quantity.toLocaleString()} bricks)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Adjustment Type
                </label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as typeof adjustType)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="adjustment">Set Total Stock (Physical Count / Inventory Adjustment)</option>
                  <option value="in">Add Stock (Received from Kiln Nikasi)</option>
                  <option value="damage">Record Damaged (Broken Bricks Discarded)</option>
                  <option value="return">Customer Return (Added back to stock)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {adjustType === "adjustment" ? "New Total Count" : "Quantity to Change"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={adjustQuantity}
                    onChange={(e) => setAdjustQuantity(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Reorder Threshold
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={reorderLevel}
                    onChange={(e) => setReorderLevel(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Reason / Reference Notes
                </label>
                <input
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Monthly physical audit, kiln unloading batch #12..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setAdjustModalItem(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyAdjustment}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
              >
                <CheckCircle2 size={16} />
                Save Stock Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
