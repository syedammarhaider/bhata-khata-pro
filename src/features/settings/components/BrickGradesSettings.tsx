import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Plus, Save, Trash2 } from "lucide-react";
import type { BrickGrade } from "../settings.types";

const emptyGrade = (): BrickGrade => ({
  id: 0,
  name: "",
  description: "",
  selling_price: 0,
  purchase_rate: 0,
  is_active: true,
  is_default: false,
});

export default function BrickGradesSettings() {
  const [grades, setGrades] = useState<BrickGrade[]>([]);
  const [draft, setDraft] = useState<BrickGrade>(emptyGrade());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      setGrades(await invoke<BrickGrade[]>("get_brick_grades"));
    } catch (err) {
      setError(String(err));
    }
  }

  useEffect(() => { void load(); }, []);

  async function save() {
    setMessage("");
    setError("");
    try {
      await invoke("save_brick_grade", { grade: draft });
      setDraft(emptyGrade());
      await load();
      setMessage("Brick grade saved.");
    } catch (err) {
      setError(String(err));
    }
  }

  async function remove(id: number) {
    setMessage("");
    setError("");
    try {
      await invoke("delete_brick_grade", { gradeId: id });
      await load();
      setMessage("Brick grade deleted.");
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <div className="space-y-5">
      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {message && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}

      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm font-medium">Grade name
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="mt-1 w-full rounded-xl border px-3 py-2.5" />
        </label>
        <label className="text-sm font-medium">Selling price / brick
          <input type="number" min="0" step="0.01" value={draft.selling_price} onChange={(e) => setDraft({ ...draft, selling_price: Number(e.target.value) })} className="mt-1 w-full rounded-xl border px-3 py-2.5" />
        </label>
        <label className="text-sm font-medium md:col-span-2">Description
          <input value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="mt-1 w-full rounded-xl border px-3 py-2.5" />
        </label>
        <label className="text-sm font-medium">Purchase / production rate
          <input type="number" min="0" step="0.01" value={draft.purchase_rate} onChange={(e) => setDraft({ ...draft, purchase_rate: Number(e.target.value) })} className="mt-1 w-full rounded-xl border px-3 py-2.5" />
        </label>
        <div className="flex items-end gap-4 pb-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.is_active} onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })} /> Active</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.is_default} onChange={(e) => setDraft({ ...draft, is_default: e.target.checked })} /> Default</label>
        </div>
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">
          {draft.id ? <Save size={16} /> : <Plus size={16} />} {draft.id ? "Update grade" : "Add grade"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b text-slate-500"><th className="p-3">Grade</th><th className="p-3">Selling</th><th className="p-3">Purchase</th><th className="p-3">Status</th><th className="p-3" /></tr></thead>
          <tbody>{grades.map((grade) => (
            <tr key={grade.id} className="border-b last:border-0">
              <td className="p-3 font-medium">{grade.name}{grade.is_default && <span className="ml-2 text-xs text-indigo-600">Default</span>}</td>
              <td className="p-3">{grade.selling_price}</td>
              <td className="p-3">{grade.purchase_rate}</td>
              <td className="p-3">{grade.is_active ? "Active" : "Archived"}</td>
              <td className="p-3">
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setDraft(grade)} className="rounded-lg border px-2.5 py-1.5">Edit</button>
                  <button type="button" onClick={() => remove(grade.id)} aria-label={`Delete ${grade.name}`} className="rounded-lg border border-red-200 p-1.5 text-red-600"><Trash2 size={15} /></button>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
