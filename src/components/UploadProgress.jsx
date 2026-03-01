// src/components/UploadProgress.jsx
export default function UploadProgress({ progress, fileName }) {
  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-slate-200 p-4 w-80 z-50">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-2xl">📤</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-900 truncate">{fileName}</div>
          <div className="mt-2">
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-slate-600 mt-1">{progress}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
