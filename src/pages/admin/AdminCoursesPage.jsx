// src/pages/admin/AdminCoursesPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses, deleteCourse } from "../../api/courses";

export default function AdminCoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      setLoading(true);
      setError("");
      const data = await getCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading courses:", err);
      // Check if it's a 401 (backend endpoint not implemented)
      if (err.status === 401) {
        setError("Backend endpoint not implemented. The /api/courses endpoint needs to be added to the backend server.");
      } else {
        setError(err.message || "Failed to load courses");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(courseId, courseTitle) {
    if (!window.confirm(`Are you sure you want to delete "${courseTitle}"? This will delete all lessons and files.`)) {
      return;
    }

    try {
      await deleteCourse(courseId);
      await loadCourses();
    } catch (err) {
      alert(err.message || "Failed to delete course");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Course Management</h1>
          <button
            onClick={() => navigate("/admin/courses/new")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition"
          >
            + Create Course
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
            <div className="text-red-700 mb-2">{error}</div>
            {error.includes("Backend endpoint not implemented") && (
              <div className="bg-red-25 border border-red-300 rounded p-3 text-sm">
                <p className="font-medium text-red-800 mb-2">Required Backend Implementation:</p>
                <ul className="text-red-700 space-y-1">
                  <li>• GET /api/courses (get all courses - admin only)</li>
                  <li>• POST /api/courses (create course - admin only)</li>
                  <li>• PATCH /api/courses/:id (update course - admin only)</li>
                  <li>• DELETE /api/courses/:id (delete course - admin only)</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {courses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <p className="text-slate-600 mb-4">No courses created yet</p>
            <button
              onClick={() => navigate("/admin/courses/new")}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition"
            >
              Create First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition">
                {course.thumbnailUrl && (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      course.isPublished ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"
                    }`}>
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{course.description}</p>

                  <div className="text-xs text-slate-500 space-y-1 mb-4">
                    <p>Level: {course.level}</p>
                    <p>Type: {course.type}</p>
                    <p>Lessons: {course.lessons?.length || 0}</p>
                    {course.teachers && course.teachers.length > 0 && (
                      <p>Teachers: {course.teachers.length}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/courses/${course._id}/lessons`)}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded font-medium"
                    >
                      Lessons
                    </button>
                    <button
                      onClick={() => navigate(`/admin/courses/${course._id}/edit`)}
                      className="flex-1 px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id, course.title)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded font-medium"
                    >
                      Delete
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
