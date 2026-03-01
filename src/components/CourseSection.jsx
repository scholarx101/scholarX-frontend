import { CourseSkeleton } from "./CourseSkeleton";
import { CourseCard } from "./CourseCard";

export function CourseSection({
    title,
    description,
    courses,
    loading,
    emptyMessage,
    variant = "live",
    onViewDetails,
}) {
    return (
        <section className="relative">
            <div className="relative w-full px-4 sm:px-6 py-12">
                <div className="text-center mb-8">
                    <span className="inline-block text-xs font-semibold tracking-widest uppercase text-indigo-600 dark:text-indigo-400 mb-2">
                        {variant === "live" ? "Live Classes" : "Self-Paced"}
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                        {title}
                    </h3>
                    <p className="text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                        {description}
                    </p>
                </div>

                {loading ? (
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4">
                        {[...Array(10)].map((_, i) => (
                            <CourseSkeleton key={i} />
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
                            <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                        </div>
                        <p className="text-base text-slate-500 dark:text-slate-400">{emptyMessage}</p>
                    </div>
                ) : (
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4">
                        {courses.map((course) => (
                            <CourseCard
                                key={course._id}
                                course={course}
                                variant={variant}
                                onViewDetails={onViewDetails}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
