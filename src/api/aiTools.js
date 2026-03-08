// src/api/aiTools.js
import { apiClient } from "./client";

// ============ LAB TOOLS (PUBLIC) ============

export async function getLabTools(labId) {
  return apiClient.get(`/api/ai-tools/labs/${labId}/tools`);
}

// ============ AI TOOL ENDPOINTS ============

export async function sendChatMessage({ message, conversationId, labId, courseId }) {
  return apiClient.post("/api/ai-tools/chat", { message, conversationId, labId, courseId });
}

export async function analyzeDocument({ documentText, analysisType, labId }) {
  return apiClient.post("/api/ai-tools/analyze-document", { documentText, analysisType, labId });
}

export async function explainCode({ code, language, labId }) {
  return apiClient.post("/api/ai-tools/explain-code", { code, language, labId });
}

export async function generateIdeas({ topic, context, labId }) {
  return apiClient.post("/api/ai-tools/generate-ideas", { topic, context, labId });
}

export async function getTutoring({ concept, level, labId }) {
  return apiClient.post("/api/ai-tools/tutor", { concept, level, labId });
}

export async function reviewText({ text, reviewType, labId }) {
  return apiClient.post("/api/ai-tools/review-text", { text, reviewType, labId });
}

// ============ CONVERSATIONS ============

export async function getConversations({ toolType, labId, status } = {}) {
  const params = new URLSearchParams();
  if (toolType) params.set("toolType", toolType);
  if (labId) params.set("labId", labId);
  if (status) params.set("status", status);
  const qs = params.toString();
  return apiClient.get(`/api/ai-tools/conversations${qs ? `?${qs}` : ""}`);
}

export async function getConversationById(conversationId) {
  return apiClient.get(`/api/ai-tools/conversations/${conversationId}`);
}

export async function saveConversation(conversationId) {
  return apiClient.patch(`/api/ai-tools/conversations/${conversationId}/save`);
}

export async function deleteConversation(conversationId) {
  return apiClient.del(`/api/ai-tools/conversations/${conversationId}`);
}

// ============ ADMIN ============

export async function getAIUsageStats() {
  return apiClient.get("/api/ai-tools/admin/stats");
}
