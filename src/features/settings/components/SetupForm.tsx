// ============================================================
// FILE 111
// PATH: E:\BRICKSCS\src\features\settings\components\SetupForm.tsx
// ============================================================

import type { FormEvent } from "react";
import { Building2, Save } from "lucide-react";

import type { AdminSetup, BusinessProfile } from "../settings.types";
import { CURRENCY_OPTIONS, LANGUAGE_OPTIONS } from "../settings.constants";

interface SetupFormProps {
  profile: BusinessProfile;
  onChange: (profile: BusinessProfile) => void;
  onSubmit: () => void;
  loading?: boolean;
  errors?: string[];
  admin?: AdminSetup;
  onAdminChange?: (admin: AdminSetup) => void;
  showAdminSetup?: boolean;
}

export default function SetupForm({
  profile,
  onChange,
  onSubmit,
  loading = false,
  errors = [],
  admin,
  onAdminChange,
  showAdminSetup = false,
}: SetupFormProps) {
  function updateField<K extends keyof BusinessProfile>(
    field: K,
    value: BusinessProfile[K],
  ) {
    onChange({
      ...profile,
      [field]: value,
    });
  }

  function updateAdmin<K extends keyof AdminSetup>(
    field: K,
    value: AdminSetup[K],
  ) {
    if (!admin || !onAdminChange) return;

    onAdminChange({
      ...admin,
      [field]: value,
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-indigo-950";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.length > 0 && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/30"
        >
          <ul className="list-inside list-disc space-y-1 text-sm text-rose-700 dark:text-rose-300">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <Building2 size={22} />
        </span>

        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Kiln business information
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter your brick kiln's official details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className={labelClass}>Business name *</label>
          <input
            required
            value={profile.business_name}
            onChange={(event) =>
              updateField("business_name", event.target.value)
            }
            placeholder="e.g. Al-Noor Brick Kiln"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Owner name *</label>
          <input
            required
            value={profile.owner_name}
            onChange={(event) =>
              updateField("owner_name", event.target.value)
            }
            placeholder="Business owner name"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Phone number *</label>
          <input
            required
            type="tel"
            value={profile.phone}
            onChange={(event) =>
              updateField("phone", event.target.value)
            }
            placeholder="03XX XXXXXXX"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Email address</label>
          <input
            type="email"
            value={profile.email}
            onChange={(event) =>
              updateField("email", event.target.value)
            }
            placeholder="business@example.com"
            className={inputClass}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Business address *</label>
          <textarea
            required
            rows={3}
            value={profile.address}
            onChange={(event) =>
              updateField("address", event.target.value)
            }
            placeholder="Complete brick kiln address"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>City *</label>
          <input
            required
            value={profile.city}
            onChange={(event) =>
              updateField("city", event.target.value)
            }
            placeholder="e.g. Pattoki"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Country</label>
          <input
            value={profile.country}
            onChange={(event) =>
              updateField("country", event.target.value)
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Business currency</label>
          <select
            value={profile.currency}
            onChange={(event) =>
              updateField("currency", event.target.value)
            }
            className={inputClass}
          >
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Application language</label>
          <select
            value={profile.language}
            onChange={(event) =>
              updateField("language", event.target.value)
            }
            className={inputClass}
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showAdminSetup && admin && onAdminChange && (
        <div className="space-y-5 border-t border-slate-200 pt-6 dark:border-slate-800">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Administrator account
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create the local admin account used to sign in to this kiln.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Admin username *</label>
              <input
                required
                autoComplete="username"
                value={admin.username}
                onChange={(event) =>
                  updateAdmin("username", event.target.value)
                }
                placeholder="e.g. kiln_admin"
                className={inputClass}
              />
            </div>

            <div />

            <div>
              <label className={labelClass}>Password *</label>
              <input
                required
                type="password"
                minLength={10}
                autoComplete="new-password"
                value={admin.password}
                onChange={(event) =>
                  updateAdmin("password", event.target.value)
                }
                placeholder="Minimum 10 characters"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Confirm password *</label>
              <input
                required
                type="password"
                minLength={10}
                autoComplete="new-password"
                value={admin.confirmPassword}
                onChange={(event) =>
                  updateAdmin("confirmPassword", event.target.value)
                }
                placeholder="Repeat password"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end border-t border-slate-200 pt-5 dark:border-slate-800">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />
          {loading ? "Saving..." : "Save business information"}
        </button>
      </div>
    </form>
  );
}
