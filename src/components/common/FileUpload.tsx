import { useRef, useState } from "react";
import { FileUp, File, X } from "lucide-react";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

export default function FileUpload({
  onFilesSelected,
  accept,
  multiple = false,
  maxSizeMB = 10,
  disabled = false,
  label = "Upload files",
  description = "Select or drag files here.",
  className = "",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState("");

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const files = Array.from(fileList);

    const oversized = files.find(
      (file) => file.size > maxSizeMB * 1024 * 1024,
    );

    if (oversized) {
      setError(`${oversized.name} exceeds the ${maxSizeMB} MB limit.`);
      return;
    }

    setError("");

    const nextFiles = multiple
      ? [...selectedFiles, ...files]
      : files.slice(0, 1);

    setSelectedFiles(nextFiles);
    onFilesSelected(nextFiles);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    const nextFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(nextFiles);
    onFilesSelected(nextFiles);
  };

  return (
    <div className={`w-full ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-indigo-500"
      >
        <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
          <FileUp size={21} />
        </span>

        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {label}
        </span>

        <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {description}
        </span>

        <span className="mt-2 text-xs text-slate-400">
          Maximum file size: {maxSizeMB} MB
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(event) => handleFiles(event.target.files)}
        className="hidden"
      />

      {error && (
        <p className="mt-2 text-sm text-rose-500">{error}</p>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${file.lastModified}-${index}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700"
            >
              <div className="flex min-w-0 items-center gap-2">
                <File size={17} className="shrink-0 text-indigo-500" />
                <div className="min-w-0">
                  <p className="truncate text-sm text-slate-700 dark:text-slate-200">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeFile(index)}
                aria-label={`Remove ${file.name}`}
                className="rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/40"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
