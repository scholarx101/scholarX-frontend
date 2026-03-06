// src/pages/ai-tools/AnalyzeDocumentPage.jsx
import { useState } from "react";
import AIToolLayout from "../../components/AIToolLayout";
import { analyzeDocument } from "../../api/aiTools";

const ANALYSIS_TYPES = [
  { value: "summary", label: "Summary" },
  { value: "critique", label: "Critical Analysis" },
  { value: "key-points", label: "Key Points" },
  { value: "methodology", label: "Methodology Review" },
];

export default function AnalyzeDocumentPage() {
  const [documentText, setDocumentText] = useState("");
  const [analysisType, setAnalysisType] = useState("summary");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze(e) {
    e.preventDefault();
    if (!documentText.trim() || loading) return;

    setError("");
    setResult("");
    setLoading(true);

    try {
      const data = await analyzeDocument({ documentText: documentText.trim(), analysisType });
      setResult(data.response || data.analysis || "");
    } catch (err) {
      setError(err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AIToolLayout title="Document Analyzer" subtitle="AI-powered document analysis" gradient="from-emerald-500 to-teal-500">
      <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-10rem)]">
        {/* Input */}
        <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
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
    </AIToolLayout>
  );
}
