// src/components/FileUpload.jsx
import { useState, useRef } from "react";

export default function FileUpload({
  label,
  accept,
  multiple = false,
  maxSizeMB = 10,
  onFilesSelected,
  previewType = "none", // 'none', 'image', 'list'
}) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setError("");

    // Validate file sizes
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const oversizedFiles = selectedFiles.filter((file) => file.size > maxSizeBytes);

    if (oversizedFiles.length > 0) {
      setError(`Some files exceed ${maxSizeMB}MB limit`);
      return;
    }

    setFiles(selectedFiles);

    // Generate previews for images
    if (previewType === "image") {
      const imageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"));
      const previewPromises = imageFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(previewPromises).then(setPreviews);
    }

    if (onFilesSelected) {
      onFilesSelected(selectedFiles);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    // Trigger change handler
    const dt = new DataTransfer();
    droppedFiles.forEach((file) => dt.items.add(file));
    if (fileInputRef.current) {
      fileInputRef.current.files = dt.files;
      handleFileChange({ target: { files: dt.files } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    
    if (previewType === "image") {
      const newPreviews = previews.filter((_, i) => i !== index);
      setPreviews(newPreviews);
    }

    if (onFilesSelected) {
      onFilesSelected(newFiles);
    }
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-900 mb-2">{label}</label>}

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-emerald-500 transition cursor-pointer bg-slate-50"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="text-slate-600">
          <svg
            className="mx-auto h-12 w-12 text-slate-400 mb-2"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-sm">
            <span className="font-medium text-emerald-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500 mt-1">Max size: {maxSizeMB}MB</p>
        </div>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</div>
      )}

      {/* File List Preview */}
      {previewType === "list" && files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <div className="text-sm font-medium text-slate-900">{file.name}</div>
                  <div className="text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview */}
      {previewType === "image" && previews.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded border border-slate-200"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
