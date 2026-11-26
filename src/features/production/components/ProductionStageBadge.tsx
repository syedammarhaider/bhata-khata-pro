import type { ProductionStage } from "../production.types";
import { PRODUCTION_STAGES } from "../production.constants";

interface ProductionStageBadgeProps {
  stage: ProductionStage;
}

export default function ProductionStageBadge({
  stage,
}: ProductionStageBadgeProps) {
  const styles: Record<ProductionStage, string> = {
    pathai: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    bhari: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
    bharai: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
    jalai: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
    nikasi: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
    completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  };

  const label =
    PRODUCTION_STAGES.find((item) => item.value === stage)?.label ?? stage;

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[stage]}`}
    >
      {label}
    </span>
  );
}
