import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/auth";

function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", code: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromQuery = params.get("email");
    if (emailFromQuery) {
      setForm((prev) => ({ ...prev, email: emailFromQuery }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.email || !form.code) {
      setError("Please enter your email and OTP code");
      return;
    }

    try {
      setLoading(true);
      await verifyEmail({ email: form.email, code: form.code });

      setMessage("Email has been successfully verified. You can now log in.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      const msg =
        err?.message ||
        "There was a problem with OTP verification. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 dark:bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Email Verification</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Enter the code sent to your email</p>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 px-4 py-3 rounded-xl">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">OTP Code</label>
              <input type="text" name="code" value={form.code} onChange={handleChange} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition text-center text-lg tracking-widest" placeholder="000000" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-2.5 rounded-xl font-medium disabled:opacity-60 transition shadow-lg shadow-indigo-500/25">
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
            Can't find the OTP? Check your spam/promotions folder.
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;