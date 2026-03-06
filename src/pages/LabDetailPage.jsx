// src/pages/LabDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getLabById } from "../api/labs";
import { subscribeToLab, getMyLabSubscriptions } from "../api/labSubscriptions";
import { initLabPayment } from "../api/payments";
import { resolveAssetUrl, formatMoney } from "../utils/coursePricingUtils";

export default function LabDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [mySubscription, setMySubscription] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getLabById(id);
        setLab(data);

        // Check if the current user already has a subscription
        if (user && user.role !== "admin") {
          try {
            const subs = await getMyLabSubscriptions();
            const existing = (Array.isArray(subs) ? subs : []).find(
              (s) => (s.lab?._id || s.lab) === id
            );
            if (existing) setMySubscription(existing);
          } catch {
            // Not subscribed or no auth
          }
        }
      } catch (err) {
        setError(err.message || "Failed to load lab details");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, user]);

  async function handleSubscribe() {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      setSubscribing(true);
      setError("");
      if (lab.monthlyFee > 0) {
        // Paid lab — redirect to SSLCommerz
        const result = await initLabPayment({ labId: id });
        window.location.href = result.gatewayUrl;
        return; // navigation away; don't reset subscribing
      }
      // Free lab — direct subscription
      const sub = await subscribeToLab(id);
      setMySubscription(sub);
      setSuccessMsg("Subscription request submitted! Please wait for admin approval.");
    } catch (err) {
      setError(err.message || "Failed to subscribe");
    } finally {
      setSubscribing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-violet-500 border-t-transparent"></div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading lab details...</p>
        </div>
      </div>
    );
  }

  if (error && !lab) {
    return (
      <div className="min-h-screen bg-indigo-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!lab) return null;

  const headName = lab.labHead?.name || lab.labHead?.userId?.name || "Not assigned";
  const moderators = Array.isArray(lab.moderators) ? lab.moderators : [];
  const subscriptionStatus = mySubscription?.status;

  return (
    <div className="min-h-screen bg-indigo-50 dark:bg-slate-950">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 overflow-hidden -mt-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
            {/* Thumbnail */}
            <div className="md:col-span-2">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/30 aspect-video bg-slate-800">
                {lab.thumbnailUrl ? (
                  <img
                    src={resolveAssetUrl(lab.thumbnailUrl)}
                    alt={lab.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-600/20 to-purple-600/20 flex items-center justify-center">
                    <svg className="w-16 h-16 text-violet-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Virtual Lab
                </span>
                {!lab.isActive && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                    Inactive
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">{lab.name}</h1>
              <p className="text-slate-400 text-base leading-relaxed">{lab.description}</p>

              <div className="flex flex-wrap gap-6 pt-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Lab Head</p>
                  <p className="text-sm font-semibold text-white">{headName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Moderators</p>
                  <p className="text-sm font-semibold text-white">{moderators.length}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Max Members</p>
                  <p className="text-sm font-semibold text-white">{lab.maxMembers || "Unlimited"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Status</p>
                  <p className={`text-sm font-semibold ${lab.isActive ? "text-emerald-400" : "text-red-400"}`}>
                    {lab.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-white pt-2">
                {lab.monthlyFee > 0 ? formatMoney(lab.monthlyFee, lab.currency || "BDT") + "/mo" : "Free"}
              </div>

              {/* Actions */}
              <div className="pt-2 space-y-3">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">{error}</div>
                )}
                {successMsg && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-sm">{successMsg}</div>
                )}

                {!user && (
                  <button
                    onClick={() => navigate("/login")}
                    className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold text-white rounded-xl
                               bg-gradient-to-r from-violet-600 to-purple-600
                               hover:from-violet-500 hover:to-purple-500
                               shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40
                               transition-all duration-200"
                  >
                    Login to Subscribe
                  </button>
                )}

                {user && user.role === "admin" && (
                  <button
                    onClick={() => navigate(`/admin/labs/${id}/edit`)}
                    className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold text-white rounded-xl
                               bg-gradient-to-r from-indigo-600 to-violet-600
                               hover:from-indigo-500 hover:to-violet-500 transition-all"
                  >
                    Edit Lab
                  </button>
                )}

                {user && user.role !== "admin" && !mySubscription && (
                  <button
                    onClick={handleSubscribe}
                    disabled={subscribing || !lab.isActive}
                    className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold text-white rounded-xl
                               bg-gradient-to-r from-violet-600 to-purple-600
                               hover:from-violet-500 hover:to-purple-500
                               shadow-lg shadow-violet-500/25
                               transition-all duration-200 disabled:opacity-50"
                  >
                    {subscribing ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {lab.monthlyFee > 0 ? "Redirecting to payment…" : "Subscribing…"}
                      </>
                    ) : lab.monthlyFee > 0 ? (
                      <>
                        Subscribe &amp; Pay {formatMoney(lab.monthlyFee, lab.currency || "BDT")}/mo
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    ) : (
                      "Subscribe to Lab"
                    )}
                  </button>
                )}

                {user && mySubscription && (
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <span className="text-sm font-medium text-violet-300">
                      {subscriptionStatus === "active" && "✅ You are subscribed to this lab"}
                      {subscriptionStatus === "pending" && "⏳ Subscription pending approval"}
                      {subscriptionStatus === "cancelled" && "❌ Subscription cancelled"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Moderators */}
      {moderators.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Moderators</h3>
          <div className="flex flex-wrap gap-2">
            {moderators.map((mod) => (
              <span
                key={mod._id}
                className="inline-flex items-center px-4 py-2 rounded-xl text-sm bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
              >
                {mod.name || mod.userId?.name || "Moderator"}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
