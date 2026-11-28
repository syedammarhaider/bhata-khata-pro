
import { useState } from "react";
import type { ElementType } from "react";
import { NavLink } from "react-router-dom";

import {
  Banknote,
  BookOpen,
  Boxes,
  CalendarCheck,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Contact,
  DatabaseBackup,
  Factory,
  FileBarChart,
  FileText,
  Flame,
  HardHat,
  History,
  LayoutDashboard,
  Menu,
  Receipt,
  RotateCcw,
  Settings,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Truck,
  Users,
  Wallet,
  X,
} from "lucide-react";

import { getNavigationForRole } from "../../app/navigation";
import { useAppStore } from "../../app/store";
import { translateText, translateTextNode } from "../../lib/i18n";

import type { NavigationSection } from "../../app/navigation";

function NavigationIcon({
  name,
}: {
  name: string;
}) {
  const icons: Record<string, ElementType> = {
    LayoutDashboard,
    Factory,
    Boxes,
    ShoppingCart,
    ClipboardList,
    Truck,
    RotateCcw,
    FileText,
    Users,
    Contact,
    Wallet,
    BookOpen,
    HardHat,
    CalendarCheck,
    Banknote,
    Flame,
    Receipt,
    ShoppingBag,
    FileBarChart,
    ChartNoAxesCombined,
    ShieldCheck,
    SlidersHorizontal,
    History,
    DatabaseBackup,
    Settings,
  };

  const Icon = icons[name] ?? LayoutDashboard;

  return <Icon size={18} strokeWidth={1.8} className="text-slate-700 dark:text-slate-200" />;
}

function NavigationGroup({
  section,
  collapsed,
  closeMobile,
}: {
  section: NavigationSection;
  collapsed: boolean;
  closeMobile: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const language = useAppStore((state) => state.language);

  return (
    <div className="mb-3">
      {!collapsed && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mb-1 flex w-full items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600 dark:text-slate-300"
        >
          {translateTextNode(section.label, language)}

          <ChevronDown
            size={14}
            className={`transition-transform ${
              expanded ? "" : "-rotate-90"
            }`}
          />
        </button>
      )}

      {(expanded || collapsed) && (
        <div className="space-y-0.5">
          {section.items.map((item) => (
            <NavLink
              key={item.id}
              to={item.route}
              end
              onClick={closeMobile}
              title={collapsed ? translateText(item.label, language) : undefined}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] transition-colors",
                  collapsed ? "justify-center" : "",
                  isActive
                    ? "bg-kiln-clay font-medium text-white shadow-sm shadow-orange-900/20"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
                ].join(" ")
              }
            >
              <NavigationIcon name={item.icon} />

              {!collapsed && (
                <span className="truncate">{translateTextNode(item.label, language)}</span>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const currentUser = useAppStore(
    (state) => state.currentUser,
  );

  const collapsed = useAppStore(
    (state) => state.sidebarCollapsed,
  );

  const toggleSidebar = useAppStore(
    (state) => state.toggleSidebar,
  );

  const [mobileOpen, setMobileOpen] = useState(false);
  const language = useAppStore((state) => state.language);

  if (!currentUser) return null;

  const sections = getNavigationForRole(currentUser.role);

  const closeMobile = () => setMobileOpen(false);

  const sidebarContent = (
    <>
      <div className="flex h-[64px] shrink-0 items-center justify-between border-b border-slate-200 px-3 dark:border-slate-800">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-kiln-clay text-white">
            <Factory size={22} />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                Bhatta Khata Pro
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Kiln Management ERP
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white lg:block"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>

        <button
          type="button"
          onClick={closeMobile}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={19} />
        </button>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-3">
        {sections.map((section) => (
          <NavigationGroup
            key={section.id}
            section={section}
            collapsed={collapsed}
            closeMobile={closeMobile}
          />
        ))}
      </nav>

      <div className="shrink-0 border-t border-slate-200 p-3 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white">
            {currentUser.full_name
              .split(" ")
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase()}
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                {currentUser.full_name}
              </p>
              <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
                {currentUser.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className={`fixed ${language === "ur" ? "right-4 left-auto" : "left-4 right-auto"} top-4 z-40 rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-white lg:hidden`}
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      <aside
        className={`fixed inset-y-0 z-40 hidden shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200 dark:border-slate-800 dark:bg-slate-950 lg:flex ${language === "ur" ? "right-0 left-auto" : "left-0 right-auto"} ${
          collapsed ? "w-[68px]" : "w-[224px]"
        }`}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className={`fixed inset-0 z-50 flex lg:hidden ${language === "ur" ? "justify-end" : "justify-start"}`}>
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={closeMobile}
            aria-label="Close navigation overlay"
          />

          <aside className="relative flex h-full w-[260px] flex-col bg-white shadow-2xl dark:bg-slate-950">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
