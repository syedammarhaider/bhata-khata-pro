
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

  return <Icon size={19} strokeWidth={1.8} className="text-slate-700 dark:text-slate-200" />;
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

  return (
    <div className="mb-5">
      {!collapsed && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mb-2 flex w-full items-center justify-between px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300"
        >
          {section.label}

          <ChevronDown
            size={14}
            className={`transition-transform ${
              expanded ? "" : "-rotate-90"
            }`}
          />
        </button>
      )}

      {(expanded || collapsed) && (
        <div className="space-y-1">
          {section.items.map((item) => (
            <NavLink
              key={item.id}
              to={item.route}
              end
              onClick={closeMobile}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-2 rounded-xl px-2 py-2 text-sm transition-colors",
                  collapsed ? "justify-center" : "",
                  isActive
                    ? "bg-blue-600 font-medium text-white shadow-sm shadow-blue-900/20"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
                ].join(" ")
              }
            >
              <NavigationIcon name={item.icon} />

              {!collapsed && (
                <span className="truncate">{item.label}</span>
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

  if (!currentUser) return null;

  const sections = getNavigationForRole(currentUser.role);

  const closeMobile = () => setMobileOpen(false);

  const sidebarContent = (
    <>
      <div className="flex h-[76px] items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
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

      <div className="flex-1 overflow-y-auto px-3 py-5">
        {sections.map((section) => (
          <NavigationGroup
            key={section.id}
            section={section}
            collapsed={collapsed}
            closeMobile={closeMobile}
          />
        ))}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 p-4">
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
        className="fixed left-4 top-4 z-40 rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-white lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      <aside
        className={`hidden shrink-0 flex-col bg-white border-r border-slate-200 dark:bg-slate-950 dark:border-slate-800 transition-[width] duration-200 lg:flex ${
          collapsed ? "w-[76px]" : "w-[260px]"
        }`}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={closeMobile}
            aria-label="Close navigation overlay"
          />

          <aside className="relative flex h-full w-[280px] flex-col bg-white dark:bg-slate-950 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
