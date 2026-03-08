// src/api/auth.js
import { apiClient } from "./client";

// Dummy apiClient for when client.js is missing
// const apiClient = {
//   post: async () => ({ user: {} }),
//   get: async () => ({}),
// };

export async function register({ name, email, password }) {
  return apiClient.post("/api/auth/register", { name, email, password });
}

export async function verifyEmail({ email, code }) {
  return apiClient.post("/api/auth/verify-email", { email, code });
}

export async function login({ email, password }) {
  const data = await apiClient.post("/api/auth/login", { email, password });
  // store user and token
  try {
    localStorage.setItem("user", JSON.stringify(data.user));
    // Try multiple possible token field names
    const token = data.accessToken || data.token || data.access_token;
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
    }
  } catch (err) {
    console.error("Error storing login data:", err);
  }
  return data;
}

export async function logout() {
  try {
    await apiClient.post("/api/auth/logout");
  } catch (err) {
    // ignore network errors during logout
  }
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  } catch {}
}

export async function googleLogin({ idToken, returnTo } = {}) {
  const body = { idToken };
  if (returnTo) body.returnTo = returnTo;
  const data = await apiClient.post("/api/auth/google", body);
  // store user and token
  try {
    localStorage.setItem("user", JSON.stringify(data.user));
    const token = data.accessToken || data.token || data.access_token;
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
    }
  } catch (err) {
    console.error("Error storing Google login data:", err);
  }
  return data;
}

export async function googleRegister({ idToken, returnTo } = {}) {
  const body = { idToken };
  if (returnTo) body.returnTo = returnTo;
  const data = await apiClient.post("/api/auth/google/register", body);
  // store user and token
  try {
    localStorage.setItem("user", JSON.stringify(data.user));
    const token = data.accessToken || data.token || data.access_token;
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
    }
  } catch (err) {
    console.error("Error storing Google register data:", err);
  }
  return data;
}

export async function getCurrentUser() {
  // returns { user } or user directly depending on backend
  const data = await apiClient.get("/api/auth/me");
  return data;
}

export async function changePassword(currentPassword, newPassword) {
  return apiClient.post("/api/auth/change-password", {
    currentPassword,
    newPassword,
  });
}
