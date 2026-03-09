// src/pages/ai-tools/GenerateIdeasPage.jsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AIToolLayout from "../../components/AIToolLayout";
import { generateIdeas, getConversations, getConversationById, deleteConversation } from "../../api/aiTools";

export default function GenerateIdeasPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const labId = searchParams.get("labId");
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conversations, setConversations] = useState([]);
  const [convsLoading, setConvsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedConvId, setSelectedConvId] = useState(null);

  useEffect(() => {
    if (labId) loadConversations();
  }, [labId]);

  async function loadConversations() {
    try {
      setConvsLoading(true);
      const convs = await getConversations({ toolType: "idea_generation", labId });
      setConversations(Array.isArray(convs) ? convs : []);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setConvsLoading(false);
    }
  }

  async function loadConversation(id) {
    try {
      setLoading(true);
      const data = await getConversationById(id);
      if (data) {
        setSelectedConvId(data._id);
        const lastMessage = data.messages?.[0];
        if (lastMessage) {
          setTopic(lastMessage.content || "");
          setResult(data.messages?.[1]?.content || "");
        }
      }
    } catch (err) {
      alert("Failed to load previous ideas");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteConv(id, e) {
    e.stopPropagation();
    if (!window.confirm("Delete this idea set?")) return;
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (selectedConvId === id) {
        setSelectedConvId(null);
        setTopic("");
        setResult("");
      }
    } catch (err) {
      alert(err.message || "Failed to delete");
    }
  }

  async function handleGenerate(e) {
    e.preventDefault();
    if (!topic.trim() || loading) return;

    setError("");
    setResult("");
    setSelectedConvId(null);
    setLoading(true);

    try {
      const data = await generateIdeas({ topic: topic.trim(), context: context.trim() || undefined, labId });
      setResult(data.response || data.ideas || "");
      await loadConversations();
    } catch (err) {
      setError(err.message || "Failed to generate ideas");
    } finally {
      setLoading(false);
    }
  }

  if (!labId) {
    return (
      <AIToolLayout title="Research Idea Generator" subtitle="Get creative research ideas on any topic" gradient="from-amber-500 to-orange-500">
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">AI tools must be accessed through a subscribed lab.</p>
          <button onClick={() => navigate("/student/labs")} className="px-5 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition">Go to My Labs</button>
        </div>
      </AIToolLayout>
    );
  }

  return (
    <AIToolLayout title="Research Idea Generator" subtitle="Get creative research ideas on any topic" gradient="from-amber-500 to-orange-500">
      <div className="flex h-[calc(100vh-10rem)] gap-4">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? "w-72" : "w-0"} flex-shrink-0 transition-all duration-200 flex flex-col border-r border-slate-200 dark:border-slate-800 overflow-hidden`}>
          {sidebarOpen && (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    setTopic("");
                    setContext("");
                    setResult("");
                    setSelectedConvId(null);
                  }}
                  className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-medium hover:from-amber-500 hover:to-orange-500 transition"
                >
                  + New Ideas
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {convsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-500 border-t-transparent" />
                  </div>
                ) : conversations.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center">No idea sets yet</p>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv._id}
                      onClick={() => loadConversation(conv._id)}
                      className={`p-3 rounded-lg cursor-pointer transition-all group text-left ${
                        selectedConvId === conv._id
                          ? "bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700"
                          : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{conv.title || "Research ideas"}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{new Date(conv.updatedAt || conv.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button
                          onClick={(e) => handleDeleteConv(conv._id, e)}
                          className="opacity-0 group-hover:opacity-100 px-1.5 py-1 rounded text-[10px] text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute top-4 left-4 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={sidebarOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
            </svg>
          </button>

          <div className="grid lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
            {/* Input */}
            <form onSubmit={handleGenerate} className="flex flex-col gap-4 overflow-auto pb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Research Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Machine Learning in Healthcare"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 
                             bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                             placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-sm"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Additional Context <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Add any specific constraints, focus areas, or background info..."
                  className="flex-1 min-h-[150px] px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 
                             bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                             placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-semibold
                           hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 shadow-sm"
              >
                {loading ? "Generating Ideas..." : "Generate Ideas"}
              </button>
            </form>

            {/* Result */}
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Generated Ideas</h3>
              <div className="flex-1 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                {error && (
                  <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg border border-red-200 dark:border-red-800/30">
                    {error}
                  </div>
                )}
                {result ? (
                  <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{result}</div>
                ) : !error && (
                  <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500 text-sm">
                    {loading ? "Brainstorming ideas..." : "Ideas will appear here"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AIToolLayout>
  );
}
