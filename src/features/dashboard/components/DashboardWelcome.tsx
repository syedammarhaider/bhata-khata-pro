import { Factory, CalendarDays } from "lucide-react";

interface DashboardWelcomeProps {
  userName: string;
  businessName: string;
  subtitle?: string;
  date?: string;
}

export default function DashboardWelcome({
  userName,
  businessName,
  subtitle = "",
  date,
}: DashboardWelcomeProps) {
  const displayDate =
    date ??
    new Intl.DateTimeFormat("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date());

  return (
    <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white p-3 dark:border-indigo-900/50 dark:from-indigo-950/50 dark:to-slate-900 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-700 dark:text-indigo-300">
            <Factory size={17} />
            <span className="truncate">{businessName}</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Welcome back, {userName}
          </h1>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <CalendarDays size={18} className="text-indigo-500" />
          <span>{displayDate}</span>
        </div>
      </div>
    </section>
  );
}
