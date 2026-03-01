// src/pages/admin/AdminLabSubscribersPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLabById } from "../../api/labs";
import { getLabSubscribers, updateSubscriptionStatus } from "../../api/labSubscriptions";

const STATUS_COLORS = {
  pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  active: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  cancelled: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

export default function AdminLabSubscribersPage() {
  const { labId } = useParams();
  const navigate = useNavigate();

  const [lab, setLab] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadData();
  }, [labId]);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [labData, subsData] = await Promise.all([
        getLabById(labId),
        getLabSubscribers(labId),
      ]);
      setLab(labData);
      setSubscribers(Array.isArray(subsData) ? subsData : []);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(subscriptionId, newStatus) {
    try {
      setUpdatingId(subscriptionId);
      await updateSubscriptionStatus(subscriptionId, newStatus);
      await loadData();
    } catch (err) {
      alert(err.message || "Failed to update subscription");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading subscribers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate("/admin/labs")}
          className="mb-6 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          ← Back to Labs
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Subscribers — {lab?.name || "Lab"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage subscriptions for this lab
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-sm text-slate-500 dark:text-slate-400">Total</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{subscribers.length}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-sm text-slate-500 dark:text-slate-400">Active</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {subscribers.filter((s) => s.status === "active").length}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-sm text-slate-500 dark:text-slate-400">Pending</div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {subscribers.filter((s) => s.status === "pending").length}
            </div>
          </div>
        </div>

        {subscribers.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400">No subscribers yet.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                    <th className="text-left px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Student</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Subscribed</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {subscribers.map((sub) => (
                    <tr key={sub._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                      <td className="px-4 py-3 text-slate-900 dark:text-slate-100 font-medium">
                        {sub.student?.name || "Unknown"}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {sub.student?.email || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[sub.status] || ""}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {sub.status === "pending" && (
                            <button
                              onClick={() => handleStatusChange(sub._id, "active")}
                              disabled={updatingId === sub._id}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded font-medium transition disabled:opacity-50"
                            >
                              Approve
                            </button>
                          )}
                          {sub.status !== "cancelled" && (
                            <button
                              onClick={() => handleStatusChange(sub._id, "cancelled")}
                              disabled={updatingId === sub._id}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-medium transition disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}
                          {sub.status === "cancelled" && (
                            <button
                              onClick={() => handleStatusChange(sub._id, "active")}
                              disabled={updatingId === sub._id}
                              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded font-medium transition disabled:opacity-50"
                            >
                              Reactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
