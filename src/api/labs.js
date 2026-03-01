// src/api/labs.js
import { apiClient } from "./client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ============ PUBLIC ============

export async function getLabs() {
  return apiClient.get("/api/labs");
}

export async function getLabById(id) {
  return apiClient.get(`/api/labs/${id}`);
}

// ============ ADMIN ============

export async function createLab(data) {
  return apiClient.post("/api/labs", data);
}

export async function updateLab(id, data) {
  return apiClient.patch(`/api/labs/${id}`, data);
}

export async function deleteLab(id) {
  return apiClient.del(`/api/labs/${id}`);
}

export async function assignLabHead(labId, teacherId) {
  return apiClient.patch(`/api/labs/${labId}/lab-head`, { teacherId });
}

export async function setLabModerators(labId, teacherIds) {
  return apiClient.patch(`/api/labs/${labId}/moderators`, { teacherIds });
}

export async function uploadLabThumbnail(labId, file) {
  const formData = new FormData();
  formData.append("thumbnail", file);

  const headers = {};
  const token = localStorage.getItem("accessToken");
  if (token && token.trim()) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/api/labs/${labId}/thumbnail`, {
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
