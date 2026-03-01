// src/pages/teacher/TeacherLabsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLabs } from "../../api/labs";
import { getLabSubscribers } from "../../api/labSubscriptions";
import { useAuth } from "../../context/AuthContext";
import { resolveAssetUrl, formatMoney } from "../../utils/coursePricingUtils";

export default function TeacherLabsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedLab, setExpandedLab] = useState(null);
  const [subscribers, setSubscribers] = useState({});
  const [loadingSubs, setLoadingSubs] = useState(null);

  useEffect(() => {
    loadLabs();
  }, []);

  async function loadLabs() {
    try {
      setLoading(true);
      setError("");
      const allLabs = await getLabs();
      const labList = Array.isArray(allLabs) ? allLabs : [];

      // Filter labs where the current user is lab head or a moderator
      // The teacher's userId might be stored differently depending on the backend population
      const myLabs = labList.filter((lab) => {
        const headId = lab.labHead?._id || lab.labHead?.userId?._id || lab.labHead?.userId || lab.labHead;
        const isHead = headId === user?._id || headId === user?.teacherId;

        const isMod = Array.isArray(lab.moderators) && lab.moderators.some((m) => {
          const modId = m._id || m.userId?._id || m.userId || m;
          return modId === user?._id || modId === user?.teacherId;
        });

        return isHead || isMod;
      });

      setLabs(myLabs);
    } catch (err) {
      setError(err.message || "Failed to load labs");
    } finally {
      setLoading(false);
    }
  }

  async function handleExpand(labId) {
    if (expandedLab === labId) {
      setExpandedLab(null);
      return;
    }
    setExpandedLab(labId);

    if (!subscribers[labId]) {
      try {
        setLoadingSubs(labId);
        const subs = await getLabSubscribers(labId);
        setSubscribers((prev) => ({ ...prev, [labId]: Array.isArray(subs) ? subs : [] }));
      } catch (err) {
        console.error("Failed to load subscribers:", err);
        setSubscribers((prev) => ({ ...prev, [labId]: [] }));
      } finally {
        setLoadingSubs(null);
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Dark gradient header */}
      <div className="bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <button
            onClick={() => navigate("/teacher/dashboard")}
            className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">My Labs</h1>
          <p className="text-slate-300 text-sm">Labs you lead or moderate</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {labs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No Labs Assigned</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Contact the admin to get assigned as a lab head or moderator.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {labs.map((lab) => {
              const isExpanded = expandedLab === lab._id;
              const headId = lab.labHead?._id || lab.labHead?.userId?._id || lab.labHead?.userId || lab.labHead;
              const isHead = headId === user?._id || headId === user?.teacherId;
              const subs = subscribers[lab._id] || [];
              const activeSubs = subs.filter((s) => s.status === "active");
              const pendingSubs = subs.filter((s) => s.status === "pending");

              return (
                <div
                  key={lab._id}
                  className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all"
                >
                  {/* Lab header */}
                  <div
                    className="p-5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    onClick={() => handleExpand(lab._id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600 flex-shrink-0 shadow-lg shadow-violet-500/20">
                          {lab.thumbnailUrl ? (
                            <img src={resolveAssetUrl(lab.thumbnailUrl)} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-7 h-7 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">
                              {lab.name}
                            </h3>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${
                              isHead
                                ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400"
                                : "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400"
                            }`}>
                              {isHead ? "Lab Head" : "Moderator"}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mb-1.5">{lab.description}</p>
                          <div className="flex flex-wrap gap-3 text-xs text-slate-400 dark:text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              {lab.monthlyFee > 0 ? formatMoney(lab.monthlyFee, lab.currency || "BDT") : "Free"}/mo
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              Max: {lab.maxMembers || "Unlimited"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 p-2">
                        <svg className={`w-5 h-5 text-slate-400 dark:text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* Expanded subscribers */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-5">
                      {loadingSubs === lab._id ? (
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-violet-600 border-t-transparent" />
                          Loading subscribers...
                        </div>
                      ) : subs.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400">No subscribers yet.</p>
                      ) : (
                        <>
                          <div className="flex gap-4 mb-4">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {activeSubs.length} active
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              {pendingSubs.length} pending
                            </span>
                          </div>
                          <div className="space-y-1">
                            {subs.map((sub) => (
                              <div key={sub._id} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg hover:bg-white dark:hover:bg-slate-900/60 transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                    {(sub.student?.name || "?")[0].toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{sub.student?.name || "Unknown"}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{sub.student?.email || "—"}</p>
                                  </div>
                                </div>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium flex-shrink-0 ${
                                  sub.status === "active"
                                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                    : sub.status === "pending"
                                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                }`}>
                                  {sub.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
