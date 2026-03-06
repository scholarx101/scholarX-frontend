// src/pages/ai-tools/ConversationsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AIToolLayout from "../../components/AIToolLayout";
import { getConversations, deleteConversation, saveConversation } from "../../api/aiTools";

const TOOL_LABELS = {
  chat: "Chat",
  "analyze-document": "Document Analysis",
  "explain-code": "Code Explainer",
  "generate-ideas": "Research Ideas",
  tutor: "AI Tutor",
  "review-text": "Text Review",
};

const TOOL_COLORS = {
  chat: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "analyze-document": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "explain-code": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "generate-ideas": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  tutor: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  "review-text": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
};

export default function ConversationsPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadConversations();
  }, [filterType]);

  async function loadConversations() {
    try {
      setLoading(true);
      setError("");
      const data = await getConversations({ toolType: filterType || undefined });
      setConversations(Array.isArray(data) ? data : data?.conversations || []);
    } catch (err) {
      setError(err.message || "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this conversation?")) return;
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete");
    }
  }

  async function handleSave(id) {
    try {
      await saveConversation(id);
      setConversations((prev) =>
        prev.map((c) => (c._id === id ? { ...c, saved: true } : c))
      );
    } catch (err) {
      setError(err.message || "Failed to save");
    }
  }

  function handleOpen(conv) {
    if (conv.toolType === "chat") {
      navigate(`/ai-tools/chat?conversationId=${conv._id}`);
    }
  }

  function formatDate(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <AIToolLayout title="My Conversations" subtitle="View and manage your AI tool history" gradient="from-cyan-500 to-indigo-500">
      {/* Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setFilterType("")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
            ${!filterType ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
        >
          All
        </button>
        {Object.entries(TOOL_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilterType(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${filterType === key ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg mb-4 border border-red-200 dark:border-red-800/30">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
            <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 1.136.845 2.1 1.976 2.193 1.07.089 2.15.136 3.24.136m-6.24-6.807c-.34.027-.68.052-1.02.072C3.347 9.465 2.5 10.429 2.5 11.565v4.286c0 1.136.847 2.1 1.98 2.193.34.027.68.052 1.02.072v3.091l3-3c1.354 0 2.694-.055 4.02-.163a2.115 2.115 0 00.825-.242" />
            </svg>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">No conversations yet. Start using an AI tool!</p>
          <button
            onClick={() => navigate("/ai-tools")}
            className="mt-4 px-5 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Explore Tools
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => (
            <div
              key={conv._id}
              className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/50
                         hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleOpen(conv)}
            >
              {/* Tool badge */}
              <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 ${TOOL_COLORS[conv.toolType] || "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>
                {TOOL_LABELS[conv.toolType] || conv.toolType}
              </span>

              {/* Title / Preview */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {conv.title || conv.messages?.[0]?.content?.slice(0, 80) || "Untitled"}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {formatDate(conv.updatedAt || conv.createdAt)}
                  {conv.messages && ` · ${conv.messages.length} messages`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                {!conv.saved && (
                  <button
                    onClick={() => handleSave(conv._id)}
                    title="Save"
                    className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                  </button>
                )}
                {conv.saved && (
                  <span className="p-2 text-emerald-500" title="Saved">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                  </span>
                )}
                <button
                  onClick={() => handleDelete(conv._id)}
                  title="Delete"
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AIToolLayout>
  );
}
