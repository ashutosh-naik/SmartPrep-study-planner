import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Sparkles,
} from "lucide-react";

const KNOWLEDGE_BASE = [
  { patterns: ["hello", "hi", "hey"], response: "Hello! 👋 I'm your SmartPrep AI assistant. Ask me anything about your subjects, study tips, or platform features!" },
  { patterns: ["study tip", "how to study"], response: "📚 **Core Strategies:**\n\n1. **Spaced Repetition** — Use our Flashcards\n2. **Active Recall** — Test yourself frequently\n3. **Pomodoro** — Use our built-in Focus Timer\n4. **Feynman Technique** — Simplify complex topics" },
  { patterns: ["pomodoro", "focus timer"], response: "⏱️ **Pomodoro Logic:** 25m work, 5m break. You can launch the timer directly from the Study Planner." },
  { patterns: ["dsa", "data structures", "algorithms"], response: "💻 **DSA Overview:** Focus on time complexity (O-notation), standard structures (Trees, Graphs, Stacks), and common patterns (Sliding Window, Two Pointers)." },
  { patterns: ["__default__"], response: "🤔 I'm here to help with study strategies, technical concepts, and platform navigation. Try asking about 'study tips' or 'DSA basics'!" },
];

const generateResponse = (input) => {
  const lower = input.toLowerCase();
  for (const kb of KNOWLEDGE_BASE) {
    if (kb.patterns[0] === "__default__") continue;
    if (kb.patterns.some((p) => lower.includes(p))) return kb.response;
  }
  return KNOWLEDGE_BASE.find((k) => k.patterns[0] === "__default__").response;
};

const STARTERS = [
  "Binary Search Tree basics",
  "Effective study strategies",
  "How to manage backlog",
  "Explain OSI layers",
];

const AIChatAssistant = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: "ai", text: "Welcome to **SmartPrep AI**. How can I assist your study session today?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text = input) => {
    const msg = text.trim();
    if (!msg) return;
    setMessages((m) => [...m, { id: Date.now(), from: "user", text: msg }]);
    setInput(""); setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: Date.now() + 1, from: "ai", text: generateResponse(msg) }]);
    }, 800 + Math.random() * 600);
  };

  const renderText = (text) => {
    return text.split("\n").map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return <span key={i} dangerouslySetInnerHTML={{ __html: bold }} className="block leading-relaxed" />;
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      {!open && (
        <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#111111] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300" aria-label="Open AI assistant">
           <Sparkles size={24} />
        </button>
      )}

      {/* Chat Interface */}
      {open && (
        <div className={`fixed bottom-6 right-6 z-50 w-[380px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#E6E6E6] transition-all duration-300 ${minimized ? "h-16" : "h-[540px]"}`}>
          
          {/* Header */}
          <div className="bg-[#111111] p-5 flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 bg-white/10 rounded-[6px] flex items-center justify-center border border-white/10">
              <Bot size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-[13px] uppercase tracking-widest">SmartPrep AI</h3>
              <p className="text-[#A3A3A3] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#111111] border border-white/40 rounded-full inline-block" /> Active
              </p>
            </div>
            <button onClick={() => setMinimized((m) => !m)} className="text-[#A3A3A3] hover:text-white transition-colors p-1"><Minimize2 size={16} /></button>
            <button onClick={() => setOpen(false)} className="text-[#A3A3A3] hover:text-white transition-colors p-1"><X size={16} /></button>
          </div>

          {!minimized && (
            <>
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F9FAFB]">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.from === "ai" && (
                      <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center shrink-0 mt-1">
                        <Bot size={14} className="text-white" />
                      </div>
                    )}
                    <div className={`max-w-[82%] rounded-xl p-4 text-[13px] leading-relaxed font-medium shadow-sm border ${msg.from === "user" ? "bg-[#111111] text-white border-[#111111]" : "bg-white text-[#111111] border-[#E6E6E6]"}`}>
                      {renderText(msg.text)}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center shrink-0 mt-1">
                       <Bot size={14} className="text-white" />
                    </div>
                    <div className="bg-white border border-[#E6E6E6] rounded-xl px-4 py-3 flex gap-1 items-center">
                       {[0, 1, 2].map((i) => <div key={i} className="w-1.5 h-1.5 bg-[#A3A3A3] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Starter Actions */}
              {messages.length === 1 && (
                <div className="p-3 bg-[#F9FAFB] flex flex-wrap gap-2">
                  {STARTERS.map((s) => (
                    <button key={s} onClick={() => send(s)} className="text-[11px] font-bold bg-white text-[#111111] border border-[#E6E6E6] px-3 py-1.5 rounded-full hover:border-[#111111] transition-all">
                       {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Control */}
              <div className="p-4 border-t border-[#E6E6E6] flex gap-3 bg-white">
                <input className="flex-1 bg-[#F9FAFB] rounded-xl px-4 py-3 text-[13px] font-medium border border-[#E6E6E6] focus:outline-none focus:border-[#111111] transition-all" placeholder="Message assistant..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()} />
                <button onClick={() => send()} disabled={!input.trim()} className="w-12 h-12 bg-[#111111] text-white rounded-xl flex items-center justify-center hover:bg-black disabled:opacity-30 transition-all shrink-0">
                  <Send size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIChatAssistant;
