// src/api/labSubscriptions.js
import { apiClient } from "./client";

// ============ STUDENT ============

export async function subscribeToLab(labId) {
  return apiClient.post("/api/lab-subscriptions", { labId });
}

export async function getMyLabSubscriptions() {
  return apiClient.get("/api/lab-subscriptions/me");
}

export async function cancelMySubscription(subscriptionId) {
  return apiClient.patch(`/api/lab-subscriptions/${subscriptionId}/cancel`);
}

// ============ ADMIN ============

export async function getAllLabSubscriptions(params = {}) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.labId) query.set("labId", params.labId);
  const qs = query.toString();
  return apiClient.get(`/api/lab-subscriptions${qs ? `?${qs}` : ""}`);
}

export async function getLabSubscribers(labId) {
  return apiClient.get(`/api/lab-subscriptions/lab/${labId}`);
}

export async function updateSubscriptionStatus(subscriptionId, status) {
  return apiClient.patch(`/api/lab-subscriptions/${subscriptionId}/status`, { status });
}
