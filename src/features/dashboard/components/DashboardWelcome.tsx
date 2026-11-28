import { Activity, CalendarDays, Factory, ShieldCheck } from "lucide-react";
import { useAppStore } from "../../../app/store";
import { translateTextNode } from "../../../lib/i18n";

interface DashboardWelcomeProps {
  userName: string;
  businessName: string;
  subtitle?: string;
  date?: string;
}

export default function DashboardWelcome({
  userName,
  businessName,
  subtitle = "Your kiln’s daily pulse, production, cash flow and workforce — together.",
  date,
}: DashboardWelcomeProps) {
  const language = useAppStore((state) => state.language);
  const displayDate =
    date ??
    new Intl.DateTimeFormat("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date());

  return (
    <section className="dashboard-hero relative isolate overflow-hidden rounded-[28px] border border-kiln-ink-soft bg-kiln-ink px-5 py-6 text-white shadow-xl shadow-slate-900/10 sm:px-8 sm:py-8">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-36 -z-10 h-96 w-96 rounded-full border border-white/10 bg-kiln-clay/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-52 left-[38%] -z-10 h-80 w-80 rounded-full bg-kiln-lime/10 blur-3xl" />
      <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
        <div className="min-w-0">
          <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-xs font-semibold tracking-wide text-white/80">
            <Factory size={15} className="shrink-0 text-kiln-lime" />
            <span className="truncate">{businessName}</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>{translateTextNode("OPERATIONS", language)}</span>
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-kiln-lime">{translateTextNode("Kiln control room", language)}</p>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.7rem]">
            {translateTextNode("Welcome back,", language)} <span className="text-kiln-lime">{userName}</span>
          </h1>
          {subtitle && <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">{translateTextNode(subtitle, language)}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-white/85">
              <ShieldCheck size={15} className="text-kiln-lime" /> {translateTextNode("Local-first records", language)}
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-white/85">
              <Activity size={15} className="text-kiln-lime" /> {translateTextNode("Live business overview", language)}
            </span>
          </div>
        </div>

        <div className="dashboard-hero-date rounded-2xl border border-white/12 bg-white/[0.07] p-4 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">{translateTextNode("Today’s briefing", language)}</p>
              <p className="mt-2 text-lg font-semibold text-white">{displayDate}</p>
            </div>
            <div className="rounded-xl bg-kiln-lime/10 p-2.5 text-kiln-lime">
              <CalendarDays size={19} />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-white/65">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-kiln-lime opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-kiln-lime" />
            </span>
            {translateTextNode("Your local workspace is ready", language)}
          </div>
        </div>
      </div>
    </section>
  );
}
