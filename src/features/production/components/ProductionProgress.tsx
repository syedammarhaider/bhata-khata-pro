// ============================================================
// FILE 128
// PATH: E:\BRICKSCS\src\features\production\components\ProductionProgress.tsx
// ============================================================

import { CheckCircle2, Circle } from "lucide-react";
import type { ProductionStage } from "../production.types";
import { PRODUCTION_STAGES } from "../production.constants";

interface ProductionProgressProps {
  currentStage: ProductionStage;
}

export default function ProductionProgress({
  currentStage,
}: ProductionProgressProps) {
  const currentIndex = PRODUCTION_STAGES.findIndex(
    (stage) => stage.value === currentStage,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          Production progress
        </h3>
        <span className="text-xs text-slate-500">
          {Math.max(0, currentIndex + 1)} / {PRODUCTION_STAGES.length}
        </span>
      </div>

      <div className="space-y-3">
        {PRODUCTION_STAGES.map((stage, index) => {
          const completed = index < currentIndex;
          const active = index === currentIndex;

          return (
            <div key={stage.value} className="flex items-start gap-3">
              <div
                className={`mt-0.5 ${
                  completed || active
                    ? "text-emerald-600"
                    : "text-slate-300 dark:text-slate-600"
                }`}
              >
                {completed ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <Circle size={20} fill={active ? "currentColor" : "none"} />
                )}
              </div>

              <div>
                <p
                  className={`text-sm font-medium ${
                    active
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {stage.label}
                </p>
                <p className="text-xs text-slate-500">
                  {stage.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
