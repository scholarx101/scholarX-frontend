// src/pages/ai-tools/ChatPage.jsx
import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AIToolLayout from "../../components/AIToolLayout";
import { sendChatMessage, getConversationById } from "../../api/aiTools";

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialConvId = searchParams.get("conversationId");
  const labId = searchParams.get("labId");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(initialConvId || null);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (initialConvId) {
      loadConversation(initialConvId);
    }
  }, [initialConvId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadConversation(id) {
    try {
      setLoading(true);
      const data = await getConversationById(id);
      if (data?.messages) {
        setMessages(data.messages);
        setConversationId(data._id);
      }
    } catch (err) {
      setError(err.message || "Failed to load conversation");
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const data = await sendChatMessage({ message: text, conversationId, labId });
      if (data?.conversationId) setConversationId(data.conversationId);
      setMessages((prev) => [...prev, { role: "assistant", content: data.response || data.message || "" }]);
    } catch (err) {
      setError(err.message || "Failed to get response");
      setMessages((prev) => prev.slice(0, -1)); // remove optimistic user message on error
      setInput(text);
    } finally {
      setLoading(false);
    }
  }

  if (!labId) {
    return (
      <AIToolLayout title="AI Chat Assistant" subtitle="Have an interactive conversation with AI" gradient="from-blue-500 to-cyan-500">
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">AI tools must be accessed through a subscribed lab.</p>
          <button onClick={() => navigate("/student/labs")} className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">Go to My Labs</button>
        </div>
      </AIToolLayout>
    );
  }

  return (
    <AIToolLayout title="AI Chat Assistant" subtitle="Have an interactive conversation with AI" gradient="from-blue-500 to-cyan-500">
      <div className="flex flex-col h-[calc(100vh-10rem)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.length === 0 && !loading && (
            <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500 text-sm">
              Start a conversation — ask anything!
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap
                ${msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-md"
                  : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-md"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {error && (
          <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg mb-3 border border-red-200 dark:border-red-800/30">
            {error}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSend} className="flex gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 
                       bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                       placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold
                       hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-sm"
          >
            Send
          </button>
        </form>
      </div>
    </AIToolLayout>
  );
}
