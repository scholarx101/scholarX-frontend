// src/pages/teacher/TeacherDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTeacherCourses } from "../../api/teachers";
import { getLabs } from "../../api/labs";
import { useAuth } from "../../context/AuthContext";

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [myLabCount, setMyLabCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadCourses();
    loadLabCount();
  }, []);

  async function loadCourses() {
    try {
      setLoading(true);
      const data = await getTeacherCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }

  async function loadLabCount() {
    try {
      const allLabs = await getLabs();
      const labList = Array.isArray(allLabs) ? allLabs : [];
      const myLabs = labList.filter((lab) => {
        const headId = lab.labHead?._id || lab.labHead?.userId?._id || lab.labHead?.userId || lab.labHead;
        const isHead = headId === user?._id || headId === user?.teacherId;
        const isMod = Array.isArray(lab.moderators) && lab.moderators.some((m) => {
          const modId = m._id || m.userId?._id || m.userId || m;
          return modId === user?._id || modId === user?.teacherId;
        });
        return isHead || isMod;
      });
      setMyLabCount(myLabs.length);
    } catch {
      // Labs not available
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent"></div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl font-bold text-white mb-1">Teacher Dashboard</h1>
          <p className="text-slate-400 text-sm">Manage your courses and track student progress</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Virtual Labs Card */}
        {myLabCount > 0 && (
          <div className="mb-8">
            <button
              onClick={() => navigate("/teacher/labs")}
              className="w-full md:w-auto bg-white dark:bg-slate-900/80 border border-violet-200/60 dark:border-violet-800/40
                         hover:border-violet-300 dark:hover:border-violet-700 rounded-xl p-5 text-left transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">My Virtual Labs</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {myLabCount} lab{myLabCount !== 1 ? "s" : ""} assigned — view subscribers
                  </p>
                </div>
                <svg className="w-5 h-5 text-slate-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {courses.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-1 text-sm">No courses assigned yet</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Contact the admin to get assigned to courses</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 hover:shadow-md transition-all"
              >
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-2 text-xs mb-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg font-medium ${
                    course.type === 'live'
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40'
                      : 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/40'
                  }`}>
                    {course.type || 'recorded'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/40">
                    {course.lessons?.length || 0} lessons
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/40">
                    {course.enrollmentCount || 0} students
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/teacher/courses/${course._id}/progress`)}
                    className="flex-1 py-2 text-xs font-semibold text-white rounded-lg
                               bg-gradient-to-r from-indigo-600 to-violet-600
                               hover:from-indigo-500 hover:to-violet-500 transition-all"
                  >
                    Student Progress
                  </button>
                  <button
                    onClick={() => navigate(`/teacher/courses/${course._id}/lessons`)}
                    className="flex-1 py-2 text-xs font-semibold rounded-lg
                               bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300
                               border border-slate-200/60 dark:border-slate-700/40
                               hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    View Lessons
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
