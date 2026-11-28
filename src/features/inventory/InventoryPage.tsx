// ============================================================
// Bhatta Khata Pro - Inventory Page
// Live stock tracking, modal adjustments, reliable print engine
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "../../app/store";
import { translateText, translateTextNode } from "../../lib/i18n";
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
import { STOCK_STATUS_LABELS } from "./inventory.constants";

export default function InventoryPage() {
  const language = useAppStore((state) => state.language);
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
      console.error("Unable to load inventory", err);
      setError(translateText("Unable to load inventory. Please try again.", language));
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
      setError(translateText("Please select a brick grade.", language));
      return;
    }

    if (!Number.isSafeInteger(adjustQuantity) || adjustQuantity < 0) {
      setError(translateText("Quantity must be a valid non-negative whole number.", language));
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

      setSuccessMsg(`"${adjustGrade}" ${translateText("stock was successfully updated.", language)}`);
      setTimeout(() => setSuccessMsg(""), 4000);
      setAdjustModalItem(null);
      await loadInventory();
    } catch (err) {
      console.error("Unable to save stock adjustment", err);
      setError(translateText("Unable to save the stock adjustment. Please try again.", language));
    }
  }

  function exportInventoryCsv() {
    const header = [
      translateText("Grade", language),
      translateText("Total Stock", language),
      translateText("Reserved", language),
      translateText("Available", language),
      translateText("Damaged", language),
      translateText("Reorder Level", language),
      translateText("Status", language),
    ];
    const rows = filteredItems.map((item) => [
      item.gradeName,
      item.quantity,
      item.reservedQuantity,
      getAvailableStock(item),
      item.damagedQuantity,
      item.reorderLevel,
      translateText(STOCK_STATUS_LABELS[getStockStatus(item)], language),
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
      title: translateText("Kiln Brick Inventory Register", language),
      subtitle: `${translateText("Total Stock Valuation:", language)} PKR ${valuation.toLocaleString("en-PK")}`,
      columns: [
        translateText("Brick Grade", language),
        translateText("Total Stock", language),
        translateText("Reserved", language),
        translateText("Available", language),
        translateText("Damaged", language),
        translateText("Reorder Level", language),
        translateText("Stock Status", language),
      ],
      rows: filteredItems.map((item) => [
        item.gradeName,
        item.quantity.toLocaleString(),
        item.reservedQuantity.toLocaleString(),
        getAvailableStock(item).toLocaleString(),
        item.damagedQuantity.toLocaleString(),
        item.reorderLevel.toLocaleString(),
        translateText(STOCK_STATUS_LABELS[getStockStatus(item)], language),
      ]),
    });
  }

  function printGradeStock(item: InventoryItem) {
    const rate =
      gradeOptions.find((g) => g.name === item.gradeName)?.selling_price ?? 0;
    printRecord({
      title: translateText("Brick Grade Stock Certificate", language),
      subtitle: `${translateText("Grade:", language)} ${item.gradeName}`,
      sections: [
        {
          title: translateText("Current Physical Stock Count", language),
          fields: [
            { label: translateText("Brick Grade", language), value: item.gradeName },
            { label: translateText("Total Physical Stock", language), value: `${item.quantity.toLocaleString()} ${translateText("Bricks", language)}` },
            { label: translateText("Reserved for Orders", language), value: `${item.reservedQuantity.toLocaleString()} ${translateText("Bricks", language)}` },
            { label: translateText("Available Ready Stock", language), value: `${getAvailableStock(item).toLocaleString()} ${translateText("Bricks", language)}` },
            { label: translateText("Damaged / Broken", language), value: `${item.damagedQuantity.toLocaleString()} ${translateText("Bricks", language)}` },
            { label: translateText("Minimum Reorder Level", language), value: `${item.reorderLevel.toLocaleString()} ${translateText("Bricks", language)}` },
            { label: translateText("Selling Rate", language), value: `PKR ${rate.toLocaleString("en-PK")} / 1,000` },
            {
              label: translateText("Estimated Inventory Value", language),
              value: `PKR ${((item.quantity / 1000) * rate).toLocaleString("en-PK")}`,
            },
            { label: translateText("Stock Condition", language), value: translateText(STOCK_STATUS_LABELS[getStockStatus(item)], language) },
            { label: translateText("Last Stock Update", language), value: item.updatedAt || "—" },
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
              {translateTextNode("Adjust Stock", language)}
            </button>

            <button
              type="button"
              onClick={printStockSheet}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <Printer size={15} />
              {translateTextNode("Print Stock Sheet", language)}
            </button>

            <button
              type="button"
              onClick={exportInventoryCsv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <FileSpreadsheet size={15} />
              {translateTextNode("Export CSV", language)}
            </button>
          </div>
        }
      />

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
        >
          {translateTextNode(error, language)}
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          {translateTextNode(successMsg, language)}
        </div>
      )}

      {/* Valuation Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {translateTextNode("Total Stock Valuation", language)}
          </p>
          <p className="mt-1 text-2xl font-black text-indigo-600 dark:text-indigo-400">
            PKR {valuation.toLocaleString("en-PK")}
          </p>
          <p className="mt-1 text-xs text-slate-400">{translateTextNode("Based on grade selling prices", language)}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {translateTextNode("Low Stock Alerts", language)}
          </p>
          <p className="mt-1 text-2xl font-black text-amber-500">
            {items.filter((item) => getStockStatus(item) === "low-stock").length} {translateTextNode("Grades", language)}
          </p>
          <p className="mt-1 text-xs text-slate-400">{translateTextNode("At or below reorder threshold", language)}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {translateTextNode("Out of Stock", language)}
          </p>
          <p className="mt-1 text-2xl font-black text-rose-500">
            {items.filter((item) => getStockStatus(item) === "out-of-stock").length} {translateTextNode("Grades", language)}
          </p>
          <p className="mt-1 text-xs text-slate-400">{translateTextNode("Requires fresh kiln output", language)}</p>
        </div>
      </div>

      <InventorySummaryCards summary={summary} />

      {/* Stock Register Table */}
      <SectionCard title={translateText("Brick Stock Register", language)}>
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
                  {translateTextNode("Adjust Brick Stock", language)} &bull; {adjustGrade}
                </h3>
                <p className="text-xs text-slate-500">
                  {translateTextNode("Update quantities, add production receipts, or record broken bricks", language)}
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
                  {translateTextNode("Brick Grade", language)}
                </label>
                <select
                  value={adjustGrade}
                  onChange={(e) => setAdjustGrade(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.gradeName}>
                      {i.gradeName} ({translateText("Current", language)}: {i.quantity.toLocaleString()} {translateText("Bricks", language)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {translateTextNode("Adjustment Type", language)}
                </label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as typeof adjustType)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="adjustment">{translateText("Set Total Stock (Physical Count / Inventory Adjustment)", language)}</option>
                  <option value="in">{translateText("Add Stock (Received from Kiln Nikasi)", language)}</option>
                  <option value="damage">{translateText("Record Damaged (Broken Bricks Discarded)", language)}</option>
                  <option value="return">{translateText("Customer Return (Added back to stock)", language)}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {translateTextNode(adjustType === "adjustment" ? "New Total Count" : "Quantity to Change", language)}
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
                    {translateTextNode("Reorder Threshold", language)}
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
                  {translateTextNode("Reason / Reference Notes", language)}
                </label>
                <input
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                placeholder={translateText("e.g. Monthly physical audit, kiln unloading batch #12...", language)}
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
                {translateTextNode("Cancel", language)}
              </button>
              <button
                type="button"
                onClick={applyAdjustment}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
              >
                <CheckCircle2 size={16} />
                {translateTextNode("Save Stock Adjustment", language)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
