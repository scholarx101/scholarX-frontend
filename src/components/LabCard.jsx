// src/components/LabCard.jsx
import { resolveAssetUrl, formatMoney } from "../utils/coursePricingUtils";

export function LabCard({ lab, onViewDetails }) {
  return (
    <article
      onClick={() => onViewDetails(lab._id)}
      className="group cursor-pointer overflow-hidden rounded-xl bg-white dark:bg-slate-800/80 
                 border border-slate-200/60 dark:border-slate-700/40
                 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-violet-50 dark:bg-violet-900/30">
        {(() => {
            const src = resolveAssetUrl(lab.thumbnail || lab.thumbnailUrl);
            if (src) {
              return (
                <img
                  src={src}
                  alt={lab.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              );
            }
            return (
              <div className="w-full h-full bg-gradient-to-br from-violet-100 via-indigo-50 to-purple-100 dark:from-violet-900/30 dark:via-indigo-900/20 dark:to-purple-900/30 flex items-center justify-center">
                <svg className="w-10 h-10 text-violet-300 dark:text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
            );
        })()}
      </div>

      {/* Content — minimal: name + price */}
      <div className="px-4 py-3 flex flex-col gap-1">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug">
          {lab.name}
        </h4>
        <span className="text-sm font-bold text-slate-900 dark:text-white">
          {lab.monthlyFee > 0
            ? formatMoney(lab.monthlyFee, lab.currency || "BDT") + "/mo"
            : "Free"}
        </span>
      </div>
    </article>
  );
}
