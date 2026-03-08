// src/pages/StudentLabsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyLabSubscriptions, cancelMySubscription } from "../api/labSubscriptions";
import { resolveAssetUrl, formatMoney } from "../utils/coursePricingUtils";

const STATUS_COLORS = {
  pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  active: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  cancelled: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

const STATUS_LABELS = {
  pending: "Pending",
  active: "Active",
  cancelled: "Cancelled",
};

export default function StudentLabsPage() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  async function loadSubscriptions() {
    try {
      setLoading(true);
      setError("");
      const data = await getMyLabSubscriptions();
      setSubscriptions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(subscriptionId) {
    if (!window.confirm("Are you sure you want to cancel this lab subscription?")) return;
    try {
      setCancellingId(subscriptionId);
      await cancelMySubscription(subscriptionId);
      await loadSubscriptions();
    } catch (err) {
      alert(err.message || "Failed to cancel subscription");
    } finally {
      setCancellingId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50 dark:bg-slate-950">
      {/* Dark gradient header */}
      <div className="bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white -mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">My Lab Subscriptions</h1>
          <p className="text-slate-300 text-sm">Track and manage your virtual lab memberships</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {subscriptions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No Lab Subscriptions</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">You haven't subscribed to any virtual labs yet.</p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-lg shadow-violet-500/25"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Explore Labs
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {subscriptions.map((sub) => {
              const lab = sub.lab || {};
              return (
                <div
                  key={sub._id}
                  className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4 hover:border-violet-300 dark:hover:border-violet-800 transition-all group"
                >
                  {/* Thumbnail */}
                  <div className="w-full sm:w-24 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600 flex-shrink-0">
                    {(lab.thumbnail || lab.thumbnailUrl) ? (
                      <img src={resolveAssetUrl(lab.thumbnail || lab.thumbnailUrl)} alt={lab.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3
                        className="text-base font-semibold text-slate-900 dark:text-white truncate cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition"
                        onClick={() => navigate(`/labs/${lab._id}`)}
                      >
                        {lab.name || "Unknown Lab"}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${STATUS_COLORS[sub.status] || ""}`}>
                        {STATUS_LABELS[sub.status] || sub.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">{lab.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {lab.monthlyFee > 0 ? formatMoney(lab.monthlyFee, lab.currency || "BDT") : "Free"}/mo
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        {lab.labHead?.name || lab.labHead?.userId?.name || "—"}
                      </span>
                      {sub.subscribedAt && (
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          Joined {new Date(sub.subscribedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => navigate(`/labs/${lab._id}`)}
                      className="px-3.5 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-sm rounded-lg font-medium transition shadow-lg shadow-violet-500/20"
                    >
                      View Lab
                    </button>
                    {sub.status === "active" && (
                      <button
                        onClick={() => navigate(`/labs/${lab._id}#ai-tools`)}
                        className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white text-sm rounded-lg font-medium transition shadow-lg shadow-cyan-500/20"
                        title="Access AI tools for this lab"
                      >
                        AI Tools
                      </button>
                    )}
                    {sub.status !== "cancelled" && (
                      <button
                        onClick={() => handleCancel(sub._id)}
                        disabled={cancellingId === sub._id}
                        className="px-3.5 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm rounded-lg font-medium transition disabled:opacity-50"
                      >
                        {cancellingId === sub._id ? "..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
