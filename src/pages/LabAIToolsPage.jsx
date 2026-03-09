// src/pages/LabAIToolsPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getLabById } from "../api/labs";
import { getMyLabSubscriptions } from "../api/labSubscriptions";
import { getLabTools, getConversations, deleteConversation } from "../api/aiTools";

const TOOL_META = {
  chat: {
    path: "/ai-tools/chat",
    label: "AI Chat Assistant",
    icon: "💬",
    description: "Chat with an AI assistant for research help",
    color: "from-blue-500 to-cyan-500",
  },
  document_analysis: {
    path: "/ai-tools/analyze-document",
    label: "Document Analyzer",
    icon: "📄",
    description: "Analyze and extract insights from documents",
    color: "from-emerald-500 to-teal-500",
  },
  code_explanation: {
    path: "/ai-tools/explain-code",
    label: "Code Explainer",
    icon: "💻",
    description: "Understand and explain code snippets",
    color: "from-violet-500 to-purple-500",
  },
  idea_generation: {
    path: "/ai-tools/generate-ideas",
    label: "Research Ideas",
    icon: "💡",
    description: "Generate research topic ideas and outlines",
    color: "from-amber-500 to-orange-500",
  },
  tutoring: {
    path: "/ai-tools/tutor",
    label: "AI Tutor",
    icon: "🎓",
    description: "Get personalized tutoring on any topic",
    color: "from-rose-500 to-pink-500",
  },
  text_review: {
    path: "/ai-tools/review-text",
    label: "Text Reviewer",
    icon: "📋",
    description: "Review and improve your writing",
    color: "from-indigo-500 to-blue-500",
  },
};

const ALL_TOOL_KEYS = ["chat", "document_analysis", "code_explanation", "idea_generation", "tutoring", "text_review"];

export default function LabAIToolsPage() {
  const { labId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lab, setLab] = useState(null);
  const [tools, setTools] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [convLoading, setConvLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, [labId]);

  useEffect(() => {
    if (user) loadConversations();
  }, [labId, user]);

  async function load() {
    try {
      setLoading(true);
      setError("");

      const [labResult, toolsResult] = await Promise.allSettled([
        getLabById(labId),
        getLabTools(labId),
      ]);

      if (labResult.status === "fulfilled") setLab(labResult.value);
      if (toolsResult.status === "fulfilled") {
        setTools(Array.isArray(toolsResult.value) ? toolsResult.value : []);
      }

      // admins bypass subscription check
      if (user?.role === "admin") {
        setIsSubscribed(true);
      } else if (user) {
        try {
          const subs = await getMyLabSubscriptions();
          const mine = (Array.isArray(subs) ? subs : []).find(
            (s) => (s.lab?._id || s.lab) === labId
          );
          setIsSubscribed(mine?.status === "active");
        } catch {
          // ignore
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load lab");
    } finally {
      setLoading(false);
    }
  }

  async function loadConversations() {
    try {
      setConvLoading(true);
      const convs = await getConversations({ labId });
      setConversations(Array.isArray(convs) ? convs : []);
    } catch {
      // ignore
    } finally {
      setConvLoading(false);
    }
  }

  async function handleDeleteConv(convId) {
    if (!window.confirm("Delete this conversation?")) return;
    try {
      await deleteConversation(convId);
      setConversations((prev) => prev.filter((c) => c._id !== convId));
    } catch (err) {
      alert(err.message || "Failed to delete");
    }
  }

  // Merge API response with all known tools — always show all 6
  const toolsMap = tools.reduce((acc, t) => { acc[t.key] = t.enabled; return acc; }, {});
  const allTools = ALL_TOOL_KEYS.map((key) => ({
    key,
    enabled: toolsMap[key] ?? false,
    ...TOOL_META[key],
  }));

  const canUseTool = (enabled) => enabled && isSubscribed;

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 text-white -mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg">
              🧪
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-0.5">AI Research Tools</p>
              <h1 className="text-2xl sm:text-3xl font-bold">{lab?.name || "Lab AI Tools"}</h1>
            </div>
          </div>

          {!isSubscribed && (
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              You need an active subscription to use these tools
              <button
                onClick={() => navigate(`/labs/${labId}`)}
                className="ml-2 underline text-amber-200 hover:text-white transition text-xs"
              >
                Subscribe →
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Tools Grid */}
        <section>
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Available Tools</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {isSubscribed
                  ? "Click an enabled tool to start using it."
                  : "Subscribe to this lab to unlock access to AI tools."}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allTools.map((tool) => {
              const canUse = canUseTool(tool.enabled);
              return (
                <div
                  key={tool.key}
                  onClick={() => canUse && navigate(`${tool.path}?labId=${labId}`)}
                  className={`relative rounded-2xl border p-5 flex items-start gap-4 transition-all duration-200
                    ${canUse
                      ? "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group"
                      : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 cursor-default"
                    }`}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-lg flex-shrink-0 shadow-md`}>
                    {tool.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {tool.label}
                      </span>
                      {!tool.enabled && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500">
                          Not enabled
                        </span>
                      )}
                      {tool.enabled && !isSubscribed && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                          🔒 Subscribe
                        </span>
                      )}
                      {canUse && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                          Available
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{tool.description}</p>
                    {canUse && (
                      <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1.5 font-medium group-hover:underline">
                        Open tool →
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Conversations */}
        <section>
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Conversations</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Your AI tool conversation history in this lab
              </p>
            </div>
            {conversations.length > 0 && (
              <button
                onClick={() => navigate("/ai-tools/conversations")}
                className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline flex-shrink-0"
              >
                View all →
              </button>
            )}
          </div>

          {convLoading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 py-6">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-500 border-t-transparent" />
              Loading conversations...
            </div>
          ) : conversations.length === 0 ? (
            <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 p-10 text-center">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">No conversations yet</p>
              <p className="text-xs text-slate-400">
                {isSubscribed ? "Start a tool above to begin a conversation." : "Subscribe to this lab to start using AI tools."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {conversations.slice(0, 10).map((conv) => {
                const toolMeta = TOOL_META[conv.toolType] || {};
                return (
                  <div
                    key={conv._id}
                    className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 flex items-center gap-4 hover:border-cyan-200 dark:hover:border-cyan-800 transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${toolMeta.color || "from-slate-500 to-slate-600"} flex items-center justify-center text-base flex-shrink-0`}>
                      {toolMeta.icon || "🤖"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {conv.title || `${toolMeta.label || conv.toolType} conversation`}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(conv.updatedAt || conv.createdAt).toLocaleString()}
                        {conv.status === "saved" && (
                          <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-medium">● Saved</span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() =>
                          navigate(
                            `${toolMeta.path || "/ai-tools/chat"}?labId=${labId}&conversationId=${conv._id}`
                          )
                        }
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded-lg font-medium transition"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleDeleteConv(conv._id)}
                        className="px-3 py-1.5 border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs rounded-lg font-medium transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
              {conversations.length > 10 && (
                <p className="text-xs text-center text-slate-400 pt-2">
                  Showing 10 of {conversations.length}.{" "}
                  <button
                    onClick={() => navigate("/ai-tools/conversations")}
                    className="text-cyan-500 hover:underline"
                  >
                    View all
                  </button>
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
