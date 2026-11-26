// ============================================================
// Bhatta Khata Pro - Production Batch Table
// Clean actions, status colors, cancel strikethrough, print
// ============================================================

import { Eye, Pencil, Printer, Trash2 } from "lucide-react";

import ProductionStageBadge from "./ProductionStageBadge";
import ProductionStatusBadge from "./ProductionStatusBadge";

import {
  formatBrickQuantity,
  formatProductionDate,
} from "../production.utils";

import type { ProductionBatch } from "../production.types";

interface ProductionBatchTableProps {
  batches: ProductionBatch[];
  onView: (batch: ProductionBatch) => void;
  onEdit?: (batch: ProductionBatch) => void;
  onDelete?: (batch: ProductionBatch) => void;
  onPrint?: (batch: ProductionBatch) => void;
}

export default function ProductionBatchTable({
  batches,
  onView,
  onEdit,
  onDelete,
  onPrint,
}: ProductionBatchTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/70">
            <tr className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="px-4 py-4">Batch #</th>
              <th className="px-4 py-4">Brick Grade</th>
              <th className="px-4 py-4">Planned</th>
              <th className="px-4 py-4">Produced (Good)</th>
              <th className="px-4 py-4">Damaged</th>
              <th className="px-4 py-4">Stage</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Start Date</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {batches.map((batch) => {
              const isCancelled = batch.status === "cancelled";

              return (
                <tr
                  key={batch.id}
                  className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 ${
                    isCancelled
                      ? "opacity-50 line-through bg-slate-50/50 text-slate-400 dark:bg-slate-900/40"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <td className="px-4 py-4 font-bold text-slate-900 dark:text-white">
                    {batch.batchNumber}
                  </td>

                  <td className="px-4 py-4 font-medium">{batch.brickGrade}</td>

                  <td className="px-4 py-4">
                    {formatBrickQuantity(batch.quantity)}
                  </td>

                  <td className="px-4 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatBrickQuantity(batch.producedQuantity)}
                  </td>

                  <td className="px-4 py-4 text-rose-600 dark:text-rose-400">
                    {formatBrickQuantity(batch.damagedQuantity)}
                  </td>

                  <td className="px-4 py-4">
                    <ProductionStageBadge stage={batch.stage} />
                  </td>

                  <td className="px-4 py-4">
                    <ProductionStatusBadge status={batch.status} />
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    {formatProductionDate(batch.startDate)}
                  </td>

                  <td className="px-4 py-4 text-right not-italic">
                    <div className="flex justify-end items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onView(batch)}
                        title={`View ${batch.batchNumber}`}
                        className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                      >
                        <Eye size={17} />
                      </button>

                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(batch)}
                          title={`Edit ${batch.batchNumber}`}
                          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                          <Pencil size={17} />
                        </button>
                      )}

                      {onPrint && (
                        <button
                          type="button"
                          onClick={() => onPrint(batch)}
                          title={`Print batch sheet ${batch.batchNumber}`}
                          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <Printer size={17} />
                        </button>
                      )}

                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(batch)}
                          title={`Delete ${batch.batchNumber}`}
                          className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                        >
                          <Trash2 size={17} />
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

      <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        Showing {batches.length} production batch record(s)
      </div>
    </div>
  );
}
