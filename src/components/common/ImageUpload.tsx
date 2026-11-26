import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

interface ImageUploadProps {
  onImageSelected: (file: File | null) => void;
  initialPreview?: string;
  disabled?: boolean;
  maxSizeMB?: number;
  label?: string;
  className?: string;
}

export default function ImageUpload({
  onImageSelected,
  initialPreview,
  disabled = false,
  maxSizeMB = 5,
  label = "Upload image",
  className = "",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initialPreview ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview(initialPreview ?? "");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file, initialPreview]);

  const handleChange = (selected: File | undefined) => {
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (selected.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be smaller than ${maxSizeMB} MB.`);
      return;
    }

    setError("");
    setFile(selected);
    onImageSelected(selected);
  };

  const removeImage = () => {
    setFile(null);
    setPreview("");
    setError("");
    onImageSelected(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        disabled={disabled}
        onChange={(event) => handleChange(event.target.files?.[0])}
        className="hidden"
      />

      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Selected preview"
            className="h-36 w-36 rounded-xl border border-slate-200 object-cover dark:border-slate-700"
          />

          {!disabled && (
            <button
              type="button"
              onClick={removeImage}
              aria-label="Remove image"
              className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1.5 text-white shadow hover:bg-rose-600"
            >
              <X size={14} />
            </button>
          )}

          <button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="mt-2 block text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50 dark:text-indigo-400"
          >
            Change image
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:border-indigo-400 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400"
        >
          <ImagePlus size={25} />
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs">Up to {maxSizeMB} MB</span>
        </button>
      )}

      {error && (
        <p className="mt-2 text-sm text-rose-500">{error}</p>
      )}
    </div>
  );
}
