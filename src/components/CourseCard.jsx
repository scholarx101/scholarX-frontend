import { resolveAssetUrl, formatMoney, getCoursePricing } from "../utils/coursePricingUtils";

const PriceDisplay = ({ course }) => {
    const p = getCoursePricing(course);

    if (p.comboFee != null && p.regularTotal != null && p.comboFee < p.regularTotal) {
        return (
            <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {formatMoney(p.comboFee, p.currency)}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                    {formatMoney(p.regularTotal, p.currency)}
                </span>
            </div>
        );
    }

    if (p.effective && p.effective.plan && p.effective.amount != null) {
        return (
            <span className="text-sm font-bold text-slate-900 dark:text-white">
                {formatMoney(p.effective.amount, p.effective.currency || p.currency)}
            </span>
        );
    }

    if (p.comboFee != null) {
        return (
            <span className="text-sm font-bold text-slate-900 dark:text-white">
                {formatMoney(p.comboFee, p.currency)}
            </span>
        );
    }

    return (
        <span className="text-sm font-bold text-slate-900 dark:text-white">
            {course.price > 0 ? `${course.price} BDT` : "Free"}
        </span>
    );
};

export function CourseCard({ course, variant = "live", onViewDetails }) {
    return (
        <article
            onClick={() => onViewDetails(course._id)}
            className="group cursor-pointer overflow-hidden rounded-xl bg-white dark:bg-slate-800/80 
                        border border-slate-200/60 dark:border-slate-700/40 
                        shadow-sm hover:shadow-lg hover:-translate-y-0.5
                        transition-all duration-300 flex flex-col min-w-[240px]"
        >
            {/* Thumbnail */}
            <div className="relative w-full aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {course.thumbnailUrl ? (
                    <img
                        src={resolveAssetUrl(course.thumbnailUrl)}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 flex items-center justify-center">
                        <svg className="w-10 h-10 text-indigo-300 dark:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Content — minimal: title + price */}
            <div className="px-4 py-3 flex flex-col gap-1">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug">
                    {course.title}
                </h4>
                <PriceDisplay course={course} />
            </div>
        </article>
    );
}
