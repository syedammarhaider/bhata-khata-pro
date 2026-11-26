// =========================================================
// FILE 567
// PATH: src/features/licensing/components/LicenseExpiredScreen.tsx
// =========================================================

interface Props {
  status: string;
}

export function LicenseExpiredScreen({ status }: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-5 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
          !
        </div>

        <h1 className="mt-5 text-2xl font-bold">
          Subscription Required
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          Your Bhatta Khata Pro subscription is {status.replace("_", " ")}.
          Please contact your software provider to receive a renewal key.
        </p>

        <p className="mt-5 rounded-xl bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          Your existing business data has not been deleted. Contact your
          administrator for license renewal and data export assistance.
        </p>
      </section>
    </main>
  );
}

export default LicenseExpiredScreen;
