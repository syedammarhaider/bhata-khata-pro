
import { Search, X } from "lucide-react";
import { useAppStore } from "../../app/store";
import { translateText } from "../../lib/i18n";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  disabled = false,
  autoFocus = false,
}: SearchInputProps) {
  const language = useAppStore((state) => state.language);
  const localizedPlaceholder = translateText(placeholder, language);
  return (
    <div className={`relative w-full ${className}`}>
      <Search
        size={17}
        className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
      />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={localizedPlaceholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white py-2 ps-10 pe-10 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400"
        aria-label={localizedPlaceholder}
      />

      {value && !disabled && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={translateText("Clear search", language)}
          className="absolute end-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
