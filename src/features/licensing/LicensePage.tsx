// =========================================================
// FILE 568
// PATH: src/features/licensing/LicensePage.tsx
// =========================================================

import { useCallback, useEffect, useState } from "react";

import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import type { LicenseInformation } from "./licensing.types";

import { getLicenseInformation } from "./licensing.service";
import { LicenseStatusCard } from "./components/LicenseStatusCard";
import { ActivationKeyForm } from "./components/ActivationKeyForm";

export default function LicensePage() {
  const [license, setLicense] = useState<LicenseInformation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLicense = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const information = await getLicenseInformation();
      setLicense(information);
    } catch {
      setError("Unable to retrieve license information.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLicense();
  }, [loadLicense]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Software License"
        description="View activation and subscription information."
      />

      {error && (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      {license && <LicenseStatusCard license={license} />}

      <ActivationKeyForm onActivated={loadLicense} />
    </div>
  );
}
