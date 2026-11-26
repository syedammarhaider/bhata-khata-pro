// ============================================================
// Bhatta Khata Pro - Kiln Fuel Types Settings
// Add / Edit / Remove fuels: Coal, Gas, Wood, Rice Husk
// ============================================================

import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Plus, Trash2, Flame } from "lucide-react";

const DEFAULT_FUEL_TYPES = [
  "Coal (کوئلہ - Baluchistan/Duki)",
  "Coal (کوئلہ - Imported/Afghan)",
  "Wood / Firewood (لکڑی)",
  "Rice Husk (توڑی / چھلکا)",
  "Natural Gas (سوئی گیس)",
  "Bagasse / Biomass (پھوک)",
];

const SETTING_KEY = "bhatta_fuel_types";

export default function FuelTypesSettings() {
  const [fuelTypes, setFuelTypes] = useState<string[]>(DEFAULT_FUEL_TYPES);
  const [newFuel, setNewFuel] = useState("");
  const [savedMsg, setSavedMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    invoke<{ setting_key: string; setting_value: string }[]>("get_app_settings")
      .then((settings) => {
        const found = settings.find((s) => s.setting_key === SETTING_KEY);
        if (found && found.setting_value) {
          const parsed = JSON.parse(found.setting_value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFuelTypes(parsed);
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
      setSavedMsg("Kiln fuel types updated in database.");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch (err) {
      setError(String(err));
    }
  }

  const handleAdd = () => {
    if (!newFuel.trim()) return;
    if (fuelTypes.includes(newFuel.trim())) {
      setError("Fuel type already exists.");
      return;
    }
    const updated = [...fuelTypes, newFuel.trim()];
    setFuelTypes(updated);
    setNewFuel("");
    setError("");
    void persist(updated);
  };

  const handleRemove = (type: string) => {
    if (fuelTypes.length <= 1) {
      setError("At least one fuel type must remain.");
      return;
    }
    const updated = fuelTypes.filter((f) => f !== type);
    setFuelTypes(updated);
    void persist(updated);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Kiln Fuel & Energy Types
          </h3>
          <p className="text-xs text-slate-500">
            Configure fuels used for firing and burning bricks (Coal, Natural Gas, Wood, Rice Husk).
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

        <div className="flex gap-2 mb-5">
          <input
            value={newFuel}
            onChange={(e) => setNewFuel(e.target.value)}
            placeholder="Add new fuel type (e.g. Sawdust, Pellet)..."
            className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus size={16} /> Add Fuel
          </button>
        </div>

        <div className="space-y-2">
          {fuelTypes.map((fuel) => (
            <div
              key={fuel}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3 shadow-xs dark:border-slate-800 dark:bg-slate-800/50"
            >
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-amber-500" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {fuel}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(fuel)}
                className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                title="Remove fuel type"
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
