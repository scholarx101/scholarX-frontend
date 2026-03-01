// src/components/LabSkeleton.jsx
export const LabSkeleton = () => (
  <div className="rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/40 shadow-sm overflow-hidden animate-pulse">
    <div className="aspect-video bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20" />
    <div className="px-4 py-3 space-y-2">
      <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700/60 rounded" />
      <div className="h-3.5 w-1/3 bg-slate-200 dark:bg-slate-700/60 rounded" />
    </div>
  </div>
);
