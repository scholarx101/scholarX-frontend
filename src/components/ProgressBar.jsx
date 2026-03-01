// src/components/ProgressBar.jsx
export default function ProgressBar({ completed, total, showPercentage = true, height = "h-2" }) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ${height}`}>
        <div
          className="bg-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {showPercentage && (
        <div className="mt-1 text-sm text-slate-600">
          {completed} / {total} ({percentage}%)
        </div>
      )}
    </div>
  );
}
