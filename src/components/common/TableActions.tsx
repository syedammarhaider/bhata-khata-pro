import {
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Printer,
} from "lucide-react";

export interface TableAction {
  label: string;
  onClick: () => void;
  icon?: "view" | "edit" | "delete" | "print";
  disabled?: boolean;
  danger?: boolean;
}

interface TableActionsProps {
  actions: TableAction[];
  className?: string;
}

const iconMap = {
  view: Eye,
  edit: Pencil,
  delete: Trash2,
  print: Printer,
};

export default function TableActions({
  actions,
  className = "",
}: TableActionsProps) {
  return (
    <div className={`flex items-center justify-end gap-1 ${className}`}>
      {actions.map((action, index) => {
        const Icon = action.icon ? iconMap[action.icon] : MoreHorizontal;

        return (
          <button
            key={`${action.label}-${index}`}
            type="button"
            title={action.label}
            aria-label={action.label}
            disabled={action.disabled}
            onClick={(event) => {
              event.stopPropagation();
              action.onClick();
            }}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-40 ${
              action.danger
                ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                : "text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
            }`}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
}
