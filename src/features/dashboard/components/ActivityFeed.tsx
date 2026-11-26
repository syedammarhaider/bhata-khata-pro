import { Clock, Circle } from "lucide-react";

export interface ActivityItem {
  id: string | number;
  title: string;
  description?: string;
  timestamp: string;
  category?: string;
  color?: "indigo" | "emerald" | "amber" | "rose" | "blue";
}

interface ActivityFeedProps {
  items: ActivityItem[];
  emptyMessage?: string;
  maxItems?: number;
}

const dotClasses = {
  indigo: "text-indigo-500",
  emerald: "text-emerald-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
  blue: "text-blue-500",
};

export default function ActivityFeed({
  items,
  emptyMessage = "No recent activity to display.",
  maxItems = 8,
}: ActivityFeedProps) {
  const visibleItems = items.slice(0, maxItems);

  if (visibleItems.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {visibleItems.map((item) => (
        <article key={item.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
          <div className="mt-1 shrink-0">
            <Circle
              size={11}
              fill="currentColor"
              className={dotClasses[item.color ?? "indigo"]}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {item.title}
              </h3>

              {item.category && (
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {item.category}
                </span>
              )}
            </div>

            {item.description && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {item.description}
              </p>
            )}

            <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
              <Clock size={12} />
              {item.timestamp}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
