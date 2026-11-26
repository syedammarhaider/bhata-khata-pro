// ============================================================
// FILE: src/components/common/ErrorBoundary.tsx
// Catches UI crashes, logs them, offers Report Issue.
// ============================================================

import { Component, type ReactNode } from "react";
import { AlertTriangle, Mail, Download } from "lucide-react";
import { reportIssueViaEmail, exportDiagnosticsFile, logFrontend } from "../../lib/diagnostics";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: unknown) {
    logFrontend(`React crash: ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
            <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            The app hit an unexpected error. It has been logged locally and was
            not sent automatically.
          </p>
          <p className="mt-2 break-all rounded-lg bg-slate-100 p-2 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {this.state.message}
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => void reportIssueViaEmail(`Crash: ${this.state.message}`)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Mail size={16} />
              Report Issue via Email
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  const p = await exportDiagnosticsFile();
                  alert(`Diagnostic file saved:\n${p}`);
                } catch {
                  alert("Could not export diagnostics.");
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Download size={16} />
              Export Diagnostic File
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Reload App
            </button>
          </div>
        </div>
      </div>
    );
  }
}
