import type { ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";

interface FormRepeaterProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  renderItem: (
    item: T,
    index: number,
    updateItem: (updated: T) => void,
  ) => ReactNode;
  title?: string;
  addLabel?: string;
  minItems?: number;
  maxItems?: number;
  disabled?: boolean;
  className?: string;
}

export default function FormRepeater<T>({
  items,
  onChange,
  createItem,
  renderItem,
  title = "Items",
  addLabel = "Add item",
  minItems = 0,
  maxItems = 50,
  disabled = false,
  className = "",
}: FormRepeaterProps<T>) {
  const addItem = () => {
    if (disabled || items.length >= maxItems) return;
    onChange([...items, createItem()]);
  };

  const removeItem = (index: number) => {
    if (disabled || items.length <= minItems) return;
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  const updateItem = (index: number, updated: T) => {
    onChange(
      items.map((item, itemIndex) =>
        itemIndex === index ? updated : item,
      ),
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {title}
          <span className="ml-2 text-xs font-normal text-slate-400">
            ({items.length})
          </span>
        </h3>

        <button
          type="button"
          onClick={addItem}
          disabled={disabled || items.length >= maxItems}
          className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-950/40"
        >
          <Plus size={15} />
          {addLabel}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-400 dark:border-slate-700">
          No items added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="relative rounded-xl border border-slate-200 p-4 dark:border-slate-700"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Item {index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={disabled || items.length <= minItems}
                  aria-label={`Remove item ${index + 1}`}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-rose-950/40"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {renderItem(item, index, (updated) =>
                updateItem(index, updated),
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
