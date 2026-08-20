import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, User, Lightbulb, Zap, BookOpen } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AIChatbotDrawer: React.FC = () => {
  const { isAIChatOpen, setIsAIChatOpen, subjects, tasks, productivity, habits } = useStudy();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'Scholar'}! 🌌 I am your AI Study Mentor. I noticed your productivity score is at **${productivity.score}/100** with a **${user?.streakCount || 0}-day streak** 🔥. How can I assist your deep work today?`,
      timestamp: 'Just now',
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAIChatOpen) {
      scrollToBottom();
    }
  }, [messages, isAIChatOpen]);

  if (!isAIChatOpen) return null;

  const quickPrompts = [
    "Recommend optimal study schedule for today",
    "Generate 3 active recall questions for DSA",
    "How to prevent cognitive burnout during exam prep?",
    "Break down Dijkstra's algorithm into simple steps"
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: 'u_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Dynamic AI response generation based on context
    setTimeout(() => {
      let responseText = '';
      const lower = query.toLowerCase();

      if (lower.includes('schedule') || lower.includes('plan')) {
        const pendingTasks = tasks.filter(t => !t.completed).slice(0, 2);
        responseText = `Here is your optimized high-impact study block for today:\n\n1. **Block 1 (50m Focus):** Deep dive into *${pendingTasks[0]?.title || 'Core Subject Problem Sets'}* (Peak alertness).\n2. **Break (10m):** Physical stretch & hydration.\n3. **Block 2 (40m Active Recall):** Tackle *${subjects[0]?.name || 'Linear Algebra'}* flashcards.\n4. **Review (15m):** Log your habit checklist to preserve your ${user?.streakCount || 12}-day streak! 🔥`;
      } else if (lower.includes('dijkstra') || lower.includes('recall') || lower.includes('question')) {
        responseText = `Here are 3 high-yield active recall questions for **Dijkstra & Graph Shortest Paths**:\n\n1. **Why does Dijkstra fail on negative edge weights**, while Bellman-Ford succeeds?\n2. What is the difference in time complexity between using an adjacency matrix $O(V^2)$ vs a binary min-heap $O((V+E)\\log V)$?\n3. When relaxing an edge $(u, v)$ with weight $w$, what is the exact conditional update equation?`;
      } else if (lower.includes('burnout') || lower.includes('fatigue') || lower.includes('stress')) {
        responseText = `To sustain peak cognitive performance without burnout:\n\n• **Ultradian Rhythms:** Work in 50-minute focused sprints followed by 10-minute non-screen breaks.\n• **Binaural Audio:** Use StudySphere's 40Hz Gamma Focus audio in Focus Mode.\n• **Active Recovery:** Go for a 15-minute walk outside; diffused thinking consolidates neural synaptic pathways.`;
      } else {
        responseText = `Great question! Based on your study profile in **${user?.major || 'Computer Science'}**, I recommend prioritizing high-leverage deliberate practice over passive reading. Try breaking this into 25-minute Pomodoro intervals and testing yourself immediately afterwards!`;
      }

      const aiMsg: Message = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 750);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] glass-panel border-l border-white/15 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-glow-purple flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-100">StudySphere AI Mentor</h3>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online & Context-Aware
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAIChatOpen(false)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isAI = m.sender === 'ai';
          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isAI ? 'items-start' : 'items-start flex-row-reverse'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                  isAI
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                    : 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40'
                }`}
              >
                {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isAI
                    ? 'bg-slate-900/80 border border-white/10 text-slate-200 shadow-md'
                    : 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-glow-cyan'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <span className="block mt-1 text-[9px] text-slate-400 text-right opacity-75">
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
            <Bot className="w-4 h-4 animate-spin text-purple-400" />
            <span>AI Mentor is formulating response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="p-3 border-t border-white/5 bg-slate-950/40">
        <p className="text-[10px] text-slate-400 uppercase font-semibold mb-2 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" />
          <span>Quick Prompts</span>
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-[11px] text-slate-300 hover:text-cyan-300 transition-colors whitespace-nowrap"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-white/10 bg-slate-900/90 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your AI Study Mentor anything..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white disabled:opacity-40 shadow-glow-cyan hover:scale-105 transition-transform"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
