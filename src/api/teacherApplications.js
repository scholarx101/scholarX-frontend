// src/api/teacherApplications.js
import { apiClient } from "./client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ============ PUBLIC APPLICATION SUBMISSION ============

export async function submitTeacherApplication(formData) {
  const headers = {};
  
  // Add Authorization header with JWT token from localStorage only if token exists and is valid
  const token = localStorage.getItem("accessToken");
  if (token && token.trim()) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/api/teacher-applications`, {
    method: "POST",
    credentials: "include",
    headers,
    body: formData, // FormData includes photo, cv, and other fields
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    const message = data && data.message ? data.message : "Application submission failed";
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// ============ ADMIN REVIEW ============

export async function getAllApplications() {
  return apiClient.get("/api/teacher-applications");
}

export async function getApplicationById(id) {
  return apiClient.get(`/api/teacher-applications/${id}`);
}

export async function updateApplication(id, data) {
  return apiClient.patch(`/api/teacher-applications/${id}`, data);
}

export async function approveApplication(id) {
  return apiClient.post(`/api/teacher-applications/${id}/approve`);
}
