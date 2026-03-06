// src/pages/PaymentCancelledPage.jsx
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentCancelledPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tranId = searchParams.get("tranId");

  return (
    <div className="min-h-screen bg-indigo-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 text-center">
        {/* Cancel icon */}
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Cancelled</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          You cancelled the payment process. No amount has been charged. You can try again whenever you're ready.
        </p>

        {tranId && (
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 p-3 mb-6 text-sm text-left">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Reference</span>
              <span className="font-mono text-slate-900 dark:text-slate-100 text-xs">{tranId}</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate(-2)}
            className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl transition shadow-lg shadow-indigo-500/20"
          >
            Try Again
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
