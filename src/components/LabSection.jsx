// src/components/LabSection.jsx
import { LabSkeleton } from "./LabSkeleton";
import { LabCard } from "./LabCard";

export function LabSection({
  title = "Virtual Labs",
  description = "Join a research lab and learn collaboratively under expert guidance.",
  labs,
  loading,
  emptyMessage = "No virtual labs are available right now.",
  onViewDetails,
  actionLabel,
}) {
  return (
    <section className="relative">
      <div className="relative w-full px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-violet-600 dark:text-violet-400 mb-2">
            AI Research
          </span>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            {title}
          </h3>
          <p className="text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            {description}
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <LabSkeleton key={i} />
            ))}
          </div>
        ) : labs.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 mb-4">
              <svg className="w-7 h-7 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <p className="text-base text-slate-500 dark:text-slate-400">{emptyMessage}</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
            {labs.map((lab) => (
              <LabCard
                key={lab._id}
                lab={lab}
                onViewDetails={onViewDetails}
                actionLabel={actionLabel}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
