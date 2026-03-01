// src/api/client.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Track in-flight refresh to avoid multiple simultaneous refresh calls
let refreshPromise = null;

async function refreshTokens() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      // Refresh failed; clear client state
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } catch {}
      return null;
    }

    const data = await res.json();
    // Server sets new accessToken cookie; update user in localStorage if provided
    if (data.user) {
      try {
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch {}
    }
    return data;
  } catch (err) {
    // Network error during refresh; clear state
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch {}
    return null;
  }
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Add Authorization header with JWT token from localStorage only if token exists
  const token = localStorage.getItem("accessToken");
  if (token && token.trim()) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    // send cookies for cookie-based sessions
    credentials: "include",
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    const message = data && data.message ? data.message : "Request failed";
    const err = new Error(message);
    err.status = res.status;
    err.data = data;

    // On 401 (access token expired), attempt refresh and retry
    if (res.status === 401) {
      // Avoid multiple simultaneous refresh calls
      if (!refreshPromise) {
        refreshPromise = refreshTokens()
          .finally(() => {
            refreshPromise = null;
          });
      }

      const refreshed = await refreshPromise;
      if (refreshed) {
        // Retry the original request
        return request(path, options);
      }
      // If refresh failed, just throw error - let the component handle it
      throw err;
    }

    // On 403 (forbidden), let the component handle it
    // ProtectedRoute or AdminRoute will handle redirects as needed
    if (res.status === 403) {
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } catch {}
    }

    throw err;
  }

  return data;
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  patch: (path, body) =>
    request(path, { method: "PATCH", body: JSON.stringify(body) }),
  del: (path) => request(path, { method: "DELETE" }),
};