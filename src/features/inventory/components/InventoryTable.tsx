// ============================================================
// Bhatta Khata Pro - Inventory Table
// Displays stock, adjustments, print button
// ============================================================

import type { InventoryItem } from "../inventory.types";
import { getStockStatus, getAvailableStock } from "../inventory.utils";
import { STOCK_STATUS_LABELS } from "../inventory.constants";
import { Printer, SlidersHorizontal } from "lucide-react";
import StatusBadge from "../../../components/common/StatusBadge";
import { useAppStore } from "../../../app/store";
import { translateText, translateTextNode } from "../../../lib/i18n";

interface Props {
  items: InventoryItem[];
  onAdjust?: (item: InventoryItem) => void;
  onPrint?: (item: InventoryItem) => void;
}

export default function InventoryTable({ items, onAdjust, onPrint }: Props) {
  const language = useAppStore((state) => state.language);
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full text-start text-sm">
        <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3.5">{translateTextNode("Brick Grade", language)}</th>
            <th className="px-4 py-3.5">{translateTextNode("Total Physical Stock", language)}</th>
            <th className="px-4 py-3.5">{translateTextNode("Reserved", language)}</th>
            <th className="px-4 py-3.5">{translateTextNode("Available for Sale", language)}</th>
            <th className="px-4 py-3.5">{translateTextNode("Damaged", language)}</th>
            <th className="px-4 py-3.5">{translateTextNode("Stock Status", language)}</th>
            <th className="px-4 py-3.5 text-end">{translateTextNode("Actions", language)}</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.map((item) => {
            const available = getAvailableStock(item);
            const stockStatus = getStockStatus(item);

            return (
              <tr
                key={item.id}
                className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
              >
                <td className="px-4 py-4 font-bold text-slate-900 dark:text-white">
                  {item.gradeName}
                </td>

                <td className="px-4 py-4 font-semibold">
                  {item.quantity.toLocaleString()}
                </td>

                <td className="px-4 py-4 text-amber-600 dark:text-amber-400">
                  {item.reservedQuantity.toLocaleString()}
                </td>

                <td className="px-4 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                  {available.toLocaleString()}
                </td>

                <td className="px-4 py-4 text-rose-500">
                  {item.damagedQuantity.toLocaleString()}
                </td>

                <td className="px-4 py-4">
                  <StatusBadge
                    status={stockStatus}
                    label={translateText(STOCK_STATUS_LABELS[stockStatus] || stockStatus, language)}
                  />
                </td>

                <td className="px-4 py-4 text-end">
                  <div className="flex justify-end items-center gap-1.5">
                    {onAdjust && (
                      <button
                        type="button"
                        onClick={() => onAdjust(item)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-indigo-700 shadow-xs hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-300 dark:hover:bg-indigo-950/60"
                      >
                        <SlidersHorizontal size={13} />
                        {translateTextNode("Adjust Stock", language)}
                      </button>
                    )}

                    {onPrint && (
                      <button
                        type="button"
                        onClick={() => onPrint(item)}
                        title={`${translateText("Print stock certificate", language)}: ${item.gradeName}`}
                        className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Printer size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
