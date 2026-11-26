import { Printer } from "lucide-react";

interface PrintButtonProps {
  onClick: () => void;
  title?: string;
  className?: string;
}

export default function PrintButton({ onClick, title = "Print", className = "" }: PrintButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 ${className}`}
    >
      <Printer size={13} />
      Print
    </button>
  );
}
