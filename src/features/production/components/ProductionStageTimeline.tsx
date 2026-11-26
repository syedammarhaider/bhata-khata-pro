// ============================================================
// FILE 134
// PATH: E:\BRICKSCS\src\features\production\components\ProductionStageTimeline.tsx
// ============================================================

import { CheckCircle2, Circle } from "lucide-react";
import type { ProductionStage } from "../production.types";
import { PRODUCTION_STAGES } from "../production.constants";

interface ProductionStageTimelineProps {
  currentStage: ProductionStage;
  compact?: boolean;
}

export default function ProductionStageTimeline({
  currentStage,
  compact = false,
}: ProductionStageTimelineProps) {
  const currentIndex = PRODUCTION_STAGES.findIndex(
    (item) => item.value === currentStage,
  );

  return (
    <div className="flex w-full items-start">
      {PRODUCTION_STAGES.map((stage, index) => {
        const completed = index < currentIndex;
        const active = index === currentIndex;

        return (
          <div
            key={stage.value}
            className="flex min-w-0 flex-1 flex-col items-center"
          >
            <div className="flex w-full items-center">
              <div
                className={`h-0.5 flex-1 ${
                  index === 0
                    ? "bg-transparent"
                    : completed || active
                      ? "bg-emerald-500"
                      : "bg-slate-200 dark:bg-slate-700"
                }`}
              />

              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  completed
                    ? "bg-emerald-100 text-emerald-700"
                    : active
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                }`}
              >
                {completed ? (
                  <CheckCircle2 size={17} />
                ) : (
                  <Circle size={15} />
                )}
              </span>

              <div
                className={`h-0.5 flex-1 ${
                  index === PRODUCTION_STAGES.length - 1
                    ? "bg-transparent"
                    : completed
                      ? "bg-emerald-500"
                      : "bg-slate-200 dark:bg-slate-700"
                }`}
              />
            </div>

            <span className="mt-2 text-center text-xs font-medium text-slate-600 dark:text-slate-300">
              {compact
                ? stage.label.slice(0, 3)
                : stage.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
