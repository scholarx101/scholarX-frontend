import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCourseById } from "../api/courses";
import { resolveAssetUrl, formatMoney } from "../utils/coursePricingUtils";
import { initCoursePayment } from "../api/payments";

function CourseDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    // payment
    const [selectedPlan, setSelectedPlan] = useState("combo");
    const [unitsCount, setUnitsCount] = useState(1);
    const [initiating, setInitiating] = useState(false);
    const [payError, setPayError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadCourse() {
            try {
                if (!isMounted) return;
                setLoading(true);
                const courseData = await getCourseById(id);
                if (isMounted && courseData) {
                    setCourse(courseData);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error loading course:", err);
                    setError(err?.message || "Failed to load course");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        if (id) {
            loadCourse();
        }

        return () => {
            isMounted = false;
        };
    }, [id]);

    // default to first available plan once course loads
    useEffect(() => {
        if (!course) return;
        if (course.comboFee != null) setSelectedPlan("combo");
        else if (course.monthlyFee != null) setSelectedPlan("monthly");
        else if (course.semesterFee != null) setSelectedPlan("semester");
    }, [course]);

    async function handleEnroll() {
        if (!user) { navigate("/login"); return; }
        try {
            setInitiating(true);
            setPayError("");
            const payload = { courseId: id, paymentPlan: selectedPlan };
            if (selectedPlan === "monthly" || selectedPlan === "semester") {
                payload.unitsCount = unitsCount;
            }
            const result = await initCoursePayment(payload);
            // hand off to SSLCommerz
            window.location.href = result.gatewayUrl;
        } catch (err) {
            setPayError(err.message || "Failed to initiate payment. Please try again.");
            setInitiating(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-indigo-50 dark:bg-slate-950">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent"></div>
                    <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading course details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-indigo-50 dark:bg-slate-950 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    </div>
                    <h1 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Error</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{error}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-indigo-50 dark:bg-slate-950 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                    </div>
                    <h1 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Course Not Found</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">The course you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-indigo-50 dark:bg-slate-950">
            {/* Hero */}
            <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden -mt-16">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
                    <button
                        onClick={() => navigate("/")}
                        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition mb-8"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Back to Courses
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
                        {/* Thumbnail */}
                        <div className="md:col-span-2">
                            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/30 aspect-video bg-slate-800">
                                {course.thumbnail || course.thumbnailUrl ? (
                                    <img
                                        src={resolveAssetUrl(course.thumbnail || course.thumbnailUrl)}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-600/20 to-violet-600/20 flex items-center justify-center">
                                        <svg className="w-16 h-16 text-indigo-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="md:col-span-3 space-y-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                course.type === "live"
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                            }`}>
                                {course.type === "live" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                                {course.type === "live" ? "Live Batches" : "Pre-Recorded"}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                {course.title}
                            </h1>
                            {course.description && (
                                <p className="text-slate-400 text-base leading-relaxed line-clamp-3">
                                    {course.description}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-6 pt-2">
                                {course.instructor && (
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Instructor</p>
                                        <p className="text-sm font-semibold text-white">{course.instructor.name}</p>
                                    </div>
                                )}
                                {course.lessons && (
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Lessons</p>
                                        <p className="text-sm font-semibold text-white">{course.lessons.length}</p>
                                    </div>
                                )}
                                {course.level && (
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Level</p>
                                        <p className="text-sm font-semibold text-white capitalize">{course.level}</p>
                                    </div>
                                )}
                            </div>

                            {/* Payment plan selector */}
                            <div className="pt-3 space-y-3">
                                {payError && (
                                    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                        {payError}
                                    </p>
                                )}

                                {/* Plan options */}
                                <div className="space-y-2">
                                    {course.comboFee != null && (
                                        <button
                                            type="button"
                                            onClick={() => setSelectedPlan("combo")}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition ${
                                                selectedPlan === "combo"
                                                    ? "border-indigo-400/60 bg-indigo-600/20 ring-1 ring-indigo-500/40"
                                                    : "border-slate-700 hover:border-slate-600"
                                            }`}
                                        >
                                            <div>
                                                <p className="text-sm font-semibold text-white">Full Access</p>
                                                <p className="text-xs text-slate-400 mt-0.5">One-time · All content unlocked</p>
                                            </div>
                                            <span className="text-sm font-bold text-indigo-300 ml-4 whitespace-nowrap">
                                                {formatMoney(course.comboFee, course.currency || "BDT")}
                                            </span>
                                        </button>
                                    )}

                                    {course.monthlyFee != null && (
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedPlan("monthly")}
                                                className={`w-full flex items-center justify-between px-4 py-3 border text-left transition ${
                                                    selectedPlan === "monthly"
                                                        ? "rounded-t-xl border-indigo-400/60 border-b-0 bg-indigo-600/20 ring-1 ring-indigo-500/40 ring-b-0"
                                                        : "rounded-xl border-slate-700 hover:border-slate-600"
                                                }`}
                                            >
                                                <div>
                                                    <p className="text-sm font-semibold text-white">Monthly</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">Pay per month · unlock content as you go</p>
                                                </div>
                                                <span className="text-sm font-bold text-indigo-300 ml-4 whitespace-nowrap">
                                                    {formatMoney(course.monthlyFee, course.currency || "BDT")}/mo
                                                </span>
                                            </button>
                                            {selectedPlan === "monthly" && (
                                                <div className="flex items-center gap-2 px-4 py-3 border border-t-0 border-indigo-400/60 rounded-b-xl bg-indigo-600/10">
                                                    <span className="text-xs text-slate-400 mr-1">Months:</span>
                                                    {[1, 2, 3, 4].map((n) => (
                                                        <button
                                                            key={n}
                                                            type="button"
                                                            onClick={() => setUnitsCount(n)}
                                                            className={`w-8 h-8 rounded-lg text-sm font-semibold transition ${
                                                                unitsCount === n
                                                                    ? "bg-indigo-600 text-white"
                                                                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                                            }`}
                                                        >
                                                            {n}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {course.semesterFee != null && (
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedPlan("semester")}
                                                className={`w-full flex items-center justify-between px-4 py-3 border text-left transition ${
                                                    selectedPlan === "semester"
                                                        ? "rounded-t-xl border-indigo-400/60 border-b-0 bg-indigo-600/20 ring-1 ring-indigo-500/40"
                                                        : "rounded-xl border-slate-700 hover:border-slate-600"
                                                }`}
                                            >
                                                <div>
                                                    <p className="text-sm font-semibold text-white">Semester</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">Pay per semester · best value over 6 months</p>
                                                </div>
                                                <span className="text-sm font-bold text-indigo-300 ml-4 whitespace-nowrap">
                                                    {formatMoney(course.semesterFee, course.currency || "BDT")}/sem
                                                </span>
                                            </button>
                                            {selectedPlan === "semester" && (
                                                <div className="flex items-center gap-2 px-4 py-3 border border-t-0 border-indigo-400/60 rounded-b-xl bg-indigo-600/10">
                                                    <span className="text-xs text-slate-400 mr-1">Semesters:</span>
                                                    {[1, 2].map((n) => (
                                                        <button
                                                            key={n}
                                                            type="button"
                                                            onClick={() => setUnitsCount(n)}
                                                            className={`w-8 h-8 rounded-lg text-sm font-semibold transition ${
                                                                unitsCount === n
                                                                    ? "bg-indigo-600 text-white"
                                                                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                                            }`}
                                                        >
                                                            {n}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Admission fee notice */}
                                {course.admissionFee > 0 && (
                                    <p className="text-xs text-slate-500">
                                        * Admission fee of {formatMoney(course.admissionFee, course.currency || "BDT")} is included in your first payment.
                                    </p>
                                )}

                                {/* Proceed button */}
                                <button
                                    onClick={handleEnroll}
                                    disabled={initiating}
                                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white rounded-xl
                                               bg-gradient-to-r from-indigo-600 to-violet-600
                                               hover:from-indigo-500 hover:to-violet-500
                                               shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
                                               transition-all duration-200 disabled:opacity-60"
                                >
                                    {initiating ? (
                                        <>
                                            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Redirecting to payment…
                                        </>
                                    ) : !user ? (
                                        "Login to Enroll"
                                    ) : (
                                        <>
                                            Proceed to Payment
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
                {/* Lessons */}
                {course.lessons && course.lessons.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Course Content</h2>
                        <div className="space-y-2.5">
                            {course.lessons.map((lesson, index) => (
                                <div
                                    key={lesson._id || index}
                                    className="group bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                                >
                                    <div className="flex items-start gap-3.5">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-semibold text-sm">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{lesson.title}</h3>
                                            {lesson.description && (
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{lesson.description}</p>
                                            )}
                                        </div>
                                        {lesson.durationMinutes && (
                                            <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">{lesson.durationMinutes} min</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* CTA */}
                <section className="rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 p-8 md:p-12 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to start learning?</h2>
                    <p className="text-indigo-200 mb-6 max-w-2xl mx-auto text-sm">
                        Enroll in this course today and unlock all the content and lessons.
                    </p>
                    <button
                        onClick={handleEnroll}
                        disabled={initiating}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg shadow-black/10 disabled:opacity-60"
                    >
                        {initiating ? (
                            <>
                                <span className="inline-block w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                                Redirecting…
                            </>
                        ) : (
                            <>
                                Enroll Now
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </>
                        )}
                    </button>
                </section>
            </div>
        </div>
    );
}

export default CourseDetailPage;
