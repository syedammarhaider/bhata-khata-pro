import { useCallback, useEffect, useState } from "react";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

const KEY = "bkp.display.zoom";
const MIN = 0.75;
const MAX = 1.5;
const STEP = 0.1;

function readZoom() {
  const value = Number(localStorage.getItem(KEY));
  return Number.isFinite(value) && value >= MIN && value <= MAX ? value : 1;
}

export default function ZoomControls() {
  const [zoom, setZoom] = useState(readZoom);

  const applyZoom = useCallback(async (next: number) => {
    const value = Math.min(MAX, Math.max(MIN, Math.round(next * 100) / 100));
    setZoom(value);
    localStorage.setItem(KEY, String(value));
    try {
      await getCurrentWebview().setZoom(value);
      document.documentElement.style.zoom = "";
    } catch {
      document.documentElement.style.zoom = String(value);
    }
  }, []);

  useEffect(() => {
    void applyZoom(readZoom());
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey || event.altKey || event.metaKey) return;
      if (event.key === "+" || event.key === "=" || event.code === "NumpadAdd") {
        event.preventDefault(); void applyZoom(zoom + STEP);
      } else if (event.key === "-" || event.code === "NumpadSubtract") {
        event.preventDefault(); void applyZoom(zoom - STEP);
      } else if (event.key === "0" || event.code === "Numpad0") {
        event.preventDefault(); void applyZoom(1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [applyZoom, zoom]);

  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900" aria-label="Display zoom">
      <button type="button" onClick={() => void applyZoom(zoom - STEP)} title="Zoom out (Ctrl −)" aria-label="Zoom out" className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"><ZoomOut size={16} /></button>
      <span className="min-w-10 text-center text-[11px] font-semibold tabular-nums text-slate-600 dark:text-slate-300">{Math.round(zoom * 100)}%</span>
      <button type="button" onClick={() => void applyZoom(zoom + STEP)} title="Zoom in (Ctrl +)" aria-label="Zoom in" className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"><ZoomIn size={16} /></button>
      <button type="button" onClick={() => void applyZoom(1)} title="Reset zoom (Ctrl 0)" aria-label="Reset zoom" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"><RotateCcw size={14} /></button>
    </div>
  );
}
