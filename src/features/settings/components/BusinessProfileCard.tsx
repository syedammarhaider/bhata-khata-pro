// ============================================================
// FILE 116
// PATH: E:\BRICKSCS\src\features\settings\components\BusinessProfileCard.tsx
// ============================================================

import { Building2, Mail, MapPin, Phone, UserRound } from "lucide-react";
import type { BusinessProfile } from "../settings.types";

interface BusinessProfileCardProps {
  profile: BusinessProfile;
  onEdit?: () => void;
}

export default function BusinessProfileCard({
  profile,
  onEdit,
}: BusinessProfileCardProps) {
  const details = [
    {
      label: "Owner",
      value: profile.owner_name,
      icon: <UserRound size={17} />,
    },
    {
      label: "Phone",
      value: profile.phone,
      icon: <Phone size={17} />,
    },
    {
      label: "Email",
      value: profile.email,
      icon: <Mail size={17} />,
    },
    {
      label: "Address",
      value: [profile.address, profile.city, profile.country]
        .filter(Boolean)
        .join(", "),
      icon: <MapPin size={17} />,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Building2 size={23} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {profile.business_name || "Business not configured"}
            </h3>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {profile.currency} · {profile.language.toUpperCase()}
            </p>
          </div>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Edit profile
          </button>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {details.map((item) => (
          <div key={item.label} className="flex min-w-0 gap-3">
            <span className="mt-0.5 text-slate-400">{item.icon}</span>

            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {item.label}
              </p>

              <p className="mt-1 break-words text-sm text-slate-800 dark:text-slate-200">
                {item.value || "Not provided"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
