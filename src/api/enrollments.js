// src/api/enrollments.js
import { apiClient } from "./client";

// Get student's enrollments (student dashboard)
export async function getMyEnrollments() {
  return apiClient.get("/api/enrollments/my");
}

// Mark a lesson as complete
export async function markLessonComplete(courseId, lessonId) {
  return apiClient.post(`/api/enrollments/${courseId}/lessons/${lessonId}/complete`);
}

// Get all enrollments (admin only)
export async function getAllEnrollments() {
  return apiClient.get("/api/enrollments");
}

// Get enrollments for a specific course (admin only)
export async function getCourseEnrollments(courseId) {
  return apiClient.get(`/api/enrollments/course/${courseId}`);
}

// Get enrollment summary for a course (admin only)
export async function getCourseEnrollmentSummary(courseId) {
  return apiClient.get(`/api/enrollments/course/${courseId}/summary`);
}

// Update enrollment status (admin only)
export async function updateEnrollmentStatus(enrollmentId, status) {
  return apiClient.patch(`/api/enrollments/${enrollmentId}/status`, { status });
}
