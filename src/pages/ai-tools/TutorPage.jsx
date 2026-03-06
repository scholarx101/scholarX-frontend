// src/pages/ai-tools/TutorPage.jsx
import { useState } from "react";
import AIToolLayout from "../../components/AIToolLayout";
import { getTutoring } from "../../api/aiTools";

const LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function TutorPage() {
  const [concept, setConcept] = useState("");
  const [level, setLevel] = useState("beginner");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTutor(e) {
    e.preventDefault();
    if (!concept.trim() || loading) return;

    setError("");
    setResult("");
    setLoading(true);

    try {
      const data = await getTutoring({ concept: concept.trim(), level });
      setResult(data.response || data.explanation || "");
    } catch (err) {
      setError(err.message || "Tutoring request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AIToolLayout title="AI Tutor" subtitle="Personalized tutoring at your level" gradient="from-rose-500 to-pink-500">
      <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-10rem)]">
        {/* Input */}
        <form onSubmit={handleTutor} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Your Level</label>
            <div className="flex gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setLevel(l.value)}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200
                    ${level === l.value
                      ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-rose-300 dark:hover:border-rose-600"
                    }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Concept to Learn</label>
            <textarea
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g., Explain how neural networks learn through backpropagation"
              className="flex-1 min-h-[200px] px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 
                         bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                         placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40 text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !concept.trim()}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-semibold
                       hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-sm"
          >
            {loading ? "Preparing Lesson..." : "Teach Me"}
          </button>
        </form>

        {/* Result */}
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Lesson</h3>
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
                {loading ? "Preparing your lesson..." : "Your personalized lesson will appear here"}
              </div>
            )}
          </div>
        </div>
      </div>
    </AIToolLayout>
  );
}
