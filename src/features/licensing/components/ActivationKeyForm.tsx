// =========================================================
// FILE 566
// PATH: src/features/licensing/components/ActivationKeyForm.tsx
// =========================================================

import { useState } from "react";
import { activateLicense } from "../licensing.service";

interface Props {
  onActivated: () => void;
}

export function ActivationKeyForm({ onActivated }: Props) {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleActivation() {
    if (!key.trim()) {
      setSuccess(false);
      setMessage("Please enter your activation key.");
      return;
    }

    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const result = await activateLicense({
        activationKey: key,
      });

      if (!result.success) {
        setSuccess(false);
        setMessage(result.message);
        return;
      }

      setSuccess(true);
      setMessage(result.message);
      onActivated();
    } catch {
      setSuccess(false);
      setMessage(
        "Activation could not be completed. Check the key and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Activate Bhatta Khata Pro</h2>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Enter the activation or renewal key provided by your software
        administrator.
      </p>

      <label className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Activation key
      </label>

      <textarea
        value={key}
        onChange={(event) => setKey(event.target.value)}
        rows={4}
        placeholder="Paste your activation key here"
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      />

      {message && (
        <p className={`mt-3 text-sm ${success ? "text-emerald-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      <button
        type="button"
        disabled={loading}
        onClick={handleActivation}
        className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Verifying key..." : "Activate Software"}
      </button>
    </section>
  );
}

export default ActivationKeyForm;
