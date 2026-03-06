// src/api/payments.js
import { apiClient } from "./client";

// ============ STUDENT — initiate payments ============

/**
 * Initiate a course payment.
 * @param {{ courseId: string, paymentPlan: 'combo'|'monthly'|'semester', unitsCount?: number, batchId?: string }} data
 * @returns {{ gatewayUrl: string, tranId: string, amount: number, currency: string, enrollmentId: string }}
 */
export async function initCoursePayment(data) {
  return apiClient.post("/api/payments/course/init", data);
}

/**
 * Initiate a lab subscription payment.
 * @param {{ labId: string }} data
 * @returns {{ gatewayUrl: string, tranId: string, amount: number, currency: string }}
 */
export async function initLabPayment(data) {
  return apiClient.post("/api/payments/lab/init", data);
}

// ============ STUDENT — history ============

/** Get current student's payment history */
export async function getMyPayments() {
  return apiClient.get("/api/payments/me");
}

/** Get a single transaction by ID (student or admin) */
export async function getPaymentTransaction(tranId) {
  return apiClient.get(`/api/payments/transaction/${encodeURIComponent(tranId)}`);
}

// ============ ADMIN ============

/**
 * Get all payments (admin only).
 * @param {{ type?: 'course'|'lab', status?: string }} params
 */
export async function getAllPayments(params = {}) {
  const query = new URLSearchParams();
  if (params.type) query.set("type", params.type);
  if (params.status) query.set("status", params.status);
  const qs = query.toString();
  return apiClient.get(`/api/payments${qs ? `?${qs}` : ""}`);
}
