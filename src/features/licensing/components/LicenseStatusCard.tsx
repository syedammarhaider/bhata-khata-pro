// =========================================================
// FILE 565
// PATH: src/features/licensing/components/LicenseStatusCard.tsx
// =========================================================

import type { LicenseInformation } from "../licensing.types";
import {
  formatLicenseDate,
  getDaysRemaining,
} from "../licensing.utils";

interface Props {
  license: LicenseInformation;
}

export function LicenseStatusCard({ license }: Props) {
  const active = license.status === "active";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-900 dark:text-white">
          Software License
        </h2>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            active
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
              : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
          }`}
        >
          {active ? "Active" : license.status.replace("_", " ")}
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Customer</p>
          <p className="mt-1 font-medium">
            {license.customerName || "Not registered"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">License ID</p>
          <p className="mt-1 break-all font-medium">
            {license.licenseId || "Not activated"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Expiry date</p>
          <p className="mt-1 font-medium">
            {license.expiresAt
              ? formatLicenseDate(license.expiresAt)
              : "Not available"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Days remaining</p>
          <p className="mt-1 font-medium">
            {license.expiresAt && active
              ? license.daysRemaining ?? getDaysRemaining(license.expiresAt)
              : 0}
          </p>
        </div>
      </div>

      <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
        Your accounting records remain stored locally on this computer.
      </p>
    </section>
  );
}

export default LicenseStatusCard;
