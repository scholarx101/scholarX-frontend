// src/pages/ai-tools/ReviewTextPage.jsx
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AIToolLayout from "../../components/AIToolLayout";
import { reviewText } from "../../api/aiTools";

const REVIEW_TYPES = [
  { value: "academic", label: "Academic Paper" },
  { value: "technical", label: "Technical Writing" },
  { value: "proposal", label: "Research Proposal" },
  { value: "general", label: "General Review" },
];

export default function ReviewTextPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const labId = searchParams.get("labId");
  const [text, setText] = useState("");
  const [reviewType, setReviewType] = useState("academic");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleReview(e) {
    e.preventDefault();
    if (!text.trim() || loading) return;

    setError("");
    setResult("");
    setLoading(true);

    try {
      const data = await reviewText({ text: text.trim(), reviewType, labId });
      setResult(data.response || data.review || "");
    } catch (err) {
      setError(err.message || "Review failed");
    } finally {
      setLoading(false);
    }
  }

  if (!labId) {
    return (
      <AIToolLayout title="Text Reviewer" subtitle="Get comprehensive feedback on your writing" gradient="from-indigo-500 to-blue-500">
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">AI tools must be accessed through a subscribed lab.</p>
          <button onClick={() => navigate("/student/labs")} className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition">Go to My Labs</button>
        </div>
      </AIToolLayout>
    );
  }

  return (
    <AIToolLayout title="Text Reviewer" subtitle="Get comprehensive feedback on your writing" gradient="from-indigo-500 to-blue-500">
      <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-10rem)]">
        {/* Input */}
        <form onSubmit={handleReview} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Review Type</label>
            <select
              value={reviewType}
              onChange={(e) => setReviewType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 
                         bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              {REVIEW_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Text to Review</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here for review..."
              className="flex-1 min-h-[200px] px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 
                         bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                         placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-semibold
                       hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-sm"
          >
            {loading ? "Reviewing..." : "Review Text"}
          </button>
        </form>

        {/* Result */}
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Review Feedback</h3>
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
                {loading ? "Reviewing your text..." : "Feedback will appear here"}
              </div>
            )}
          </div>
        </div>
      </div>
    </AIToolLayout>
  );
}
