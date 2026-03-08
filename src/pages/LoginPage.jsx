import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { googleLogin, googleRegister } from "../api/auth";

export default function LoginPage() {
  const { login, setAuth, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from =
    location.state?.from?.pathname ||
    new URLSearchParams(location.search).get("returnTo") ||
    sessionStorage.getItem("postAuthRedirect") ||
    "/";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      // Check if the email is not registered
      if (err?.status === 404 && (err?.message?.includes("not registered") || err?.data?.registered === false)) {
        navigate("/register");
        return;
      }
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin(response) {
    setError("");
    setLoading(true);
    try {
      const data = await googleLogin({ idToken: response.credential, returnTo: from });
      // Update context with the new session so app state reflects login
      setAuth({ user: data.user });
      navigate(from, { replace: true });
    } catch (err) {
      // If backend indicates account not found, offer to register via Google
      if (err?.status === 403 && err?.data?.registered === false) {
        const ok = window.confirm(
          "No account found for this Google account. Register and create an account?"
        );
        if (ok) {
          try {
            const reg = await googleRegister({ idToken: response.credential, returnTo: from });
            setAuth({ user: reg.user });
            navigate(from, { replace: true });
            return;
          } catch (e) {
            // If registration endpoint reports account exists, redirect to login
            if (e?.status === 409 && e?.data?.registered === true) {
              window.alert("Account already exists. Please log in.");
              navigate("/login", { replace: true });
              return;
            }
            setError(e.message || "Google registration failed");
            return;
          }
        }
      }

      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    // load english locale explicitly to avoid Bengali text on the button
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
          document.getElementById('google-login-button'),
          { theme: 'outline', size: 'large', text: 'continue_with', width: 350 }
        );
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [from, navigate, setAuth]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 dark:bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                placeholder="Your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-2.5 rounded-xl font-medium disabled:opacity-60 transition shadow-lg shadow-indigo-500/25"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
            <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">or</span>
            <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <div id="google-login-button" className="flex justify-center"></div>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
