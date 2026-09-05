"use client";

import { useState, ChangeEvent, JSX } from "react";

export interface FileUploadProps {
  value?: File | null; // optional controlled file
  onChange?: (file: File | null, error: string | null) => void;
  allowedTypes?: string[]; // e.g., ["application/pdf", "image/png"]
  maxSize?: number; // bytes, default 5MB
  multiple?: boolean;
  render?: (props: {
    file: File | null;
    error: string | null;
    onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
  }) => JSX.Element; // custom UI render
}

export default function FileUpload({
  value,
  onChange,
  allowedTypes,
  maxSize = 5 * 1024 * 1024,
  multiple = false,
  render,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(value || null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (allowedTypes && !allowedTypes.includes(selectedFile.type)) {
      setFile(null);
      setError("Invalid file type");
      onChange?.(null, "Invalid file type");
      return;
    }

    if (selectedFile.size > maxSize) {
      setFile(null);
      const msg = `File must be less than ${(maxSize / (1024 * 1024)).toFixed(
        1
      )} MB`;
      setError(msg);
      onChange?.(null, msg);
      return;
    }

    setFile(selectedFile);
    setError(null);
    onChange?.(selectedFile, null);
  };

  const handleRemove = () => {
    setFile(null);
    setError(null);
    onChange?.(null, null);
  };

  // Render custom UI if provided
  if (render) {
    return render({
      file,
      error,
      onFileSelect: handleFileChange,
      onRemove: handleRemove,
    });
  }

  // Default UI
  return (
    <div className="flex flex-col w-full">
      <label className="font-medium mb-1 text-sm text-gray-700">
        Upload File <span className="text-red-500">*</span>
      </label>

      {!file ? (
        <label
          htmlFor="file-upload"
          className="border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
        >
          <p className="text-gray-600 font-medium">Click to upload file</p>
          <p className="text-sm text-gray-400 mt-1">
            {allowedTypes
              ? allowedTypes.map((t) => t.split("/")[1]).join(", ")
              : "Any file"}{" "}
            up to {(maxSize / (1024 * 1024)).toFixed(1)}MB
          </p>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={allowedTypes?.map((t) => `.${t.split("/")[1]}`).join(",")}
            multiple={multiple}
          />
        </label>
      ) : (
        <div className="border border-gray-300 rounded-xl p-4 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-gray-800">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-2 rounded-lg hover:bg-red-100 transition"
            aria-label="Remove file"
          >
            ✕
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
