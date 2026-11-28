
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

import {
  Bell,
  ChevronDown,
  LifeBuoy,
  LogOut,
  Moon,
  Search,
  Shield,
  Sun,
  UserCircle,
  Languages,
  KeyRound,
  X,
} from "lucide-react";

import { MODULES } from "../../lib/constants";
import { reportIssueViaEmail } from "../../lib/diagnostics";
import { useAppStore } from "../../app/store";

import type { ThemeMode } from "../../app/store";
import ZoomControls from "./ZoomControls";
import PasswordSettings from "../../features/settings/components/PasswordSettings";
import { translateText, translateTextNode } from "../../lib/i18n";

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = useAppStore(
    (state) => state.currentUser,
  );

  const theme = useAppStore(
    (state) => state.theme,
  );

  const setTheme = useAppStore(
    (state) => state.setTheme,
  );

  const logout = useAppStore(
    (state) => state.logout,
  );
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  async function changeLanguage(nextLanguage: "en" | "ur" | "both") {
    try {
      await invoke("save_app_settings", { settings: [{ setting_key: "language", setting_value: nextLanguage }] });
      setLanguage(nextLanguage);
    } catch (error) {
      console.error("Unable to save language preference", error);
    }
  }

  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const currentModule = MODULES.find(
    (module) => module.route === location.pathname,
  );

  const searchResults = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return [];

    return MODULES.filter(
      (module) =>
        module.label.toLowerCase().includes(value) ||
        module.description.toLowerCase().includes(value),
    ).slice(0, 6);
  }, [search]);

  function toggleTheme() {
    const nextTheme: ThemeMode =
      theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <>
    <header className="sticky top-0 z-30 flex min-h-[76px] flex-wrap items-center justify-between gap-y-2 border-b border-slate-200 bg-white/95 px-4 py-2 ps-16 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 sm:px-6 sm:ps-16 lg:ps-8">
      <div className="min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {translateTextNode("Workspace", language)}
        </p>

        <h2 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
          {translateTextNode(currentModule?.label ?? "Dashboard", language)}
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <label className="hidden items-center gap-1.5 rounded-xl border border-slate-200 px-2 py-1.5 text-slate-500 dark:border-slate-700 dark:text-slate-400 sm:flex">
          <Languages size={15} />
          <select aria-label={translateText("Language", language)} value={language} onChange={(event) => void changeLanguage(event.target.value as "en" | "ur" | "both")} className="max-w-[120px] bg-transparent text-xs font-semibold text-slate-700 outline-none dark:text-slate-200">
            <option value="en">{translateText("English", language)}</option><option value="ur">{translateText("Urdu", language)}</option><option value="both">{translateText("Both", language)}</option>
          </select>
        </label>
        <ZoomControls />
        <div className="relative hidden md:block">
          <Search
            size={17}
            className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={translateText("Search modules...", language)}
            className="h-10 w-48 rounded-xl border border-slate-200 bg-slate-50 ps-9 pe-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-800 lg:w-64"
          />

          {searchResults.length > 0 && (
            <div className="absolute end-0 top-12 z-50 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              {searchResults.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    navigate(item.route);
                    setSearch("");
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-start text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span className="block font-medium">
                  {translateTextNode(item.label, language)}
                  </span>
                  <span className="block text-xs text-slate-400">
                  {translateTextNode(item.description, language)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          title={translateText("Toggle theme", language)}
          className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setNotificationsOpen((value) => !value)
            }
            title={translateText("Notifications", language)}
            className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Bell size={18} />
            <span className="absolute end-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {notificationsOpen && (
            <div className="absolute end-0 top-12 z-50 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {translateTextNode("Notifications", language)}
              </h3>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                {translateTextNode("No notifications are available yet.", language)}
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((value) => !value)}
            className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <UserCircle
              size={27}
              className="text-slate-500 dark:text-slate-300"
            />

            <span className="hidden max-w-28 truncate text-sm font-medium text-slate-700 dark:text-slate-200 xl:block">
              {currentUser?.full_name}
            </span>

            <ChevronDown
              size={15}
              className="hidden text-slate-400 sm:block"
            />
          </button>

          {profileOpen && (
            <div className="absolute end-0 top-12 z-50 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                  {currentUser?.full_name}
                </p>
                <p className="text-xs capitalize text-slate-400">
                  {translateTextNode(currentUser?.role ?? "", language)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => { setProfileOpen(false); setPasswordDialogOpen(true); }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <KeyRound size={16} />
                {translateTextNode("Change my password", language)}
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/admin");
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Shield size={16} />
                {translateTextNode("Admin Panel", language)}
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  void reportIssueViaEmail();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <LifeBuoy size={16} />
                {translateTextNode("Report Issue", language)}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut size={16} />
                {translateTextNode("Sign out", language)}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
    {passwordDialogOpen && (
      <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/55 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setPasswordDialogOpen(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="password-dialog-title" className="w-full max-w-xl rounded-2xl border border-slate-300 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between"><h2 id="password-dialog-title" className="text-lg font-bold">{translateTextNode("Change my password", language)}</h2><button type="button" onClick={() => setPasswordDialogOpen(false)} className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label={translateText("Close", language)}><X size={18} /></button></div>
          <PasswordSettings />
        </section>
      </div>
    )}
    </>
  );
}
