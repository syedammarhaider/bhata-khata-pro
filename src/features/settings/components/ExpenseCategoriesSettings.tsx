// ============================================================
// Bhatta Khata Pro - Expense Categories Settings
// Add / Edit / Remove custom categories (Food, Personal Fuel, etc.)
// ============================================================

import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Plus, Trash2, Tag } from "lucide-react";

const DEFAULT_CATEGORIES = [
  "Food Expense (کھانا / خوراک)",
  "Personal Fuel (ذاتی پیٹرول / ڈیزل)",
  "Kiln Maintenance (بھٹہ مرمت و اوزار)",
  "Electricity & Generator (بجلی و جنریٹر)",
  "Labour Welfare & Tea (مزدور چائے و راشن)",
  "Transport & Freight (کرایہ و ٹرانسپورٹ)",
  "Office & Administrative (دفتری اخراجات)",
  "Government Taxes & Fees (ٹیکس و فیس)",
  "General / Miscellaneous (متفرق اخراجات)",
];

const SETTING_KEY = "bhatta_expense_categories";

export default function ExpenseCategoriesSettings() {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [newCat, setNewCat] = useState("");
  const [savedMsg, setSavedMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    invoke<{ setting_key: string; setting_value: string }[]>("get_app_settings")
      .then((settings) => {
        const found = settings.find((s) => s.setting_key === SETTING_KEY);
        if (found && found.setting_value) {
          const parsed = JSON.parse(found.setting_value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategories(parsed);
          }
        }
      })
      .catch(() => {});
  }, []);

  async function persist(newList: string[]) {
    try {
      await invoke("save_app_settings", {
        settings: [{ setting_key: SETTING_KEY, setting_value: JSON.stringify(newList) }],
      });
      setSavedMsg("Categories updated in database.");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch (err) {
      setError(String(err));
    }
  }

  const handleAdd = () => {
    if (!newCat.trim()) return;
    if (categories.includes(newCat.trim())) {
      setError("Category already exists.");
      return;
    }
    const updated = [...categories, newCat.trim()];
    setCategories(updated);
    setNewCat("");
    setError("");
    void persist(updated);
  };

  const handleRemove = (cat: string) => {
    if (categories.length <= 1) {
      setError("At least one expense category must remain.");
      return;
    }
    const updated = categories.filter((c) => c !== cat);
    setCategories(updated);
    void persist(updated);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Kiln Expense Categories
          </h3>
          <p className="text-xs text-slate-500">
            Define categories like Food Expense, Personal Fuel, Maintenance, etc. Used in the Expenses module and Financial Dashboard.
          </p>
        </div>

        {savedMsg && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            {savedMsg}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* Add Category Input */}
        <div className="flex gap-2 mb-5">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="Add new category (e.g. Food Expense, Personal Fuel)..."
            className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>

        {/* Categories List */}
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3 shadow-xs dark:border-slate-800 dark:bg-slate-800/50"
            >
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {cat}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(cat)}
                className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                title="Remove category"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
