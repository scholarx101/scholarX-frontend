// src/api/teachers.js
import { apiClient } from "./client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ============ TEACHER DASHBOARD (from Part 2) ============

// Get courses assigned to teacher
export async function getMyTeacherCourses() {
  return apiClient.get("/api/teachers/my/courses");
}

// Alias for TeacherDashboard component
export async function getTeacherCourses() {
  return getMyTeacherCourses();
}

// Get student progress for a specific course
export async function getStudentProgressForCourse(courseId) {
  return apiClient.get(`/api/teachers/my/courses/${courseId}/progress`);
}

// Alias for TeacherCourseProgress component
export async function getCourseProgress(courseId) {
  return getStudentProgressForCourse(courseId);
}

// Get manageable lessons for a course (with module filtering for multi-teacher courses)
export async function getManageableLessons(courseId) {
  return apiClient.get(`/api/teachers/my/courses/${courseId}/lessons`);
}

// Alias for TeacherLessons component
export async function getCourseLessons(courseId) {
  return getManageableLessons(courseId);
}

// ============ ADMIN TEACHER MANAGEMENT ============
// Note: Teachers are created through application approval, not directly

// Get all active teachers (for public pages)
export async function getTeachers() {
  return apiClient.get("/api/teachers?status=approved");
}

export async function getAllTeachers() {
  return apiClient.get("/api/teachers");
}

export async function getTeacherById(id) {
  return apiClient.get(`/api/teachers/${id}`);
}

export async function updateTeacher(id, data) {
  return apiClient.patch(`/api/teachers/${id}`, data);
}

export async function uploadTeacherPhoto(teacherId, file) {
  const formData = new FormData();
  formData.append("photo", file);
  
  const headers = {};
  
  // Add Authorization header with JWT token from localStorage only if token exists and is valid
  const token = localStorage.getItem("accessToken");
  if (token && token.trim()) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const res = await fetch(`${API_BASE_URL}/api/teachers/${teacherId}/photo`, {
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

