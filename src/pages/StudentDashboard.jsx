// src/pages/StudentDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyEnrollments, markLessonComplete } from "../api/enrollments";
import { getMyLabSubscriptions } from "../api/labSubscriptions";
import ProgressBar from "../components/ProgressBar";
import { formatMoney } from "../utils/coursePricingUtils";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [labSubs, setLabSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [completingLessonId, setCompletingLessonId] = useState(null);

  useEffect(() => {
    loadEnrollments();
    loadLabSubs();
  }, []);

  async function loadEnrollments() {
    try {
      setLoading(true);
      setError("");
      const data = await getMyEnrollments();
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load enrollments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadLabSubs() {
    try {
      const data = await getMyLabSubscriptions();
      setLabSubs(Array.isArray(data) ? data : []);
    } catch {
      // Lab subscriptions not available
    }
  }

  async function handleCompleteLesson(courseId, lessonId) {
    try {
      setCompletingLessonId(lessonId);
      await markLessonComplete(courseId, lessonId);
      // Reload enrollments to get updated progress
      await loadEnrollments();
    } catch (err) {
      setError(err.message || "Failed to mark lesson complete");
    } finally {
      setCompletingLessonId(null);
    }
  }

  function isLessonAccessible(lesson, paymentPlan, monthsPaid, semestersPaid) {
    // Determine if lesson is accessible based on payment plan
    if (paymentPlan === "combo") return true;
    if (paymentPlan === "monthly" && lesson.monthNumber && lesson.monthNumber <= monthsPaid) return true;
    if (paymentPlan === "semester" && lesson.semesterNumber && lesson.semesterNumber <= semestersPaid) return true;
    return false;
  }

  function calculateProgress(enrollment) {
    const totalLessons = enrollment.course.lessons?.length || 0;
    const completed = enrollment.completedLessons?.length || 0;
    return totalLessons === 0 ? 0 : Math.round((completed / totalLessons) * 100);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent"></div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading your enrollments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl font-bold text-white mb-1">My Courses</h1>
          <p className="text-slate-400 text-sm">Track your learning progress</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Virtual Labs Quick Access */}
        {labSubs.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3" />
                </svg>
                My Virtual Labs
              </h2>
              <button
                onClick={() => navigate("/student/labs")}
                className="text-sm text-violet-600 dark:text-violet-400 hover:underline font-medium"
              >
                View All →
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {labSubs.slice(0, 3).map((sub) => {
                const lab = sub.lab || {};
                return (
                  <div
                    key={sub._id}
                    onClick={() => navigate(`/labs/${lab._id}`)}
                    className="bg-white dark:bg-slate-900/80 rounded-xl border border-violet-200/60 dark:border-violet-800/40 p-4 cursor-pointer
                               hover:shadow-md hover:border-violet-300 dark:hover:border-violet-700 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-slate-900 dark:text-white truncate text-sm">{lab.name || "Lab"}</h4>
                        <span className={`text-xs font-medium ${
                          sub.status === "active"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : sub.status === "pending"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-red-600 dark:text-red-400"
                        }`}>
                          {sub.status === "active" ? "Active" : sub.status === "pending" ? "Pending" : "Cancelled"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {enrollments.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">You haven't enrolled in any courses yet.</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all"
            >
              Explore Courses
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enrollment) => {
              const course = enrollment.course;
              const progress = calculateProgress(enrollment);
              const isExpanded = expandedCourse === enrollment._id;

              return (
                <div key={enrollment._id} className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:shadow-md transition-all">
                  {/* Course Header */}
                  <div
                    className="p-5 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition"
                    onClick={() => setExpandedCourse(isExpanded ? null : enrollment._id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 truncate">
                          {course.title}
                        </h3>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                            <span>{enrollment.completedLessons?.length || 0} / {course.lessons?.length || 0} lessons</span>
                            <span className="font-medium">{progress}%</span>
                          </div>
                          <ProgressBar
                            completed={enrollment.completedLessons?.length || 0}
                            total={course.lessons?.length || 0}
                            showPercentage={false}
                            height="h-1.5"
                          />
                        </div>

                        {/* Payment Plan Info */}
                        <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                            Plan: {enrollment.paymentPlan?.toUpperCase() || "N/A"}
                          </span>
                          {enrollment.paymentPlan === "monthly" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                              {enrollment.monthsPaid} months paid
                            </span>
                          )}
                          {enrollment.paymentPlan === "semester" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                              {enrollment.semestersPaid} semesters paid
                            </span>
                          )}
                          {!enrollment.isFullyPaid && (
                            <span className="text-amber-600 dark:text-amber-400 font-medium">
                              Upgrade to unlock more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expand Icon */}
                      <div className="text-slate-400 dark:text-slate-500 flex-shrink-0 mt-1">
                        <svg className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Lessons List */}
                  {isExpanded && (
                    <div className="border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                      <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
                        {course.lessons && course.lessons.length > 0 ? (
                          course.lessons.map((lesson) => {
                            const isCompleted = enrollment.completedLessons?.includes(lesson._id);
                            const isAccessible = isLessonAccessible(
                              lesson,
                              enrollment.paymentPlan,
                              enrollment.monthsPaid,
                              enrollment.semestersPaid
                            );

                            return (
                              <div key={lesson._id} className="px-5 py-3.5 hover:bg-white/50 dark:hover:bg-slate-900/50 transition">
                                <div className="flex items-start gap-3">
                                  {/* Completion */}
                                  <div className="mt-0.5 flex-shrink-0">
                                    {isCompleted ? (
                                      <div className="w-5 h-5 bg-emerald-500 rounded-md flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                      </div>
                                    ) : (
                                      <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-md"></div>
                                    )}
                                  </div>

                                  {/* Lesson Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <div>
                                        <h4 className={`text-sm font-medium ${isCompleted ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-900 dark:text-white"}`}>
                                          {lesson.order}. {lesson.title}
                                        </h4>
                                        {lesson.description && (
                                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{lesson.description}</p>
                                        )}
                                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                          {lesson.moduleNumber && <span>Module {lesson.moduleNumber}</span>}
                                          {lesson.durationMinutes && <span>• {lesson.durationMinutes} min</span>}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Resources */}
                                    {isAccessible && (
                                      <div className="mt-2 flex flex-wrap gap-2">
                                        {lesson.videoUrl && (
                                          <a
                                            href={resolveAssetUrl(lesson.videoUrl)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                                                       bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 
                                                       border border-indigo-200/60 dark:border-indigo-800/40
                                                       hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition"
                                          >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                                            </svg>
                                            Watch Video
                                          </a>
                                        )}
                                        {lesson.pdfUrls && lesson.pdfUrls.length > 0 && lesson.pdfUrls.map((url, idx) => (
                                          <a
                                            key={idx}
                                            href={resolveAssetUrl(url)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                                                       bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 
                                                       border border-slate-200/60 dark:border-slate-700/40
                                                       hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                                          >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                            </svg>
                                            Notes{lesson.pdfUrls.length > 1 ? ` ${idx + 1}` : ""}
                                          </a>
                                        ))}
                                        {lesson.materialUrls && lesson.materialUrls.length > 0 && lesson.materialUrls.map((url, idx) => (
                                          <a
                                            key={idx}
                                            href={resolveAssetUrl(url)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                                                       bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 
                                                       border border-slate-200/60 dark:border-slate-700/40
                                                       hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                                          >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                                            </svg>
                                            Material{lesson.materialUrls.length > 1 ? ` ${idx + 1}` : ""}
                                          </a>
                                        ))}
                                      </div>
                                    )}

                                    {/* Locked */}
                                    {!isAccessible && (
                                      <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/30">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                        Upgrade to access
                                      </div>
                                    )}
                                  </div>

                                  {/* Mark Complete */}
                                  {isAccessible && !isCompleted && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleCompleteLesson(course._id, lesson._id); }}
                                      disabled={completingLessonId === lesson._id}
                                      className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold text-white rounded-lg
                                                 bg-gradient-to-r from-indigo-600 to-violet-600
                                                 hover:from-indigo-500 hover:to-violet-500
                                                 disabled:opacity-50 transition-all"
                                    >
                                      {completingLessonId === lesson._id ? "..." : "Done"}
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="px-5 py-4 text-slate-500 dark:text-slate-400 text-sm">No lessons available yet</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
