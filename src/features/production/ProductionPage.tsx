// ============================================================
// Bhatta Khata Pro - Production Page
// Full batch management, stage & status editor, print engine
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  Factory,
  Plus,
  RefreshCw,
  Printer,
  X,
  CheckCircle2,
} from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import { printRecord } from "../../lib/print";

import ProductionSummaryCards from "./components/ProductionSummaryCards";
import ProductionBatchTable from "./components/ProductionBatchTable";
import ProductionBatchForm from "./components/ProductionBatchForm";
import ProductionFilters from "./components/ProductionFilters";
import ProductionEmptyState from "./components/ProductionEmptyState";

import {
  DEFAULT_PRODUCTION_FILTERS,
} from "./production.constants";

import {
  calculateProductionSummary,
  filterProductionBatches,
} from "./production.utils";

import type {
  ProductionBatch,
  ProductionFiltersState,
  ProductionFormData,
  ProductionStage,
} from "./production.types";

const STAGE_CONFIG: {
  value: ProductionStage;
  label: string;
  urdu: string;
  desc: string;
}[] = [
  { value: "pathai", label: "Pathai", urdu: "پتھائی (Moulding)", desc: "Raw bricks moulding" },
  { value: "bharai", label: "Bharai", urdu: "بھرائی (Kiln Loading)", desc: "Loading green bricks into kiln" },
  { value: "jalai", label: "Jalai", urdu: "جلائی (Firing / Burning)", desc: "Baking with fuel/coal" },
  { value: "nikasi", label: "Nikasi", urdu: "نکاسی (Unloading)", desc: "Drawing finished baked bricks" },
  { value: "completed", label: "Completed", urdu: "مکمل (Ready Stock)", desc: "Output added to inventory" },
];

export default function ProductionPage() {
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [filters, setFilters] = useState<ProductionFiltersState>({
    ...DEFAULT_PRODUCTION_FILTERS,
  });

  const [showForm, setShowForm] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<ProductionBatch | null>(null);

  // Edit modal drafts
  const [stageDraft, setStageDraft] = useState<ProductionStage>("pathai");
  const [statusDraft, setStatusDraft] = useState<ProductionBatch["status"]>("planned");
  const [producedDraft, setProducedDraft] = useState("0");
  const [damagedDraft, setDamagedDraft] = useState("0");
  const [notesDraft, setNotesDraft] = useState("");

  const [isRefreshing, setIsRefreshing] = useState(false);

  async function loadBatches() {
    setError("");
    try {
      const records = await invoke<any[]>("get_production_batches");
      setBatches(
        records.map((record) => ({
          id: record.id,
          batchNumber: record.batch_number,
          brickGrade: record.brick_grade,
          quantity: record.planned_quantity,
          producedQuantity: record.produced_quantity,
          damagedQuantity: record.damaged_quantity,
          stage: record.stage,
          status: record.status,
          startDate: record.start_date,
          expectedDate: record.expected_date ?? undefined,
          completedDate: record.completed_date ?? undefined,
          notes: record.notes,
          createdAt: record.created_at,
          resources: (record.resources ?? []).map((resource: any) => ({
            id: resource.id,
            resourceName: resource.resource_name,
            quantity: resource.quantity,
            unit: resource.unit,
            unitCost: resource.unit_cost,
          })),
        })),
      );
    } catch (err) {
      setError(String(err));
    }
  }

  useEffect(() => {
    void loadBatches();
  }, []);

  const summary = useMemo(
    () => calculateProductionSummary(batches),
    [batches],
  );

  const filteredBatches = useMemo(
    () => filterProductionBatches(batches, filters),
    [batches, filters],
  );

  async function handleCreate(data: ProductionFormData) {
    setError("");
    try {
      await invoke("save_production_batch", {
        batch: {
          id: 0,
          batch_number: data.batchNumber.trim(),
          brick_grade: data.brickGrade,
          planned_quantity: data.quantity,
          produced_quantity: 0,
          damaged_quantity: 0,
          stage: data.stage,
          status: "planned",
          start_date: data.startDate,
          expected_date: data.expectedDate || null,
          completed_date: null,
          notes: data.notes,
          created_at: "",
          resources: data.resources.map((resource) => ({
            id: resource.id,
            resource_name: resource.resourceName,
            quantity: resource.quantity,
            unit: resource.unit,
            unit_cost: resource.unitCost,
          })),
        },
      });
      await loadBatches();
      setShowForm(false);
      setSuccessMsg(`Production batch ${data.batchNumber} created successfully.`);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setError(String(err));
    }
  }

  function handleRefresh() {
    setIsRefreshing(true);
    void loadBatches().finally(() => setIsRefreshing(false));
  }

  async function handleDelete(batch: ProductionBatch) {
    if (!window.confirm(`Delete production batch ${batch.batchNumber}?`)) return;
    setError("");
    try {
      await invoke("delete_production_batch", { batchId: batch.id });
      await loadBatches();
      setSuccessMsg(`Batch ${batch.batchNumber} deleted.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(String(err));
    }
  }

  function handleOpenEdit(batch: ProductionBatch) {
    setSelectedBatch(batch);
    setStageDraft(batch.stage);
    setStatusDraft(batch.status);
    setProducedDraft(String(batch.producedQuantity));
    setDamagedDraft(String(batch.damagedQuantity));
    setNotesDraft(batch.notes || "");
  }

  async function saveBatchEdits() {
    if (!selectedBatch) return;

    const producedQuantity = Number(producedDraft);
    const damagedQuantity = Number(damagedDraft);

    if (!Number.isSafeInteger(producedQuantity) || producedQuantity < 0) {
      setError("Produced quantity must be a valid positive number.");
      return;
    }
    if (!Number.isSafeInteger(damagedQuantity) || damagedQuantity < 0) {
      setError("Damaged quantity must be a valid non-negative number.");
      return;
    }

    const isCompleted = statusDraft === "completed" || stageDraft === "completed";
    const finalStatus = isCompleted ? "completed" : statusDraft;
    const finalStage = stageDraft;

    setError("");
    try {
      await invoke("save_production_batch", {
        batch: {
          id: selectedBatch.id,
          batch_number: selectedBatch.batchNumber,
          brick_grade: selectedBatch.brickGrade,
          planned_quantity: selectedBatch.quantity,
          produced_quantity: producedQuantity > 0 ? producedQuantity : isCompleted ? selectedBatch.quantity : 0,
          damaged_quantity: damagedQuantity,
          stage: finalStage,
          status: finalStatus,
          start_date: selectedBatch.startDate,
          expected_date: selectedBatch.expectedDate ?? null,
          completed_date: isCompleted ? new Date().toISOString().slice(0, 10) : null,
          notes: notesDraft.trim(),
          created_at: selectedBatch.createdAt ?? "",
          resources: (selectedBatch.resources ?? []).map((resource) => ({
            id: resource.id,
            resource_name: resource.resourceName,
            quantity: resource.quantity,
            unit: resource.unit,
            unit_cost: resource.unitCost,
          })),
        },
      });

      await loadBatches();
      setSelectedBatch(null);
      setSuccessMsg(`Batch ${selectedBatch.batchNumber} updated successfully.`);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setError(String(err));
    }
  }

  function handlePrintBatch(batch: ProductionBatch) {
    const resources = batch.resources ?? [];
    printRecord({
      title: "Production Batch Sheet",
      subtitle: `Batch #: ${batch.batchNumber}`,
      sections: [
        {
          title: "Batch Identification & Output",
          fields: [
            { label: "Batch Number", value: batch.batchNumber },
            { label: "Brick Grade", value: batch.brickGrade },
            { label: "Current Stage", value: batch.stage.toUpperCase() },
            { label: "Status", value: batch.status.toUpperCase() },
            { label: "Planned Quantity", value: `${batch.quantity.toLocaleString()} Bricks` },
            { label: "Produced (Good)", value: `${batch.producedQuantity.toLocaleString()} Bricks` },
            { label: "Damaged Output", value: `${batch.damagedQuantity.toLocaleString()} Bricks` },
            { label: "Start Date", value: batch.startDate },
            { label: "Expected Date", value: batch.expectedDate || "—" },
            { label: "Completed Date", value: batch.completedDate || "—" },
            { label: "Notes", value: batch.notes || "—" },
          ],
        },
        {
          title: "Resource & Material Usage",
          fields: resources.length
            ? resources.map((r, i) => ({
                label: `${i + 1}. ${r.resourceName} (${r.quantity} ${r.unit} @ PKR ${r.unitCost.toLocaleString("en-PK")})`,
                value: `PKR ${(r.quantity * r.unitCost).toLocaleString("en-PK")}`,
              }))
            : [{ label: "Materials", value: "Standard kiln fuel and raw soil allocated." }],
        },
      ],
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Production"
        description="Monitor kiln cycles, raw moulding (pathai), kiln loading (bharai), firing (jalai), and unloading (nikasi)."
        icon={Factory}
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <RefreshCw size={15} className={isRefreshing ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus size={16} />
              New Batch
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

      <ProductionSummaryCards summary={summary} />

      <ProductionFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters({ ...DEFAULT_PRODUCTION_FILTERS })}
      />

      {filteredBatches.length > 0 ? (
        <ProductionBatchTable
          batches={filteredBatches}
          onView={handleOpenEdit}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onPrint={handlePrintBatch}
        />
      ) : (
        <ProductionEmptyState
          title={
            batches.length === 0
              ? "No production batches yet"
              : "No matching production batches"
          }
          description={
            batches.length === 0
              ? "Create your first production batch to begin recording kiln operations."
              : "Try changing your search or filters."
          }
          actionLabel={batches.length === 0 ? "Create production batch" : undefined}
          onAction={() => setShowForm(true)}
        />
      )}

      {/* New Batch Modal */}
      {showForm && (
        <ProductionBatchForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* 🌟 EDIT BATCH & STAGE MODAL: Full stage and status switching */}
      {selectedBatch && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Update Production Batch &bull; {selectedBatch.batchNumber}
                </h2>
                <p className="text-xs text-slate-500">
                  Grade: <strong className="text-slate-700 dark:text-slate-300">{selectedBatch.brickGrade}</strong> &bull; Planned: {selectedBatch.quantity.toLocaleString()} bricks
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePrintBatch(selectedBatch)}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  title="Print this batch"
                >
                  <Printer size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBatch(null)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {/* STAGE SELECTOR (Pathai, Bharai, Jalai, Nikasi, Completed) */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Select Production Stage (پیداواری مرحلہ)
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {STAGE_CONFIG.map((st) => {
                    const isSelected = stageDraft === st.value;
                    return (
                      <button
                        key={st.value}
                        type="button"
                        onClick={() => {
                          setStageDraft(st.value);
                          if (st.value === "completed") {
                            setStatusDraft("completed");
                          } else if (statusDraft === "planned") {
                            setStatusDraft("in_progress");
                          }
                        }}
                        className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/80 shadow-sm ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/40"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span
                            className={`text-xs font-bold ${
                              isSelected
                                ? "text-indigo-700 dark:text-indigo-300"
                                : "text-slate-800 dark:text-slate-200"
                            }`}
                          >
                            {st.label}
                          </span>
                          {isSelected && (
                            <CheckCircle2 size={15} className="text-indigo-600 dark:text-indigo-400" />
                          )}
                        </div>
                        <span className="mt-0.5 text-xs font-urdu text-indigo-900/80 dark:text-indigo-300/80">
                          {st.urdu}
                        </span>
                        <span className="mt-1 text-[11px] text-slate-400">
                          {st.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STATUS SELECTOR (planned, in_progress, completed, cancelled) */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Batch Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["planned", "in_progress", "completed", "cancelled"] as const).map(
                    (st) => {
                      const isSelected = statusDraft === st;
                      const statusStyles: Record<string, string> = {
                        planned: isSelected
                          ? "bg-slate-800 text-white border-slate-800"
                          : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300",
                        in_progress: isSelected
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300",
                        completed: isSelected
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300",
                        cancelled: isSelected
                          ? "bg-rose-600 text-white border-rose-600"
                          : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300",
                      };

                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            setStatusDraft(st);
                            if (st === "completed" && stageDraft !== "completed") {
                              setStageDraft("completed");
                            }
                          }}
                          className={`rounded-xl border px-3.5 py-2 text-xs font-semibold capitalize transition-all ${
                            statusStyles[st]
                          }`}
                        >
                          {st.replace("_", " ")}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>

              {/* QUANTITIES: Produced (Good) & Damaged */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Produced Quantity (Good Bricks)
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={producedDraft}
                    onFocus={(e) => {
                      if (producedDraft === "0") e.currentTarget.select();
                    }}
                    onBlur={() => {
                      setProducedDraft((value) => String(Number(value) || 0));
                    }}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value)) {
                        setProducedDraft(e.target.value);
                      }
                    }}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <span className="mt-1 block text-[11px] text-slate-400">
                    Planned: {selectedBatch.quantity.toLocaleString()} bricks
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Damaged / Broken Quantity
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={damagedDraft}
                    onFocus={(e) => {
                      if (damagedDraft === "0") e.currentTarget.select();
                    }}
                    onBlur={() => {
                      setDamagedDraft((value) => String(Number(value) || 0));
                    }}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value)) {
                        setDamagedDraft(e.target.value);
                      }
                    }}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-rose-600 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-rose-400"
                  />
                  <span className="mt-1 block text-[11px] text-slate-400">
                    Net Output: {Math.max(0, Number(producedDraft || 0) - Number(damagedDraft || 0)).toLocaleString()} bricks
                  </span>
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Batch Notes & Observations
                </label>
                <textarea
                  rows={2}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Kiln temperature, coal quality, weather conditions..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedBatch(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveBatchEdits}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
              >
                <CheckCircle2 size={16} />
                Save & Update Batch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
