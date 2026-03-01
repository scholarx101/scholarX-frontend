// src/pages/TeacherDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyTeacherCourses, getStudentProgressForCourse } from "../api/teachers";
import ProgressBar from "../components/ProgressBar";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourseProgress, setSelectedCourseProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressLoading, setProgressLoading] = useState(false);
  const [error, setError] = useState("");
  const [progressError, setProgressError] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      loadCourseProgress(selectedCourseId);
    }
  }, [selectedCourseId]);

  async function loadCourses() {
    try {
      setLoading(true);
      setError("");
      const data = await getMyTeacherCourses();
      setCourses(Array.isArray(data) ? data : []);
      // Auto-select first course if available
      if (Array.isArray(data) && data.length > 0) {
        setSelectedCourseId(data[0]._id);
      }
    } catch (err) {
      setError(err.message || "Failed to load courses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadCourseProgress(courseId) {
    try {
      setProgressLoading(true);
      setProgressError("");
      const data = await getStudentProgressForCourse(courseId);
      setSelectedCourseProgress(data);
    } catch (err) {
      setProgressError(err.message || "Failed to load student progress");
      console.error(err);
    } finally {
      setProgressLoading(false);
    }
  }

  const selectedCourse = courses.find((c) => c._id === selectedCourseId);
  const isMultiTeacher = selectedCourse?.teachers?.length > 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading your courses...</div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Courses</h1>
          <p className="text-slate-600 mb-6">Monitor your students' progress</p>
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <p className="text-slate-600">You haven't been assigned to any courses yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Courses</h1>
        <p className="text-slate-600 mb-6">Monitor your students' progress</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Course List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-semibold text-slate-900">Assigned Courses</h3>
              </div>
              <div className="divide-y divide-slate-200">
                {courses.map((course) => (
                  <button
                    key={course._id}
                    onClick={() => setSelectedCourseId(course._id)}
                    className={`w-full text-left p-4 transition ${
                      selectedCourseId === course._id
                        ? "bg-emerald-50 border-l-4 border-emerald-600"
                        : "hover:bg-slate-50 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="font-medium text-slate-900">{course.title}</div>
                    <div className="text-xs text-slate-600 mt-1">
                      {course.students?.length || 0} students
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Student Progress */}
          <div className="lg:col-span-3">
            {selectedCourse && (
              <div className="space-y-6">
                {/* Course Header */}
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {selectedCourse.title}
                  </h2>
                  <p className="text-slate-600 mb-4">{selectedCourse.description}</p>

                  {isMultiTeacher && selectedCourseProgress?.teacherModules && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                      <strong>Your Modules:</strong> {selectedCourseProgress.teacherModules.join(", ")}
                    </div>
                  )}
                </div>

                {/* Progress Error */}
                {progressError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
                    {progressError}
                  </div>
                )}

                {/* Student Progress List */}
                {progressLoading ? (
                  <div className="bg-white rounded-lg border border-slate-200 p-6 text-center text-slate-600">
                    Loading student progress...
                  </div>
                ) : selectedCourseProgress?.students && selectedCourseProgress.students.length > 0 ? (
                  <div className="space-y-4">
                    {selectedCourseProgress.students.map((item) => (
                      <div key={item.enrollmentId} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition">
                        {/* Student Info */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-slate-900">
                              {item.student.name}
                            </h4>
                            <p className="text-sm text-slate-600">{item.student.email}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              Enrolled: {new Date(item.purchasedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Progress View - Single Teacher */}
                        {!isMultiTeacher && (
                          <div className="space-y-3">
                            <div className="text-sm font-medium text-slate-900">
                              Overall Progress
                            </div>
                            <div className="text-sm text-slate-600 mb-2">
                              {item.completedLessons} / {item.totalLessons} lessons
                            </div>
                            <ProgressBar
                              completed={item.completedLessons}
                              total={item.totalLessons}
                              showPercentage={false}
                              height="h-2"
                            />
                            <div className="text-right text-sm font-medium text-slate-900 mt-2">
                              {item.progress}% Complete
                            </div>
                          </div>
                        )}

                        {/* Progress View - Multi Teacher (Module-based) */}
                        {isMultiTeacher && item.moduleProgress && (
                          <div className="space-y-4">
                            {item.moduleProgress.map((mod) => (
                              <div key={mod.moduleNumber} className="border-t border-slate-200 pt-4 first:border-t-0 first:pt-0">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <div className="font-medium text-slate-900">
                                      {mod.moduleTitle}
                                    </div>
                                    <div className="text-sm text-slate-600">
                                      {mod.completedLessons} / {mod.totalLessons} lessons
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-medium text-slate-900">
                                      {mod.progress}%
                                    </div>
                                  </div>
                                </div>
                                <ProgressBar
                                  completed={mod.completedLessons}
                                  total={mod.totalLessons}
                                  showPercentage={false}
                                  height="h-2"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-slate-200 p-6 text-center text-slate-600">
                    No students enrolled in this course yet.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
