// src/pages/admin/AdminCourseLessonsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCourseById,
  addLesson,
  updateLesson,
  deleteLesson,
  uploadLessonVideo,
  uploadLessonPDFs,
  uploadLessonMaterials,
} from "../../api/courses";
import FileUpload from "../../components/FileUpload";

export default function AdminCourseLessonsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [uploadingLessonId, setUploadingLessonId] = useState(null);
  
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    order: 1,
    durationMinutes: 45,
    isPublished: false,
    moduleNumber: 1,
    moduleTitle: "",
    lessonDate: "",
  });

  useEffect(() => {
    loadCourse();
  }, [id]);

  async function loadCourse() {
    try {
      setLoading(true);
      setError("");
      const data = await getCourseById(id);
      setCourse(data);
    } catch (err) {
      console.error("Error loading course:", err);
      // Check if it's a 401 (backend endpoint not implemented)
      if (err.status === 401) {
        setError("Backend endpoint not implemented. The course and lesson management endpoints need to be added to the backend server.");
      } else {
        setError(err.message || "Failed to load course");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleLessonFormChange(e) {
    const { name, value, type, checked } = e.target;
    setLessonForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleLessonSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        ...lessonForm,
        order: parseInt(lessonForm.order),
        durationMinutes: parseInt(lessonForm.durationMinutes),
        moduleNumber: parseInt(lessonForm.moduleNumber),
        lessonDate: lessonForm.lessonDate ? new Date(lessonForm.lessonDate).toISOString() : undefined,
      };

      if (editingLesson) {
        await updateLesson(id, editingLesson._id, payload);
      } else {
        await addLesson(id, payload);
      }

      await loadCourse();
      setShowLessonForm(false);
      setEditingLesson(null);
      setLessonForm({
        title: "",
        description: "",
        order: (course?.lessons?.length || 0) + 1,
        durationMinutes: 45,
        isPublished: false,
        moduleNumber: 1,
        moduleTitle: "",
        lessonDate: "",
      });
    } catch (err) {
      setError(err.message || "Failed to save lesson");
    }
  }

  function openEditLesson(lesson) {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title || "",
      description: lesson.description || "",
      order: lesson.order || 1,
      durationMinutes: lesson.durationMinutes || 45,
      isPublished: lesson.isPublished || false,
      moduleNumber: lesson.moduleNumber || 1,
      moduleTitle: lesson.moduleTitle || "",
      lessonDate: lesson.lessonDate ? new Date(lesson.lessonDate).toISOString().slice(0, 10) : "",
    });
    setShowLessonForm(true);
  }

  async function handleDeleteLesson(lessonId) {
    if (!window.confirm("Delete this lesson? All files will be removed.")) return;

    try {
      await deleteLesson(id, lessonId);
      await loadCourse();
    } catch (err) {
      alert(err.message || "Failed to delete lesson");
    }
  }

  async function handleVideoUpload(lessonId, files) {
    if (!files || files.length === 0) return;

    try {
      setUploadingLessonId(lessonId);
      await uploadLessonVideo(id, lessonId, files[0]);
      await loadCourse();
    } catch (err) {
      alert(err.message || "Failed to upload video");
    } finally {
      setUploadingLessonId(null);
    }
  }

  async function handlePDFUpload(lessonId, files) {
    if (!files || files.length === 0) return;

    try {
      setUploadingLessonId(lessonId);
      await uploadLessonPDFs(id, lessonId, files);
      await loadCourse();
    } catch (err) {
      alert(err.message || "Failed to upload PDFs");
    } finally {
      setUploadingLessonId(null);
    }
  }

  async function handleMaterialUpload(lessonId, files) {
    if (!files || files.length === 0) return;

    try {
      setUploadingLessonId(lessonId);
      await uploadLessonMaterials(id, lessonId, files);
      await loadCourse();
    } catch (err) {
      alert(err.message || "Failed to upload materials");
    } finally {
      setUploadingLessonId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Course not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/courses")}
            className="text-emerald-600 hover:underline mb-4"
          >
            ← Back to Courses
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
              <p className="text-slate-600">Lesson Management</p>
            </div>
            <button
              onClick={() => {
                setEditingLesson(null);
                setLessonForm({
                  title: "",
                  description: "",
                  order: (course?.lessons?.length || 0) + 1,
                  durationMinutes: 45,
                  isPublished: false,
                  moduleNumber: 1,
                  moduleTitle: "",
                  lessonDate: "",
                });
                setShowLessonForm(true);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition"
            >
              + Add Lesson
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
            <div className="text-red-700 mb-2">{error}</div>
            {error.includes("Backend endpoint not implemented") && (
              <div className="bg-red-25 border border-red-300 rounded p-3 text-sm">
                <p className="font-medium text-red-800 mb-2">Required Backend Implementation:</p>
                <ul className="text-red-700 space-y-1">
                  <li>• GET /api/courses/:id (get course details - admin only)</li>
                  <li>• POST /api/courses/:id/lessons (add lesson - admin only)</li>
                  <li>• PATCH /api/courses/:id/lessons/:lessonId (update lesson - admin only)</li>
                  <li>• DELETE /api/courses/:id/lessons/:lessonId (delete lesson - admin only)</li>
                  <li>• POST /api/courses/:id/lessons/:lessonId/video (upload video - admin only)</li>
                  <li>• POST /api/courses/:id/lessons/:lessonId/pdfs (upload PDFs - admin only)</li>
                  <li>• POST /api/courses/:id/lessons/:lessonId/materials (upload materials - admin only)</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Lesson Form Modal */}
        {showLessonForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  {editingLesson ? "Edit Lesson" : "Add New Lesson"}
                </h2>

                <form onSubmit={handleLessonSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={lessonForm.title}
                      onChange={handleLessonFormChange}
                      required
                      className="w-full border border-slate-300 rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={lessonForm.description}
                      onChange={handleLessonFormChange}
                      rows={3}
                      className="w-full border border-slate-300 rounded px-3 py-2"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-1">Order</label>
                      <input
                        type="number"
                        name="order"
                        value={lessonForm.order}
                        onChange={handleLessonFormChange}
                        min="1"
                        className="w-full border border-slate-300 rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-1">Duration (min)</label>
                      <input
                        type="number"
                        name="durationMinutes"
                        value={lessonForm.durationMinutes}
                        onChange={handleLessonFormChange}
                        className="w-full border border-slate-300 rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-1">Module #</label>
                      <input
                        type="number"
                        name="moduleNumber"
                        value={lessonForm.moduleNumber}
                        onChange={handleLessonFormChange}
                        min="1"
                        className="w-full border border-slate-300 rounded px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Module Title</label>
                    <input
                      type="text"
                      name="moduleTitle"
                      value={lessonForm.moduleTitle}
                      onChange={handleLessonFormChange}
                      className="w-full border border-slate-300 rounded px-3 py-2"
                      placeholder="e.g., Basic Grammar"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Lesson Date</label>
                    <input
                      type="date"
                      name="lessonDate"
                      value={lessonForm.lessonDate}
                      onChange={handleLessonFormChange}
                      className="w-full border border-slate-300 rounded px-3 py-2"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isPublished"
                      id="isPublished"
                      checked={lessonForm.isPublished}
                      onChange={handleLessonFormChange}
                      className="w-4 h-4"
                    />
                    <label htmlFor="isPublished" className="text-sm font-medium text-slate-900">
                      Published
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowLessonForm(false);
                        setEditingLesson(null);
                      }}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded hover:bg-slate-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition"
                    >
                      {editingLesson ? "Update" : "Add"} Lesson
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Lessons List */}
        <div className="space-y-4">
          {course.lessons && course.lessons.length > 0 ? (
            course.lessons.map((lesson) => (
              <div key={lesson._id} className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-slate-500">#{lesson.order}</span>
                      <h3 className="text-lg font-semibold text-slate-900">{lesson.title}</h3>
                      {lesson.isPublished ? (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{lesson.description}</p>
                    <div className="text-xs text-slate-500 space-x-2">
                      {lesson.moduleNumber && <span>Module {lesson.moduleNumber}</span>}
                      {lesson.durationMinutes && <span>• {lesson.durationMinutes} min</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditLesson(lesson)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm rounded font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson._id)}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-sm rounded font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200">
                  <div>
                    <FileUpload
                      label="Video"
                      accept="video/*"
                      maxSizeMB={500}
                      previewType="list"
                      onFilesSelected={(files) => handleVideoUpload(lesson._id, files)}
                    />
                    {lesson.videoUrl && (
                      <div className="mt-2 text-xs text-green-600">✓ Video uploaded</div>
                    )}
                  </div>
                  <div>
                    <FileUpload
                      label="PDFs"
                      accept=".pdf"
                      multiple
                      maxSizeMB={50}
                      previewType="list"
                      onFilesSelected={(files) => handlePDFUpload(lesson._id, files)}
                    />
                    {lesson.pdfUrls && lesson.pdfUrls.length > 0 && (
                      <div className="mt-2 text-xs text-green-600">✓ {lesson.pdfUrls.length} PDF(s)</div>
                    )}
                  </div>
                  <div>
                    <FileUpload
                      label="Materials"
                      accept="*"
                      multiple
                      maxSizeMB={50}
                      previewType="list"
                      onFilesSelected={(files) => handleMaterialUpload(lesson._id, files)}
                    />
                    {lesson.materialUrls && lesson.materialUrls.length > 0 && (
                      <div className="mt-2 text-xs text-green-600">✓ {lesson.materialUrls.length} file(s)</div>
                    )}
                  </div>
                </div>

                {uploadingLessonId === lesson._id && (
                  <div className="mt-4 text-sm text-blue-600">Uploading...</div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <p className="text-slate-600 mb-4">No lessons added yet</p>
              <button
                onClick={() => setShowLessonForm(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition"
              >
                Add First Lesson
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
