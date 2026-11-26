// ============================================================
// FILE 114
// PATH: E:\BRICKSCS\src\features\settings\LoginPage.tsx
// ============================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { Factory, ShieldCheck } from "lucide-react";

import LoginForm from "./components/LoginForm";
import { useAppStore } from "../../app/store";

import type { AuthSession, User } from "../../types";

interface LoginResult {
  user: User;
  session: AuthSession;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuthenticated = useAppStore((state) => state.setAuthenticated);
  const setRequiresSetup = useAppStore((state) => state.setRequiresSetup);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(
    username: string,
    password: string,
  ) {
    setError("");

    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);

    try {
      const result = await invoke<LoginResult>("login_user", {
        username,
        password,
      });

      setAuthenticated(result.user, result.session);
      setRequiresSetup(false);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <Factory size={30} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Bhatta Khata Pro
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to manage your brick kiln.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <h2 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
            Account login
          </h2>

          <LoginForm
            onSubmit={handleLogin}
            loading={loading}
            error={error}
          />
        </div>

        <div className="mt-5 flex flex-col items-center gap-2 text-xs text-slate-400">
          <Link
            to="/license"
            className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            License activation
          </Link>

          <p className="flex items-center gap-2">
            <ShieldCheck size={15} />
            Local desktop application
          </p>
        </div>
      </div>
    </main>
  );
}
