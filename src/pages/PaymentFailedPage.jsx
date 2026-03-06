// src/pages/PaymentFailedPage.jsx
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentFailedPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tranId = searchParams.get("tranId");

  return (
    <div className="min-h-screen bg-indigo-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 text-center">
        {/* Fail icon */}
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Failed</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Your payment could not be processed. No amount has been charged. Please try again or use a different payment method.
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
