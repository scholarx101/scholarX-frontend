// src/pages/PaymentSuccessPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPaymentTransaction } from "../api/payments";
import { useAuth } from "../context/AuthContext";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const tranId = searchParams.get("tranId");

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tranId) {
      setLoading(false);
      return;
    }
    async function load() {
      try {
        const data = await getPaymentTransaction(tranId);
        setPayment(data);
      } catch (err) {
        // Payment may still be processing — show generic success
        setError(err.message || "Could not fetch transaction details.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tranId]);

  const dashboardPath =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "teacher"
      ? "/teacher/dashboard"
      : "/student/dashboard";

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent mb-4" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Confirming your payment…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 text-center">
        {/* Success icon */}
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Successful!</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Your payment has been received. Your enrollment or subscription will be activated shortly.
        </p>

        {/* Transaction details */}
        {payment ? (
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-6 text-left space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Transaction ID</span>
              <span className="font-mono text-slate-900 dark:text-slate-100 text-xs">{payment.tranId || tranId}</span>
            </div>
            {payment.amount != null && (
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Amount Paid</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {payment.amount} {payment.currency || "BDT"}
                </span>
              </div>
            )}
            {payment.type && (
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Type</span>
                <span className="text-slate-900 dark:text-slate-100 capitalize">{payment.type}</span>
              </div>
            )}
            {payment.status && (
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Status</span>
                <span className={`font-medium capitalize ${
                  payment.status === "completed"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}>
                  {payment.status}
                </span>
              </div>
            )}
          </div>
        ) : tranId ? (
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-6 text-sm text-left">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Transaction ID</span>
              <span className="font-mono text-slate-900 dark:text-slate-100 text-xs">{tranId}</span>
            </div>
            {error && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                ⚠️ {error} — Your payment is still recorded. Check your dashboard.
              </p>
            )}
          </div>
        ) : null}

        <div className="space-y-3">
          <button
            onClick={() => navigate(dashboardPath)}
            className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl transition shadow-lg shadow-emerald-500/20"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
