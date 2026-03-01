// src/pages/admin/AdminCourseForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseById, createCourse, updateCourse, uploadCourseThumbnail } from "../../api/courses";
import { getAllTeachers } from "../../api/teachers";
import FileUpload from "../../components/FileUpload";

export default function AdminCourseForm({ mode = "create" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    daysPerWeek: 3,
    category: "",
    level: "Beginner",
    type: "recorded",
    isPublished: false,
    teachers: [],
    startsAt: "",
    pricing: {
      currency: "USD",
      admissionFee: 0,
      monthlyFee: 0,
      comboFee: 0,
      durationMonths: 6,
      semesterDurationMonths: 3,
    },
    live: {
      startDate: "",
      batches: [],
    },
  });

  useEffect(() => {
    loadTeachers();
    if (mode === "edit" && id) {
      loadCourse();
    }
  }, [mode, id]);

  async function loadTeachers() {
    try {
      const data = await getAllTeachers();
      setTeachers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load teachers:", err);
    }
  }

  async function loadCourse() {
    try {
      setLoading(true);
      const data = await getCourseById(id);
      setForm({
        title: data.title || "",
        description: data.description || "",
        duration: data.duration || "",
        daysPerWeek: data.daysPerWeek || 3,
        category: data.category || "",
        level: data.level || "Beginner",
        type: data.type || "recorded",
        isPublished: data.isPublished || false,
        teachers: data.teachers?.map((t) => t._id || t) || [],
        startsAt: data.startsAt ? new Date(data.startsAt).toISOString().slice(0, 10) : "",
        pricing: {
          currency: data.pricing?.currency || "USD",
          admissionFee: data.pricing?.admissionFee || 0,
          monthlyFee: data.pricing?.monthlyFee || 0,
          comboFee: data.pricing?.comboFee || 0,
          durationMonths: data.pricing?.durationMonths || 6,
          semesterDurationMonths: data.pricing?.semesterDurationMonths || 3,
        },
        live: {
          startDate: data.live?.startDate ? new Date(data.live.startDate).toISOString().slice(0, 10) : "",
          batches: data.live?.batches || [],
        },
      });
    } catch (err) {
      setError(err.message || "Failed to load course");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handlePricingChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [name]: name === "currency" ? value : (parseFloat(value) || 0),
      },
    }));
  }

  function handleLiveChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      live: {
        ...prev.live,
        [name]: value,
      },
    }));
  }

  function handleTeacherToggle(teacherId) {
    setForm((prev) => {
      const isSelected = prev.teachers.includes(teacherId);
      return {
        ...prev,
        teachers: isSelected
          ? prev.teachers.filter((id) => id !== teacherId)
          : [...prev.teachers, teacherId],
      };
    });
  }

  function addBatch() {
    setForm((prev) => ({
      ...prev,
      live: {
        ...prev.live,
        batches: [
          ...prev.live.batches,
          { title: "", time: "", capacity: 25 },
        ],
      },
    }));
  }

  function removeBatch(index) {
    setForm((prev) => ({
      ...prev,
      live: {
        ...prev.live,
        batches: prev.live.batches.filter((_, i) => i !== index),
      },
    }));
  }

  function updateBatch(index, field, value) {
    setForm((prev) => ({
      ...prev,
      live: {
        ...prev.live,
        batches: prev.live.batches.map((batch, i) =>
          i === index ? { ...batch, [field]: value } : batch
        ),
      },
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : undefined,
        live: {
          ...form.live,
          startDate: form.live.startDate ? new Date(form.live.startDate).toISOString() : undefined,
        },
      };

      let courseId;
      if (mode === "create") {
        const result = await createCourse(payload);
        courseId = result._id;
      } else {
        await updateCourse(id, payload);
        courseId = id;
      }

      // Upload thumbnail if provided
      if (thumbnailFile && courseId) {
        await uploadCourseThumbnail(courseId, thumbnailFile);
      }

      navigate("/admin/courses");
    } catch (err) {
      console.error("Error saving course:", err);
      // Check if it's a 401 (backend endpoint not implemented)
      if (err.status === 401) {
        setError("Backend endpoint not implemented. The course creation/update endpoints need to be added to the backend server.");
      } else {
        setError(err.message || "Failed to save course");
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading && mode === "edit") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading course...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/courses")}
            className="text-emerald-600 hover:underline mb-4"
          >
            ← Back to Courses
          </button>
          <h1 className="text-3xl font-bold text-slate-900">
            {mode === "create" ? "Create New Course" : "Edit Course"}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
            <div className="text-red-700 mb-2">{error}</div>
            {error.includes("Backend endpoint not implemented") && (
              <div className="bg-red-25 border border-red-300 rounded p-3 text-sm">
                <p className="font-medium text-red-800 mb-2">Required Backend Implementation:</p>
                <ul className="text-red-700 space-y-1">
                  <li>• POST /api/courses (create course - admin only)</li>
                  <li>• PATCH /api/courses/:id (update course - admin only)</li>
                  <li>• POST /api/courses/:id/thumbnail (upload thumbnail - admin only)</li>
                </ul>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg border border-slate-200 p-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 border-b pb-2">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded px-3 py-2"
                placeholder="Advanced Arabic Grammar"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border border-slate-300 rounded px-3 py-2"
                placeholder="Course description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  placeholder="6 months"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Days Per Week</label>
                <input
                  type="number"
                  name="daysPerWeek"
                  value={form.daysPerWeek}
                  onChange={handleChange}
                  min="1"
                  max="7"
                  className="w-full border border-slate-300 rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  placeholder="Language"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Level</label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                >
                  <option value="recorded">Recorded</option>
                  <option value="live">Live</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Start Date</label>
              <input
                type="date"
                name="startsAt"
                value={form.startsAt}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPublished"
                id="isPublished"
                checked={form.isPublished}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-slate-900">
                Published (visible to students)
              </label>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 border-b pb-2">Thumbnail</h2>
            <FileUpload
              label="Course Thumbnail"
              accept="image/*"
              maxSizeMB={10}
              previewType="image"
              onFilesSelected={(files) => setThumbnailFile(files[0])}
            />
          </div>

          {/* Teachers */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 border-b pb-2">Assign Teachers</h2>
            <div className="grid grid-cols-2 gap-3">
              {teachers.map((teacher) => (
                <label
                  key={teacher._id}
                  className="flex items-center gap-2 p-3 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.teachers.includes(teacher._id)}
                    onChange={() => handleTeacherToggle(teacher._id)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-slate-900">{teacher.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 border-b pb-2">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Currency</label>
                <select
                  name="currency"
                  value={form.pricing.currency}
                  onChange={handlePricingChange}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                  <option value="BDT">BDT (৳)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="PKR">PKR (₨)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Admission Fee</label>
                <input
                  type="number"
                  name="admissionFee"
                  value={form.pricing.admissionFee}
                  onChange={handlePricingChange}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Monthly Fee</label>
                <input
                  type="number"
                  name="monthlyFee"
                  value={form.pricing.monthlyFee}
                  onChange={handlePricingChange}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Combo Fee</label>
                <input
                  type="number"
                  name="comboFee"
                  value={form.pricing.comboFee}
                  onChange={handlePricingChange}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Duration (Months)</label>
                <input
                  type="number"
                  name="durationMonths"
                  value={form.pricing.durationMonths}
                  onChange={handlePricingChange}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Semester Duration</label>
                <input
                  type="number"
                  name="semesterDurationMonths"
                  value={form.pricing.semesterDurationMonths}
                  onChange={handlePricingChange}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Live Batches */}
          {(form.type === "live" || form.type === "hybrid") && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 border-b pb-2">Live Batches</h2>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={form.live.startDate}
                  onChange={handleLiveChange}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                />
              </div>

              {form.live.batches.map((batch, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-slate-900">Batch {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeBatch(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Title"
                      value={batch.title}
                      onChange={(e) => updateBatch(index, "title", e.target.value)}
                      className="border border-slate-300 rounded px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Time (e.g., 9:00 AM - 11:00 AM EST)"
                      value={batch.time}
                      onChange={(e) => updateBatch(index, "time", e.target.value)}
                      className="border border-slate-300 rounded px-3 py-2"
                    />
                    <input
                      type="number"
                      placeholder="Capacity"
                      value={batch.capacity}
                      onChange={(e) => updateBatch(index, "capacity", parseInt(e.target.value))}
                      className="border border-slate-300 rounded px-3 py-2"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addBatch}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded font-medium"
              >
                + Add Batch
              </button>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/admin/courses")}
              className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium disabled:opacity-60 transition"
            >
              {loading ? "Saving..." : mode === "create" ? "Create Course" : "Update Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
