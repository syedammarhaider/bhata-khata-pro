// ============================================================
// FILE 112
// PATH: E:\BRICKSCS\src\features\settings\SetupPage.tsx
// ============================================================

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";
import { Factory, KeyRound, ShieldCheck } from "lucide-react";

import SetupForm from "./components/SetupForm";
import { useAppStore } from "../../app/store";

import type { AdminSetup, BusinessProfile } from "./settings.types";

import {
  DEFAULT_BUSINESS_PROFILE,
} from "./settings.constants";

import {
  normalizeBusinessProfile,
  validateBusinessProfile,
} from "./settings.utils";

interface AppBootstrapState {
  business_profile: BusinessProfile | null;
  admin_exists: boolean;
}

export default function SetupPage() {
  const navigate = useNavigate();
  const setRequiresSetup = useAppStore((state) => state.setRequiresSetup);

  const [profile, setProfile] = useState<BusinessProfile>(
    DEFAULT_BUSINESS_PROFILE,
  );

  const [admin, setAdmin] = useState<AdminSetup>({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [adminExists, setAdminExists] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadExistingProfile() {
      try {
        const state = await invoke<AppBootstrapState>("get_app_state");

        if (active) {
          if (state.business_profile) {
            setProfile(state.business_profile);
          }
          setAdminExists(state.admin_exists);
        }
      } catch {
        // The setup form remains available if the profile
        // cannot be loaded. Save errors are shown separately.
      } finally {
        if (active) {
          setLoadingProfile(false);
        }
      }
    }

    void loadExistingProfile();

    return () => {
      active = false;
    };
  }, []);

  async function handleSave() {
    setErrors([]);
    setSuccessMessage("");

    const validationErrors = validateBusinessProfile(profile);

    if (!adminExists) {
      if (!admin.username.trim()) {
        validationErrors.push("Admin username is required.");
      }

      if (admin.password.length < 10) {
        validationErrors.push("Admin password must be at least 10 characters.");
      }

      if (admin.password !== admin.confirmPassword) {
        validationErrors.push("Admin passwords do not match.");
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const normalized = normalizeBusinessProfile(profile);

    setLoading(true);

    try {
      await invoke("save_business_profile", {
        profile: normalized,
      });

      if (!adminExists) {
        await invoke("setup_admin_user", {
          fullName: normalized.owner_name,
          username: admin.username.trim(),
          password: admin.password,
        });
      }

      setProfile(normalized);
      setRequiresSetup(false);
      setSuccessMessage("Business information saved successfully.");

      window.setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      setErrors([
        typeof error === "string"
          ? error
          : "Unable to save business information. Please try again.",
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <button
        type="button"
        onClick={() => navigate("/login")}
        aria-label="Sign in"
        className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-300 opacity-0 transition-opacity hover:opacity-50 focus:opacity-60 dark:text-slate-600"
      >
        <KeyRound size={16} />
      </button>

      <div className="w-full max-w-3xl">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <Factory size={30} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Bhatta Khata Pro
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Set up your brick kiln business.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          {loadingProfile ? (
            <div className="py-12 text-center text-sm text-slate-500">
              Loading business information...
            </div>
          ) : (
            <>
              <SetupForm
                profile={profile}
                onChange={setProfile}
                onSubmit={handleSave}
                loading={loading}
                errors={errors}
                admin={admin}
                onAdminChange={setAdmin}
                showAdminSetup={!adminExists}
              />

              {successMessage && (
                <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                  {successMessage}
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={15} />
          Business information is stored in the local application database.
        </div>
      </div>
    </main>
  );
}
