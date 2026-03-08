import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, logout as apiLogout, getCurrentUser } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate session with server on first render, fallback to localStorage
  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        setLoading(true);
        // Prefer cached user to avoid unnecessary /auth/me calls when backend doesn't provide it.
        const cachedUser = localStorage.getItem("user");
        if (cachedUser) {
          try {
            const parsed = JSON.parse(cachedUser);
            if (mounted) setUser(parsed || null);
            return;
          } catch {
            // continue to server validation if cache is invalid
          }
        }
        const data = await getCurrentUser();
        if (!mounted) return;
        const u = data?.user || data;
        setUser(u || null);
        try {
          if (u) localStorage.setItem("user", JSON.stringify(u));
        } catch {}
      } catch (err) {
        if (!mounted) return;
        // If server returned unauthorized, clear stored session and do not restore
        if (err && (err.status === 401 || err.status === 403)) {
          try {
            localStorage.removeItem("user");
          } catch {}
          setUser(null);
        } else {
          // fallback to stored user if available (network errors, etc.)
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, []);

  async function login(credentials) {
    const data = await apiLogin(credentials);
    const user = data?.user || data;
    setUser(user);
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch {}
    return data;
  }

  function logout() {
    apiLogout();
    setUser(null);
    try {
      localStorage.removeItem("user");
    } catch {}
  }

  // Allow other auth flows (e.g., Google) to set session explicitly
  function setAuth({ user: nextUser }) {
    if (nextUser) {
      setUser(nextUser);
      try {
        localStorage.setItem("user", JSON.stringify(nextUser));
      } catch {}
    } else {
      // fallback to localStorage if present
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      }
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    logout,
    setAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}