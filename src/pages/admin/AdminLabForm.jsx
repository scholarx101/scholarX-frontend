// src/pages/admin/AdminLabForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createLab,
  updateLab,
  getLabById,
  assignLabHead,
  setLabModerators,
  uploadLabThumbnail,
} from "../../api/labs";
import { getAllTeachers } from "../../api/teachers";

const AI_TOOLS_LIST = [
  { key: "chat", label: "AI Chat Assistant" },
  { key: "document_analysis", label: "Document Analyzer" },
  { key: "code_explanation", label: "Code Explainer" },
  { key: "idea_generation", label: "Research Idea Generator" },
  { key: "tutoring", label: "AI Tutor" },
  { key: "text_review", label: "Text Reviewer" },
];

export default function AdminLabForm({ mode = "create" }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    name: "",
    description: "",
    monthlyFee: "",
    currency: "BDT",
    maxMembers: "",
    isActive: true,
  });
  const [labHeadId, setLabHeadId] = useState("");
  const [moderatorIds, setModeratorIds] = useState([]);
  const [enabledAiTools, setEnabledAiTools] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load teachers and lab data (if editing)
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const teacherData = await getAllTeachers();
        setTeachers(Array.isArray(teacherData) ? teacherData : []);

        if (isEdit && id) {
          const lab = await getLabById(id);
          setForm({
            name: lab.name || "",
            description: lab.description || "",
            monthlyFee: lab.monthlyFee ?? "",
            currency: lab.currency || "BDT",
            maxMembers: lab.maxMembers ?? "",
            isActive: lab.isActive !== false,
          });
          setLabHeadId(lab.labHead?._id || lab.labHead?.userId?._id || "");
          setModeratorIds(
            Array.isArray(lab.moderators)
              ? lab.moderators.map((m) => m._id || m.userId?._id || "").filter(Boolean)
              : []
          );
          setEnabledAiTools(Array.isArray(lab.enabledAiTools) ? lab.enabledAiTools : []);
          if (lab.thumbnailUrl) setThumbnailPreview(lab.thumbnailUrl);
        }
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isEdit, id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleThumbnailChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  }

  function toggleModerator(teacherId) {
    setModeratorIds((prev) =>
      prev.includes(teacherId)
        ? prev.filter((id) => id !== teacherId)
        : [...prev, teacherId]
    );
  }

  function toggleAiTool(toolKey) {
    setEnabledAiTools((prev) =>
      prev.includes(toolKey)
        ? prev.filter((k) => k !== toolKey)
        : [...prev, toolKey]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Lab name is required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        monthlyFee: form.monthlyFee !== "" ? Number(form.monthlyFee) : 0,
        currency: form.currency,
        maxMembers: form.maxMembers !== "" ? Number(form.maxMembers) : null,
        isActive: form.isActive,
        enabledAiTools,
      };

      let labId = id;

      if (isEdit) {
        await updateLab(id, payload);
      } else {
        const created = await createLab(payload);
        labId = created._id;
      }

      // Assign lab head if selected
      if (labHeadId && labId) {
        try {
          await assignLabHead(labId, labHeadId);
        } catch (err) {
          console.error("Failed to assign lab head:", err);
        }
      }

      // Set moderators
      if (labId) {
        try {
          await setLabModerators(labId, moderatorIds);
        } catch (err) {
          console.error("Failed to set moderators:", err);
        }
      }

      // Upload thumbnail
      if (thumbnailFile && labId) {
        try {
          await uploadLabThumbnail(labId, thumbnailFile);
        } catch (err) {
          console.error("Failed to upload thumbnail:", err);
        }
      }

      setSuccess(isEdit ? "Lab updated successfully!" : "Lab created successfully!");
      setTimeout(() => navigate("/admin/labs"), 1200);
    } catch (err) {
      setError(err.message || "Failed to save lab");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <button
          onClick={() => navigate("/admin/labs")}
          className="mb-6 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          ← Back to Labs
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-6 md:p-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">
            {isEdit ? "Edit Lab" : "Create New Lab"}
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-700 dark:text-emerald-400 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Lab Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700
                           text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                placeholder="e.g. AI Research Lab"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700
                           text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none"
                placeholder="Describe what this lab is about..."
              />
            </div>

            {/* Fee & Currency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Fee
                </label>
                <input
                  type="number"
                  name="monthlyFee"
                  value={form.monthlyFee}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700
                             text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Currency
                </label>
                <select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700
                             text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                >
                  <option value="BDT">BDT</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            {/* Max Members */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Max Members
              </label>
              <input
                type="number"
                name="maxMembers"
                value={form.maxMembers}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700
                           text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                placeholder="Leave blank for unlimited"
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-violet-600 rounded border-slate-300 focus:ring-violet-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Lab is active and visible
              </label>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Thumbnail
              </label>
              {thumbnailPreview && (
                <div className="mb-2 w-48 h-32 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600">
                  <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="text-sm text-slate-600 dark:text-slate-400
                           file:mr-3 file:py-2 file:px-4 file:border-0 file:rounded-lg
                           file:text-sm file:font-medium file:bg-violet-50 dark:file:bg-violet-900/30
                           file:text-violet-700 dark:file:text-violet-300 hover:file:bg-violet-100"
              />
            </div>

            <hr className="border-slate-200 dark:border-slate-700" />

            {/* Lab Head */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Lab Head
              </label>
              <select
                value={labHeadId}
                onChange={(e) => setLabHeadId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700
                           text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
              >
                <option value="">— Select a teacher —</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name || t.userId?.name || t._id}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                The lab head leads the research and evaluates student work.
              </p>
            </div>

            {/* Moderators */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Moderators
              </label>
              {teachers.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No teachers available</p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2 max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-600 rounded-lg p-3">
                  {teachers.map((t) => {
                    const tId = t._id;
                    const isSelected = moderatorIds.includes(tId);
                    return (
                      <label
                        key={tId}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition
                          ${isSelected
                            ? "bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700"
                            : "bg-slate-50 dark:bg-slate-700/50 border border-transparent hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleModerator(tId)}
                          className="w-4 h-4 text-violet-600 rounded border-slate-300 focus:ring-violet-500"
                        />
                        <span className="text-slate-700 dark:text-slate-300 truncate">
                          {t.name || t.userId?.name || tId}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Moderators help manage the lab and evaluate student work.
              </p>
            </div>

            {/* AI Tools */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                AI Research Tools
              </label>
              <div className="grid gap-2 sm:grid-cols-2 border border-slate-200 dark:border-slate-600 rounded-lg p-3">
                {AI_TOOLS_LIST.map((tool) => {
                  const isEnabled = enabledAiTools.includes(tool.key);
                  return (
                    <label
                      key={tool.key}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition
                        ${isEnabled
                          ? "bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-700"
                          : "bg-slate-50 dark:bg-slate-700/50 border border-transparent hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => toggleAiTool(tool.key)}
                        className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
                      />
                      <span className="text-slate-700 dark:text-slate-300 truncate">{tool.label}</span>
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select which AI tools are available to subscribed members of this lab.
              </p>
            </div>

            <hr className="border-slate-200 dark:border-slate-700" />

            {/* Submit */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {saving ? "Saving..." : isEdit ? "Update Lab" : "Create Lab"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/labs")}
                className="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
