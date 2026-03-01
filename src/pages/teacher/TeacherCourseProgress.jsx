// src/pages/teacher/TeacherCourseProgress.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseProgress } from "../../api/teachers";

export default function TeacherCourseProgress() {
  const { courseId } = useParams();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProgress();
  }, [courseId]);

  async function loadProgress() {
    try {
      setLoading(true);
      const data = await getCourseProgress(courseId);
      setProgress(data);
    } catch (err) {
      setError(err.message || "Failed to load progress");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Error Loading Progress</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <Link to="/teacher/dashboard" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { course, students = [] } = progress || {};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Dark gradient header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Link to="/teacher/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">
            {course?.title || "Course Progress"}
          </h1>
          <p className="text-slate-300 text-sm">Track student enrollment and progress</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{students.length}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Students</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {students.filter((s) => s.completedLessons === s.totalLessons && s.totalLessons > 0).length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {students.filter((s) => s.completedLessons > 0 && s.completedLessons < s.totalLessons).length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">In Progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Student table */}
        {students.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No Students Yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Students will appear here once they enroll in your course</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800">
                  <tr>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Enrolled</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Progress</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {students.map((student) => {
                    const progressPercent = student.totalLessons > 0
                      ? Math.round((student.completedLessons / student.totalLessons) * 100)
                      : 0;
                    return (
                      <tr key={student.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{student.studentName}</td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{student.studentEmail}</td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(student.enrolledAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 max-w-[100px]">
                              <div className={`h-1.5 rounded-full transition-all ${progressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`} style={{ width: `${progressPercent}%` }} />
                            </div>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 tabular-nums">{progressPercent}%</span>
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{student.completedLessons}/{student.totalLessons} lessons</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                          {student.lastActivity ? new Date(student.lastActivity).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
