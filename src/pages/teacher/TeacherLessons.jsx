// src/pages/teacher/TeacherLessons.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseLessons } from "../../api/teachers";

export default function TeacherLessons() {
  const { courseId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLessons();
  }, [courseId]);

  async function loadLessons() {
    try {
      setLoading(true);
      const result = await getCourseLessons(courseId);
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to load lessons");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-indigo-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Error Loading Lessons</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <Link to="/teacher/dashboard" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { course, lessons = [] } = data || {};

  return (
    <div className="min-h-screen bg-indigo-50 dark:bg-slate-950">
      {/* Dark gradient header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white -mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <Link to="/teacher/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">
            {course?.title || "Course Lessons"}
          </h1>
          <p className="text-slate-300 text-sm">Manage your course content and lessons</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Lessons", value: lessons.length, color: "text-slate-900 dark:text-white" },
            { label: "Published", value: lessons.filter((l) => l.published).length, color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Drafts", value: lessons.filter((l) => !l.published).length, color: "text-amber-600 dark:text-amber-400" },
            { label: "Total Minutes", value: lessons.reduce((sum, l) => sum + (l.duration || 0), 0), color: "text-indigo-600 dark:text-indigo-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 text-center">
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Lessons list */}
        {lessons.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No Lessons Yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Start building your course by adding lessons</p>
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-lg shadow-indigo-500/25">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add First Lesson
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/20">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">
                        {lesson.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${
                        lesson.published
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                      }`}>
                        {lesson.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    {lesson.description && (
                      <p className="text-slate-500 dark:text-slate-400 text-sm mb-2 line-clamp-1">{lesson.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                      {lesson.duration && (
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {lesson.duration} min
                        </span>
                      )}
                      {lesson.type && (
                        <span className="inline-flex items-center gap-1 capitalize">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                          {lesson.type}
                        </span>
                      )}
                      {lesson.videoUrl && (
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          Video
                        </span>
                      )}
                      {lesson.resources && lesson.resources.length > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                          {lesson.resources.length} resources
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 transition" title="Edit">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition" title="Stats">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </button>
                    <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 transition" title="Delete">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
