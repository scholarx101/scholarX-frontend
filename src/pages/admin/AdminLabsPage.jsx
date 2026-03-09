// src/pages/admin/AdminLabsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLabs, deleteLab } from "../../api/labs";
import { resolveAssetUrl, formatMoney } from "../../utils/coursePricingUtils";

export default function AdminLabsPage() {
  const navigate = useNavigate();
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLabs();
  }, []);

  async function loadLabs() {
    try {
      setLoading(true);
      setError("");
      const data = await getLabs();
      setLabs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load labs");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(labId, labName) {
    if (!window.confirm(`Are you sure you want to delete "${labName}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteLab(labId);
      await loadLabs();
    } catch (err) {
      alert(err.message || "Failed to delete lab");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading labs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Lab Management</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Create and manage virtual labs</p>
          </div>
          <button
            onClick={() => navigate("/admin/labs/new")}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded font-medium transition"
          >
            + Create Lab
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {labs.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400 mb-4">No labs created yet.</p>
            <button
              onClick={() => navigate("/admin/labs/new")}
              className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded font-medium transition"
            >
              Create Your First Lab
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {labs.map((lab) => (
              <div
                key={lab._id}
                className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 md:p-6 flex flex-col md:flex-row items-start gap-4 hover:shadow-md transition"
              >
                {/* Thumbnail */}
                <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden bg-violet-50 dark:bg-violet-900/20 flex-shrink-0">
                  {(lab.thumbnail || lab.thumbnailUrl) ? (
                    <img
                      src={resolveAssetUrl(lab.thumbnail || lab.thumbnailUrl)}
                      alt={lab.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🔬</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 truncate">
                      {lab.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        lab.isActive
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {lab.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1 mb-2">
                    {lab.description}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      <strong>Fee:</strong>{" "}
                      {lab.monthlyFee > 0 ? formatMoney(lab.monthlyFee, lab.currency || "BDT") : "Free"}/mo
                    </span>
                    <span>
                      <strong>Head:</strong> {lab.labHead?.name || lab.labHead?.userId?.name || "Not assigned"}
                    </span>
                    <span>
                      <strong>Moderators:</strong> {Array.isArray(lab.moderators) ? lab.moderators.length : 0}
                    </span>
                    <span>
                      <strong>Max:</strong> {lab.maxMembers || "Unlimited"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/labs/${lab._id}/ai-tools`)}
                    className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white text-sm rounded font-medium transition"
                  >
                    AI Tools
                  </button>
                  <button
                    onClick={() => navigate(`/admin/labs/${lab._id}/edit`)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/admin/labs/${lab._id}/subscribers`)}
                    className="px-3 py-1.5 bg-slate-600 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white text-sm rounded font-medium transition"
                  >
                    Subscribers
                  </button>
                  <button
                    onClick={() => handleDelete(lab._id, lab.name)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded font-medium transition"
                  >
                    Delete
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
