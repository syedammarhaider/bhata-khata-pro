import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { logFrontend } from "./lib/diagnostics";

// Global crash/unhandled-rejection capture → local rotating log.
window.addEventListener("error", (event) => {
  logFrontend(`window.onerror: ${event.message} @ ${event.filename}:${event.lineno}`);
});
window.addEventListener("unhandledrejection", (event) => {
  logFrontend(`unhandledrejection: ${String(event.reason)}`);
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
