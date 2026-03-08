// src/pages/ai-tools/ExplainCodePage.jsx
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AIToolLayout from "../../components/AIToolLayout";
import { explainCode } from "../../api/aiTools";

const LANGUAGES = [
  "JavaScript", "Python", "Java", "C++", "C#", "TypeScript",
  "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "Other",
];

export default function ExplainCodePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const labId = searchParams.get("labId");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleExplain(e) {
    e.preventDefault();
    if (!code.trim() || loading) return;

    setError("");
    setResult("");
    setLoading(true);

    try {
      const data = await explainCode({ code: code.trim(), language, labId });
      setResult(data.response || data.explanation || "");
    } catch (err) {
      setError(err.message || "Explanation failed");
    } finally {
      setLoading(false);
    }
  }

  if (!labId) {
    return (
      <AIToolLayout title="Code Explainer" subtitle="Get clear explanations for any code" gradient="from-violet-500 to-purple-500">
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">AI tools must be accessed through a subscribed lab.</p>
          <button onClick={() => navigate("/student/labs")} className="px-5 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition">Go to My Labs</button>
        </div>
      </AIToolLayout>
    );
  }

  return (
    <AIToolLayout title="Code Explainer" subtitle="Get clear explanations for any code" gradient="from-violet-500 to-purple-500">
      <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-10rem)]">
        {/* Input */}
        <form onSubmit={handleExplain} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 
                         bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm
                         focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Code Snippet</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="flex-1 min-h-[200px] px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 
                         bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                         placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 
                         text-sm font-mono resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold
                       hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-sm"
          >
            {loading ? "Explaining..." : "Explain Code"}
          </button>
        </form>

        {/* Result */}
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Explanation</h3>
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
                {loading ? "Analyzing your code..." : "Explanation will appear here"}
              </div>
            )}
          </div>
        </div>
      </div>
    </AIToolLayout>
  );
}
