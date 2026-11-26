// ============================================================
// FILE: src/lib/diagnostics.ts
// Zero-cost remote error reporting: mailto bundle + file export.
// ============================================================

import {
  getSystemInfo,
  getRecentErrors,
  exportDiagnosticFile,
  logFrontendError,
} from "./api";

export const SUPPORT_EMAIL = "syedammar496539@gmail.com";

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + "\n...[truncated]" : text;
}

/** Builds a sanitized diagnostic text payload (system info + recent errors). */
export async function buildDiagnosticPayload(extra?: string) {
  try {
    const [info, errors] = await Promise.all([
      getSystemInfo(),
      getRecentErrors(150),
    ]);
    return [
      "BHATTA KHATA PRO — ISSUE REPORT",
      `Generated: ${new Date().toISOString()}`,
      `App version: ${info.app_version}`,
      `OS: ${info.os} (${info.arch})`,
      `Schema version: ${info.schema_version}`,
      `DB size: ${info.db_size_bytes} bytes`,
      extra ? `\nUser note:\n${extra}` : "",
      "\n--- RECENT LOG (may contain user data; review before sharing) ---",
      truncate(errors.join("\n"), 6000),
    ].join("\n");
  } catch {
    return `Issue report — diagnostics unavailable.\n${extra ?? ""}`;
  }
}

/** Opens the user's mail app pre-filled to support with diagnostics attached in body. */
export async function reportIssueViaEmail(extra?: string) {
  const body = await buildDiagnosticPayload(extra);
  const subject = encodeURIComponent("Bhatta Khata Pro — Issue Report");
  const mailbody = encodeURIComponent(body);
  window.open(
    `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${mailbody}`,
    "_blank",
  );
}

/** Exports a diagnostic .txt file locally (for WhatsApp/email when offline). */
export async function exportDiagnosticsFile() {
  return exportDiagnosticFile();
}

/** Logs a frontend error/crash into the local rotating log. */
export function logFrontend(message: string) {
  void logFrontendError(message).catch(() => {});
}
