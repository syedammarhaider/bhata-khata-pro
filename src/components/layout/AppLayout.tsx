
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import { useAppStore } from "../../app/store";
import { translateTextNode } from "../../lib/i18n";

export default function AppLayout() {
  const theme = useAppStore((state) => state.theme);
  const language = useAppStore((state) => state.language);
  const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed);

  useEffect(() => {
    const root = document.documentElement;

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const isDark =
      theme === "dark" || (theme === "system" && prefersDark);

    root.classList.toggle("dark", isDark);
    root.dir = language === "ur" ? "rtl" : "ltr";
    root.lang = language === "ur" ? "ur" : "en";
    root.classList.toggle("font-urdu", language === "ur");
    root.classList.toggle("language-both", language === "both");
  }, [theme, language]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className={`flex min-w-0 flex-1 flex-col transition-[margin] duration-200 ${language === "ur" ? (sidebarCollapsed ? "lg:mr-[68px]" : "lg:mr-[224px]") : (sidebarCollapsed ? "lg:ml-[68px]" : "lg:ml-[224px]")}`}>
          <Topbar />

          <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-[1800px]">
              <Outlet />
            </div>
          </main>

          <footer className="border-t border-slate-200 px-6 py-3 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
            Bhatta Khata Pro | {translateTextNode("Offline brick kiln management", language)}
            <span className="mx-2">|</span>
            {translateTextNode("Version", language)} 1.0.0
          </footer>
        </div>
      </div>
    </div>
  );
}
