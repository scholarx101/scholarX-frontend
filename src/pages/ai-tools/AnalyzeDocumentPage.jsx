// src/pages/ai-tools/AnalyzeDocumentPage.jsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AIToolLayout from "../../components/AIToolLayout";
import { analyzeDocument, getConversations, getConversationById, deleteConversation } from "../../api/aiTools";

const ANALYSIS_TYPES = [
  { value: "summary", label: "Summary" },
  { value: "critique", label: "Critical Analysis" },
  { value: "key-points", label: "Key Points" },
  { value: "methodology", label: "Methodology Review" },
];

export default function AnalyzeDocumentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const labId = searchParams.get("labId");
  const [documentText, setDocumentText] = useState("");
  const [analysisType, setAnalysisType] = useState("summary");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conversations, setConversations] = useState([]);
  const [convsLoading, setConvsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedConvId, setSelectedConvId] = useState(null);

  // Load conversations
  useEffect(() => {
    if (labId) loadConversations();
  }, [labId]);

  async function loadConversations() {
    try {
      setConvsLoading(true);
      const convs = await getConversations({ toolType: "document_analysis", labId });
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
        // Extract document text and analysis from the conversation
        const lastMessage = data.messages?.[0];
        if (lastMessage) {
          setDocumentText(lastMessage.content || "");
          setResult(data.messages?.[1]?.content || "");
        }
      }
    } catch (err) {
      alert("Failed to load previous analysis");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteConv(id, e) {
    e.stopPropagation();
    if (!window.confirm("Delete this analysis?")) return;
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (selectedConvId === id) {
        setSelectedConvId(null);
        setDocumentText("");
        setResult("");
      }
    } catch (err) {
      alert(err.message || "Failed to delete");
    }
  }

  async function handleAnalyze(e) {
    e.preventDefault();
    if (!documentText.trim() || loading) return;

    setError("");
    setResult("");
    setSelectedConvId(null);
    setLoading(true);

    try {
      const data = await analyzeDocument({ documentText: documentText.trim(), analysisType, labId });
      setResult(data.response || data.analysis || "");
      // Refresh conversations list
      await loadConversations();
    } catch (err) {
      setError(err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  if (!labId) {
    return (
      <AIToolLayout title="Document Analyzer" subtitle="AI-powered document analysis" gradient="from-emerald-500 to-teal-500">
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">AI tools must be accessed through a subscribed lab.</p>
          <button onClick={() => navigate("/student/labs")} className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition">Go to My Labs</button>
        </div>
      </AIToolLayout>
    );
  }

  return (
    <AIToolLayout title="Document Analyzer" subtitle="AI-powered document analysis" gradient="from-emerald-500 to-teal-500">
      <div className="flex h-[calc(100vh-10rem)] gap-4">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? "w-72" : "w-0"} flex-shrink-0 transition-all duration-200 flex flex-col border-r border-slate-200 dark:border-slate-800 overflow-hidden`}>
          {sidebarOpen && (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    setDocumentText("");
                    setResult("");
                    setSelectedConvId(null);
                  }}
                  className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium hover:from-emerald-500 hover:to-teal-500 transition"
                >
                  + New Analysis
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {convsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent" />
                  </div>
                ) : conversations.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center">No analyses yet</p>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv._id}
                      onClick={() => loadConversation(conv._id)}
                      className={`p-3 rounded-lg cursor-pointer transition-all group text-left ${
                        selectedConvId === conv._id
                          ? "bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700"
                          : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                            {conv.title || "Document analysis"}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {new Date(conv.updatedAt || conv.createdAt).toLocaleDateString()}
                          </p>
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
          {/* Toggle sidebar button */}
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
            <form onSubmit={handleAnalyze} className="flex flex-col gap-4 overflow-auto pb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Analysis Type</label>
                <select
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 
                             bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm
                             focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                  {ANALYSIS_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Document Text</label>
                <textarea
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder="Paste your document text here..."
                  className="flex-1 min-h-[200px] px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 
                             bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                             placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-sm resize-none"
                />
              </div>

          <button
            type="submit"
            disabled={loading || !documentText.trim()}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold
                       hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-sm"
          >
            {loading ? "Analyzing..." : "Analyze Document"}
          </button>
            </form>

            {/* Result */}
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Result</h3>
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
                    {loading ? "Analyzing your document..." : "Results will appear here"}
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
