// src/pages/admin/AdminTeachersPage.jsx
import { useEffect, useState } from "react";
import { getAllTeachers, updateTeacher, uploadTeacherPhoto } from "../../api/teachers";
import { getAllApplications, approveApplication, updateApplication } from "../../api/teacherApplications";
import FileUpload from "../../components/FileUpload";
import { resolveAssetUrl } from "../../utils/coursePricingUtils";

export default function AdminTeachersPage() {
  const [activeTab, setActiveTab] = useState("applications"); // "applications" or "teachers"
  const [teachers, setTeachers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [teachersData, appsData] = await Promise.all([
        getAllTeachers(),
        getAllApplications(),
      ]);
      setTeachers(Array.isArray(teachersData) ? teachersData : []);
      setApplications(Array.isArray(appsData) ? appsData : []);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(appId) {
    if (!window.confirm("Approve this application and create teacher account?")) return;

    try {
      await approveApplication(appId);
      await loadData();
      alert("Application approved and teacher account created!");
    } catch (err) {
      alert(err.message || "Failed to approve application");
    }
  }

  async function handleReject(appId) {
    if (!window.confirm("Reject this application?")) return;

    try {
      await updateApplication(appId, { status: "rejected" });
      await loadData();
    } catch (err) {
      alert(err.message || "Failed to reject application");
    }
  }

  async function handleUpdateTeacher(e) {
    e.preventDefault();
    if (!editingTeacher) return;

    try {
      await updateTeacher(editingTeacher._id, {
        name: editingTeacher.name,
        email: editingTeacher.email,
        expertise: editingTeacher.expertise,
        bio: editingTeacher.bio,
        status: editingTeacher.status,
      });

      // Upload photo if provided
      if (photoFile) {
        await uploadTeacherPhoto(editingTeacher._id, photoFile);
      }

      await loadData();
      setEditingTeacher(null);
      setPhotoFile(null);
      alert("Teacher updated successfully!");
    } catch (err) {
      alert(err.message || "Failed to update teacher");
    }
  }

  const pendingApplications = applications.filter((app) => app.status === "pending");
  const reviewedApplications = applications.filter((app) => app.status !== "pending");

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Teacher Management</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab("applications")}
            className={`px-4 py-2 rounded font-medium ${
              activeTab === "applications"
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
            }`}
          >
            Applications ({pendingApplications.length})
          </button>
          <button
            onClick={() => setActiveTab("teachers")}
            className={`px-4 py-2 rounded font-medium ${
              activeTab === "teachers"
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
            }`}
          >
            Approved Teachers ({teachers.length})
          </button>
        </div>

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div className="space-y-4">
            {pendingApplications.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                <p className="text-slate-600">No pending applications</p>
              </div>
            ) : (
              pendingApplications.map((app) => (
                <div key={app._id} className="bg-white rounded-lg border border-slate-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-slate-900">{app.name}</h3>
                        <span className="px-2 py-1 text-xs font-medium rounded bg-amber-100 text-amber-800">
                          {app.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-600 mb-3">
                        <div>📧 {app.email}</div>
                        <div>📞 {app.phone || "N/A"}</div>
                        <div>💼 {app.designation}</div>
                        <div>🌍 {app.languageExpertise?.join(", ") || "N/A"}</div>
                      </div>
                      <div className="text-sm text-slate-700 mb-3">
                        <strong>Experience:</strong> {app.professionalExperience}
                      </div>
                      {app.message && (
                        <div className="text-sm text-slate-700 mb-3 p-3 bg-slate-50 rounded">
                          <strong>Message:</strong> {app.message}
                        </div>
                      )}
                      <div className="flex gap-3 text-sm">
                        {app.photoUrl && (
                          <a
                            href={resolveAssetUrl(app.photoUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            📷 View Photo
                          </a>
                        )}
                        {app.cvUrl && (
                          <a
                            href={resolveAssetUrl(app.cvUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            📄 View CV
                          </a>
                        )}
                        {app.socials?.facebook && (
                          <a
                            href={app.socials.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Facebook
                          </a>
                        )}
                        {app.socials?.youtube && (
                          <a
                            href={app.socials.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:underline"
                          >
                            YouTube
                          </a>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-3">
                        Applied: {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(app._id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(app._id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Reviewed Applications */}
            {reviewedApplications.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Reviewed Applications</h2>
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase">Name</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase">Email</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase">Status</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {reviewedApplications.map((app) => (
                        <tr key={app._id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">{app.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{app.email}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                app.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Teachers Tab */}
        {activeTab === "teachers" && (
          <div>
            {teachers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                <p className="text-slate-600">No approved teachers yet</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase">Name</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase">Email</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase">Expertise</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase">Status</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-slate-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {teachers.map((teacher) => (
                      <tr key={teacher._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{teacher.name}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{teacher.email || teacher.user?.email}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{teacher.expertise || "-"}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${
                              teacher.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {teacher.status || "active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setEditingTeacher(teacher)}
                            className="text-blue-600 hover:underline text-sm font-medium"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Edit Teacher Modal */}
        {editingTeacher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Edit Teacher</h2>
                <form onSubmit={handleUpdateTeacher} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Name</label>
                    <input
                      type="text"
                      value={editingTeacher.name}
                      onChange={(e) =>
                        setEditingTeacher({ ...editingTeacher, name: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Email</label>
                    <input
                      type="email"
                      value={editingTeacher.email || editingTeacher.user?.email || ""}
                      onChange={(e) =>
                        setEditingTeacher({ ...editingTeacher, email: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Expertise</label>
                    <input
                      type="text"
                      value={editingTeacher.expertise || ""}
                      onChange={(e) =>
                        setEditingTeacher({ ...editingTeacher, expertise: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Bio</label>
                    <textarea
                      value={editingTeacher.bio || ""}
                      onChange={(e) =>
                        setEditingTeacher({ ...editingTeacher, bio: e.target.value })
                      }
                      rows={3}
                      className="w-full border border-slate-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Status</label>
                    <select
                      value={editingTeacher.status || "active"}
                      onChange={(e) =>
                        setEditingTeacher({ ...editingTeacher, status: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded px-3 py-2"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <FileUpload
                      label="Update Photo"
                      accept="image/*"
                      maxSizeMB={10}
                      previewType="image"
                      onFilesSelected={(files) => setPhotoFile(files[0])}
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTeacher(null);
                        setPhotoFile(null);
                      }}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded hover:bg-slate-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition"
                    >
                      Update Teacher
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
