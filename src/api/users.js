import { apiClient } from "./client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ============ ADMIN USER MANAGEMENT ============

// Get all users (admin only)
export async function getAllUsers() {
  return apiClient.get("/api/users");
}

// Alias for backward compatibility
export async function getUsers() {
  return getAllUsers();
}

// Get user by ID (admin only)
export async function getUserById(id) {
  return apiClient.get(`/api/users/${id}`);
}

// Update user information (admin only)
export async function updateUser(id, data) {
  return apiClient.patch(`/api/users/${id}`, data);
}

// Delete user (admin only)
export async function deleteUser(id) {
  return apiClient.del(`/api/users/${id}`);
}

// Reset user password (admin only)
export async function resetUserPassword(id) {
  return apiClient.post(`/api/users/${id}/reset-password`);
}

// ============ USER PROFILE MANAGEMENT ============

// Update current user's profile
export async function updateProfile(data) {
  return apiClient.patch("/api/auth/profile", data);
}

// Change current user's password
export async function changePassword(currentPassword, newPassword) {
  return apiClient.post("/api/auth/change-password", {
    currentPassword,
    newPassword,
  });
}

// Upload profile photo
export async function uploadProfilePhoto(file) {
  const formData = new FormData();
  formData.append("photo", file);

  const headers = {};
  
  // Add Authorization header with JWT token from localStorage only if token exists and is valid
  const token = localStorage.getItem("accessToken");
  if (token && token.trim()) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/api/auth/profile/photo`, {
    method: "POST",
    credentials: "include",
    headers,
    body: formData,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    const message = data && data.message ? data.message : "Upload failed";
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
