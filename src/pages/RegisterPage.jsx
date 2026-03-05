import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { register, googleRegister } from "../api/auth";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo =
    location.state?.from?.pathname ||
    new URLSearchParams(location.search).get("returnTo") ||
    sessionStorage.getItem("postAuthRedirect") ||
    "/";
  const { setAuth } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleGoogleLogin(response) {
    setError("");
    setLoading(true);
    try {
      const data = await googleRegister({ idToken: response.credential, returnTo });
      // update auth context with session returned from server
      setAuth({ user: data.user });
      navigate(returnTo || "/", { replace: true });
    } catch (err) {
      if (err?.status === 409 && err?.data?.registered === true) {
        // Account exists - prompt user to login instead
        window.alert("Account already exists. Please log in.");
        navigate("/login", { replace: true });
        return;
      }

      setError(err.message || "Google registration failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    // ensure button text appears in English
    script.src = 'https://accounts.google.com/gsi/client?hl=en';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleLogin
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-register-button'),
          { theme: 'outline', size: 'large', text: 'signup_with', width: 350 }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill out all required fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setMessage(
        "An OTP has been sent to your email. Please verify it to complete registration."
      );

      // after a short delay, go to verify-email page with email in query
      setTimeout(() => {
        navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
      }, 1000);
    } catch (err) {
      // If backend indicates the account already exists, redirect to login
      if (err?.status === 409 && err?.data?.registered === true) {
        setError("An account with this email already exists. Redirecting to login...");
        setTimeout(() => navigate("/login", { replace: true }), 900);
        return;
      }

      const msg = err?.message || "There was a problem with registration. Please try again later.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 dark:bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create an account</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Join ScholarX to start learning</p>
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
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                placeholder="At least 8 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                placeholder="Type it again"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-2.5 rounded-xl font-medium disabled:opacity-60 transition shadow-lg shadow-indigo-500/25"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
            <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">or</span>
            <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <div id="google-register-button" className="flex justify-center"></div>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;