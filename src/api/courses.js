import { apiClient } from "./client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getCourses() {
  return apiClient.get("/api/courses");
}

// Alias for getAllCourses (used in admin dashboard)
export async function getAllCourses() {
  return getCourses();
}

export async function getCourseById(id) {
  return apiClient.get(`/api/courses/${id}`);
}

export async function createCourse(data) {
  return apiClient.post("/api/courses", data);
}

export async function updateCourse(id, data) {
  return apiClient.patch(`/api/courses/${id}`, data);
}

export async function deleteCourse(id) {
  return apiClient.del(`/api/courses/${id}`);
}

async function upload(path, formData, method = "POST") {
  const headers = {};
  
  // Add Authorization header with JWT token from localStorage only if token exists and is valid
  const token = localStorage.getItem("accessToken");
  if (token && token.trim()) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
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

export async function uploadCourseThumbnail(courseId, file) {
  const formData = new FormData();
  formData.append("thumbnail", file);
  return upload(`/api/courses/${courseId}/thumbnail`, formData);
}

// ============ LESSON MANAGEMENT ============

export async function addLesson(courseId, lessonData) {
  return apiClient.post(`/api/courses/${courseId}/lessons`, lessonData);
}

export async function updateLesson(courseId, lessonId, lessonData) {
  return apiClient.patch(`/api/courses/${courseId}/lessons/${lessonId}`, lessonData);
}

export async function deleteLesson(courseId, lessonId) {
  return apiClient.del(`/api/courses/${courseId}/lessons/${lessonId}`);
}

// ============ FILE UPLOADS ============

export async function uploadLessonVideo(courseId, lessonId, file, onProgress) {
  const formData = new FormData();
  formData.append("video", file);
  return upload(`/api/courses/${courseId}/lessons/${lessonId}/video`, formData);
}

export async function uploadLessonPDFs(courseId, lessonId, files) {
  const formData = new FormData();
  files.forEach((file) => formData.append("pdfs", file));
  return upload(`/api/courses/${courseId}/lessons/${lessonId}/pdfs`, formData);
}

export async function uploadLessonMaterials(courseId, lessonId, files) {
  const formData = new FormData();
  files.forEach((file) => formData.append("materials", file));
  return upload(`/api/courses/${courseId}/lessons/${lessonId}/materials`, formData);
}

export async function uploadBatchRecording(courseId, lessonId, batchId, file) {
  const formData = new FormData();
  formData.append("recording", file);
  return upload(`/api/courses/${courseId}/lessons/${lessonId}/batches/${batchId}/recording`, formData);
}

// ============ LIVE CLASS MANAGEMENT ============

export async function setBatchMeetingLink(courseId, lessonId, batchId, linkData) {
  return apiClient.patch(
    `/api/courses/${courseId}/lessons/${lessonId}/batches/${batchId}/meeting-link`,
    linkData
  );
}
